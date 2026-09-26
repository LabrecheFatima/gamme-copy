const db = require('../config/db');
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
    if (search) query = query.andWhere('name', 'like', `%${search}%`);

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