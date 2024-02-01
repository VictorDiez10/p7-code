const express = require('express');
const router = express.Router();


const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp-config')

router.post('/', auth ,  multer,  stuffCtrl.createBook );
router.put('/:id', auth, multer, stuffCtrl.modifyBook );
router.delete('/:id', auth, stuffCtrl.deleteBook );
router.get('/', stuffCtrl.getAllBook );
router.get('/bestrating', stuffCtrl.getBestRating );
router.get('/:id', stuffCtrl.getOneBook );
router.post('/:id/rating', auth, stuffCtrl.createRating );

module.exports = router;