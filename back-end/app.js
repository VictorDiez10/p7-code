//Importation des différents packets
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

//Importation des différentes routes

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

//Connexion avec la base de données mongoose

mongoose.connect('mongodb+srv://john_dude:azerty12345@cluster0.xqk6saa.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//Utilisation de helmet pour la sécurité, crossOriginResourcePolicy mis en false pour la code erreur NotSameOrigin

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

//Gérer les problèmes de CORS (Cross-Origin Request Sharing)

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Utilisation de express-rate-limit pour limiter le débit pour Express

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
});

app.use(limiter);


app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;