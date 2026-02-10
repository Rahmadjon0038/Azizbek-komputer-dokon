const {
  getAllCategories,
  createCategory,
  getCategoryByName,
  getCategoryById,
  deleteCategoryById,
} = require('../models/categoryModel');
const {
  getAllComputers,
  getComputerById,
  createComputer,
  updateComputerLike,
  updateComputerCart,
  deleteComputerById,
} = require('../models/computerModel');

const listCategories = (req, res) => {
  const categories = getAllCategories();
  return res.json({ categories });
};

const addCategory = (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) {
    return res.status(400).json({ message: 'Category nomi majburiy' });
  }

  const exists = getCategoryByName(name);
  if (exists) {
    return res.status(409).json({ message: 'Bunday category allaqachon mavjud' });
  }

  const id = createCategory(name);
  return res.status(201).json({
    message: 'Category yaratildi',
    category: getCategoryById(id),
  });
};

const removeCategory = (req, res) => {
  const id = Number(req.params.id);
  const category = getCategoryById(id);
  if (!category) {
    return res.status(404).json({ message: 'Category topilmadi' });
  }

  deleteCategoryById(id);
  return res.json({ message: 'Category o‘chirildi' });
};

const listComputers = (req, res) => {
  const computers = getAllComputers();
  return res.json({ computers });
};

const addComputer = (req, res) => {
  const name = (req.body.name || '').trim();
  const price = (req.body.price || '').trim();
  const img = (req.body.img || '').trim();
  const categoryId = req.body.categoryId ? Number(req.body.categoryId) : null;

  if (!name || !price || !img) {
    return res.status(400).json({ message: 'name, price va img majburiy' });
  }

  if (categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category topilmadi' });
    }
  }

  const id = createComputer({ name, price, img, categoryId });
  return res.status(201).json({
    message: 'Komputer e‘loni qo‘shildi',
    computer: getComputerById(id),
  });
};

const toggleLike = (req, res) => {
  const id = Number(req.params.id);
  const computer = getComputerById(id);
  if (!computer) {
    return res.status(404).json({ message: 'Komputer topilmadi' });
  }

  const isLiked = typeof req.body.isLiked === 'boolean' ? req.body.isLiked : !computer.isLiked;
  updateComputerLike(id, isLiked);

  return res.json({
    message: isLiked ? 'Sevimlilarga qo‘shildi' : 'Sevimlilardan olib tashlandi',
    computer: getComputerById(id),
  });
};

const toggleCart = (req, res) => {
  const id = Number(req.params.id);
  const computer = getComputerById(id);
  if (!computer) {
    return res.status(404).json({ message: 'Komputer topilmadi' });
  }

  const inCart = typeof req.body.inCart === 'boolean' ? req.body.inCart : !computer.inCart;
  updateComputerCart(id, inCart);

  return res.json({
    message: inCart ? 'Savatga qo‘shildi' : 'Savatdan olib tashlandi',
    computer: getComputerById(id),
  });
};

const listFavorites = (req, res) => {
  const favorites = getAllComputers().filter((item) => item.isLiked);
  return res.json({ favorites });
};

const listCart = (req, res) => {
  const cart = getAllComputers().filter((item) => item.inCart);
  return res.json({ cart });
};

const removeComputer = (req, res) => {
  const id = Number(req.params.id);
  const computer = getComputerById(id);
  if (!computer) {
    return res.status(404).json({ message: 'E‘lon topilmadi' });
  }

  deleteComputerById(id);
  return res.json({ message: 'E‘lon o‘chirildi' });
};

module.exports = {
  listCategories,
  addCategory,
  removeCategory,
  listComputers,
  addComputer,
  toggleLike,
  toggleCart,
  listFavorites,
  listCart,
  removeComputer,
};
