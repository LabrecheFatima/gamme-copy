const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dirs = [
  'config',
  'controllers',
  'middlewares',
  'routes',
  'temp_imports',
  'temp_uploads',
  'uploads'
];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

const files = {
  '.env': `PORT=3000
NODE_ENV=development
DB_CLIENT=sqlite3
DB_FILENAME=./dev.sqlite3
JWT_SECRET=dev_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173

ADMIN_USERNAME=admin
ADMIN_PASSWORD=SuperAdminPassword123!
`,

  'config/db.js': `const path = require('path');
const knex = require('knex');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const isSqlite = process.env.DB_CLIENT === 'sqlite3';

const config = isSqlite
  ? {
      client: 'sqlite3',
      connection: {
        filename: path.join(__dirname, '..', process.env.DB_FILENAME || 'dev.sqlite3'),
      },
      useNullAsDefault: true,
    }
  : {
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
      },
      pool: { min: 0, max: 7 },
    };

const db = knex(config);

async function initDb() {
  if (isSqlite) {
    const hasAdmins = await db.schema.hasTable('admins');
    if (!hasAdmins) {
      await db.schema.createTable('admins', table => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password_hash').notNullable();
        table.timestamps(true, true);
      });

      // Insertion automatique de l'administrateur unique défini dans le .env
      const defaultAdmin = process.env.ADMIN_USERNAME || 'admin';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = await bcrypt.hash(defaultPassword, 10);
      await db('admins').insert({ username: defaultAdmin, password_hash: hash });
    }

    const hasCategories = await db.schema.hasTable('categories');
    if (!hasCategories) {
      await db.schema.createTable('categories', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('slug').notNullable().unique();
        table.string('usage_method').nullable(); // Colonne optionnelle pour la méthode d'utilisation
        table.timestamps(true, true);
      });
    }

    const hasProducts = await db.schema.hasTable('products');
    if (!hasProducts) {
      await db.schema.createTable('products', table => {
        table.increments('id').primary();
        table.integer('category_id').references('id').inTable('categories').onDelete('SET NULL');
        table.string('name').notNullable();
        table.string('slug').notNullable().unique();
        table.text('description');
        table.decimal('original_price', 10, 2).notNullable();
        table.decimal('promo_price', 10, 2).nullable(); // Colonne optionnelle
        table.integer('stock_quantity').notNullable().defaultTo(0);
        table.string('image_url').nullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
      });
    }

    const hasOrders = await db.schema.hasTable('orders');
    if (!hasOrders) {
      await db.schema.createTable('orders', table => {
        table.increments('id').primary();
        table.string('customer_first_name').notNullable();
        table.string('customer_last_name').notNullable();
        table.string('customer_phone').notNullable();
        table.string('wilaya').notNullable();
        table.string('commune').notNullable();
        table.text('delivery_address').notNullable();
        table.string('status').defaultTo('en_attente');
        table.decimal('total_amount', 10, 2).notNullable();
        table.text('notes').nullable();
        table.timestamps(true, true);
      });
    }

    const hasOrderItems = await db.schema.hasTable('order_items');
    if (!hasOrderItems) {
      await db.schema.createTable('order_items', table => {
        table.increments('id').primary();
        table.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
        table.integer('product_id').references('id').inTable('products').onDelete('SET NULL');
        table.string('product_name').notNullable();
        table.decimal('unit_price', 10, 2).notNullable();
        table.integer('quantity').notNullable();
      });
    }
  }
}

initDb();
module.exports = db;
`,

  'middlewares/auth.js': `const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Accès refusé' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};
`,

  'middlewares/upload.js': `const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, '..', 'temp_uploads');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase());
  cb(ok ? null : new Error('Format image non autorisé'), ok);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
`,

  'controllers/admin.controller.js': `const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await db('admins').where({ username }).first();
    if (!admin) return res.status(400).json({ error: 'Identifiants incorrects' });

    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Identifiants incorrects' });

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`,

  'controllers/categories.controller.js': `const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const categories = await db('categories').select('*');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, slug, usage_method } = req.body;
  try {
    const [id] = await db('categories').insert({
      name,
      slug,
      usage_method: usage_method || null
    });
    res.status(201).json({ id, name, slug, usage_method: usage_method || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, slug, usage_method } = req.body;
  try {
    await db('categories').where({ id }).update({
      name,
      slug,
      usage_method: usage_method || null
    });
    res.json({ message: 'Catégorie mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await db('categories').where({ id }).del();
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`,

  'controllers/products.controller.js': `const db = require('../config/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.getAll = async (req, res) => {
  const { category, minPrice, maxPrice, search, page = 1, limit = 24 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = db('products').where('is_active', 1);
    if (category) query = query.andWhere('category_id', category);
    if (minPrice) query = query.andWhere('original_price', '>=', minPrice);
    if (maxPrice) query = query.andWhere('original_price', '<=', maxPrice);
    if (search) query = query.andWhere('name', 'like', \`%\${search}%\`);

    const totalRes = await query.clone().count('id as count').first();
    const products = await query.clone().limit(limit).offset(offset).select('*');

    res.json({
      data: products.map(p => ({
        ...p,
        final_price: p.promo_price ?? p.original_price,
        has_promo: p.promo_price !== null && p.promo_price !== undefined,
      })),
      pagination: { page: Number(page), limit: Number(limit), total: totalRes.count || totalRes['count'] },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const product = await db('products').where({ slug: req.params.slug, is_active: 1 }).first();
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json({
      ...product,
      final_price: product.promo_price ?? product.original_price,
      has_promo: product.promo_price !== null && product.promo_price !== undefined,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { category_id, name, slug, description, original_price, promo_price, stock_quantity } = req.body;
  let image_url = null;

  try {
    if (req.file) {
      const filename = Date.now() + '.webp';
      const outputPath = path.join(__dirname, '..', 'uploads', filename);
      await sharp(req.file.path).resize(800, 800, { fit: 'inside' }).webp({ quality: 80 }).toFile(outputPath);
      fs.unlinkSync(req.file.path);
      image_url = '/uploads/' + filename;
    }

    const [id] = await db('products').insert({
      category_id: category_id || null,
      name,
      slug,
      description: description || '',
      original_price,
      promo_price: promo_price ? Number(promo_price) : null,
      stock_quantity: stock_quantity || 0,
      image_url,
      is_active: 1
    });

    res.status(201).json({ id, message: 'Produit créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, slug, description, original_price, promo_price, stock_quantity, is_active } = req.body;

  try {
    const updateData = {
      category_id: category_id || null,
      name,
      slug,
      description,
      original_price,
      promo_price: promo_price ? Number(promo_price) : null,
      stock_quantity,
      is_active
    };

    if (req.file) {
      const filename = Date.now() + '.webp';
      const outputPath = path.join(__dirname, '..', 'uploads', filename);
      await sharp(req.file.path).resize(800, 800, { fit: 'inside' }).webp({ quality: 80 }).toFile(outputPath);
      fs.unlinkSync(req.file.path);
      updateData.image_url = '/uploads/' + filename;
    }

    await db('products').where({ id }).update(updateData);
    res.json({ message: 'Produit mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await db('products').where({ id: req.params.id }).del();
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`,

  'controllers/orders.controller.js': `const db = require('../config/db');

exports.create = async (req, res) => {
  const { customer_first_name, customer_last_name, customer_phone, wilaya, commune, delivery_address, items, notes } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Le panier est vide' });
  }

  try {
    let total_amount = 0;
    const orderItemsToInsert = [];

    for (const item of items) {
      const product = await db('products').where({ id: item.id }).first();
      if (product) {
        const unit_price = product.promo_price ?? product.original_price;
        total_amount += unit_price * item.qty;
        orderItemsToInsert.push({
          product_id: product.id,
          product_name: product.name,
          unit_price,
          quantity: item.qty,
        });
      }
    }

    const [order_id] = await db('orders').insert({
      customer_first_name,
      customer_last_name,
      customer_phone,
      wilaya,
      commune,
      delivery_address,
      total_amount,
      notes,
      status: 'en_attente'
    });

    const itemsWithOrderId = orderItemsToInsert.map(i => ({ ...i, order_id }));
    await db('order_items').insert(itemsWithOrderId);

    res.status(201).json({ order_id, message: 'Commande enregistrée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const orders = await db('orders').select('*').orderBy('id', 'desc');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db('orders').where({ id }).update({ status });
    res.json({ message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`,

  'routes/admin.routes.js': `const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const categoriesController = require('../controllers/categories.controller');
const productsController = require('../controllers/products.controller');
const ordersController = require('../controllers/orders.controller');

const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Route publique de connexion Administrateur
router.post('/login', adminController.login);

// Routes Administrateur Protégées
router.post('/categories', auth, categoriesController.create);
router.put('/categories/:id', auth, categoriesController.update);
router.delete('/categories/:id', auth, categoriesController.delete);

router.post('/products', auth, upload.single('image'), productsController.create);
router.put('/products/:id', auth, upload.single('image'), productsController.update);
router.delete('/products/:id', auth, productsController.delete);

router.get('/orders', auth, ordersController.getAll);
router.put('/orders/:id/status', auth, ordersController.updateStatus);

module.exports = router;
`,

  'routes/public.routes.js': `const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const categoriesController = require('../controllers/categories.controller');
const ordersController = require('../controllers/orders.controller');

router.get('/products', productsController.getAll);
router.get('/products/:slug', productsController.getBySlug);
router.get('/categories', categoriesController.getAll);
router.post('/orders', ordersController.create);

module.exports = router;
`,

  'app.js': `const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Backend démarré sur le port \${PORT}\`));

module.exports = app;
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim());
  console.log(`Créé : ${filePath}`);
});

console.log('✅ Configuration du backend mise à jour avec succès !');