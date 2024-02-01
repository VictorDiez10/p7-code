const Book = require('../models/book')

const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    console.log(req.file.filename.replace(/\.jpeg|\.jpg|\.png/g,'_')+'thumb.webp')
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        ratings: { 
            userId: req.auth.userId,
            grade: bookObject.ratings[0].grade
        },
        averageRating: bookObject.ratings[0].grade
    });
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
    .then((book) => {
        if(book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé'})
        } else {
            Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() =>  res.status(200).json({message: 'Objet modifié !'}))
            .catch(error => res.status(401).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then((book) => {
        if(book.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non-autorisé'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                .then(() =>  res.status(200).json({message: 'Objet supprimé !'}))
                .catch(error => res.status(401).json({ error }));
            })
        }
    })
    .catch(error => res.status(500).json({ error }));
}

exports.getOneBook = (req, res, next)=> {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

exports.getBestRating = (req, res, next) => {
    Book.find()
    .then((books) => { 
        books.sort((a, b) => b.averageRating - a.averageRating )
        const bestRatingBooks = books.slice(0,3)
        res.status(200).json(bestRatingBooks)
    })
    .catch(error => res.status(400).json({ error }));
}

exports.createRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
        let totalRatings = 0
        let finalRating = 0
        for (let rating of book.ratings) {
            if (rating.userId === req.body.userId) {
                res.status(401).json({ message: 'Utilisateur a déjà noté' })
            } else {
                totalRatings += rating.grade
            }
        }
        totalRatings += req.body.rating
        finalRating = totalRatings / (book.ratings.length + 1)
        finalRating = finalRating.toPrecision(2)

        Book.updateOne({ _id: req.params.id }, { averageRating: finalRating, $push: { ratings: { userId: req.body.userId, grade: req.body.rating } } })
            .then((book) => res.status(200).json(book))
            .catch(error => res.status(400).json({ error }))
    })
    
}