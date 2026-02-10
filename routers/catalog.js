const express = require('express');
const {
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
} = require('../controller/catalogController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Catalog
 *     description: Komputerlar va categorylar
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Categorylar ro'yxati
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Categorylar ro'yxati
 */
router.get('/categories', listCategories);

/**
 * @swagger
 * /api/computers:
 *   get:
 *     summary: Komputer e'lonlari ro'yxati (auth kerak emas)
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Komputerlar ro'yxati
 */
router.get('/computers', listComputers);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Sevimlilar ro'yxati (isLiked=true)
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Sevimli e'lonlar
 */
router.get('/favorites', listFavorites);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Savat ro'yxati (inCart=true)
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Savatdagi e'lonlar
 */
router.get('/cart', listCart);

/**
 * @swagger
 * /api/computers/{id}/like:
 *   patch:
 *     summary: E'lonni sevimlilarga qo'shish/olib tashlash
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isLiked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Like holati yangilandi
 *       404:
 *         description: Komputer topilmadi
 */
router.patch('/computers/:id/like', toggleLike);

/**
 * @swagger
 * /api/computers/{id}/cart:
 *   patch:
 *     summary: E'lonni savatga qo'shish/olib tashlash
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inCart:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Savat holati yangilandi
 *       404:
 *         description: Komputer topilmadi
 */
router.patch('/computers/:id/cart', toggleCart);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Yangi category yaratish (admin)
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Noutbuk
 *     responses:
 *       201:
 *         description: Category yaratildi
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Token yo'q/yaroqsiz
 *       403:
 *         description: Ruxsat yo'q
 */
router.post('/categories', authenticate, authorizeRole(['admin']), addCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Category o'chirish (admin)
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category o'chirildi
 *       401:
 *         description: Token yo'q/yaroqsiz
 *       403:
 *         description: Ruxsat yo'q
 *       404:
 *         description: Category topilmadi
 */
router.delete('/categories/:id', authenticate, authorizeRole(['admin']), removeCategory);

/**
 * @swagger
 * /api/computers:
 *   post:
 *     summary: Yangi komputer e'loni qo'shish (admin)
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - img
 *             properties:
 *               name:
 *                 type: string
 *                 example: AZ1K Gaming Extreme
 *               price:
 *                 type: string
 *                 example: "18 500 000"
 *               img:
 *                 type: string
 *                 example: https://example.com/image.webp
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: E'lon qo'shildi
 *       400:
 *         description: Noto'g'ri so'rov
 *       401:
 *         description: Token yo'q/yaroqsiz
 *       403:
 *         description: Ruxsat yo'q
 */
router.post('/computers', authenticate, authorizeRole(['admin']), addComputer);

/**
 * @swagger
 * /api/computers/{id}:
 *   delete:
 *     summary: Komputer e'lonini o'chirish (admin)
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: E'lon o'chirildi
 *       401:
 *         description: Token yo'q/yaroqsiz
 *       403:
 *         description: Ruxsat yo'q
 *       404:
 *         description: E'lon topilmadi
 */
router.delete('/computers/:id', authenticate, authorizeRole(['admin']), removeComputer);

module.exports = router;
