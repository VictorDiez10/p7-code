const express = require('express');
const router = express.Router();


const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config')

router.post('/', auth ,  multer, sharp,  bookCtrl.createBook );
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook );
router.delete('/:id', auth, bookCtrl.deleteBook );
router.get('/', bookCtrl.getAllBook );
router.get('/bestrating', bookCtrl.getBestRating );
router.get('/:id', bookCtrl.getOneBook );
router.post('/:id/rating', auth, bookCtrl.createRating );

module.exports = router;