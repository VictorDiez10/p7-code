const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage(); // Utilise le stockage en mémoire
const upload = multer({ storage: storage });

// Middleware pour l'upload d'image
module.exports.uploadMiddleware = upload.single('image'); // 'image' est le nom du champ dans le formulaire pour multer

// Middleware pour le traitement de l'image
module.exports.imageProcessingMiddleware = async (req, res, next) => {
    if (req.file) {
        console.log(req.file)
        console.log(req.file.originalname)
        const timestamp = req.file.originalname.replace(/\.jpeg|\.jpg|\.png/g,'_');
        // const timestamp = new Date().toISOString(); test avec timestamp
        const newName = `${timestamp}thumb.webp`;
        console.log(newName)

        try {
            // Utilise le buffer de l'image pour le traitement avec Sharp
            const processedBuffer = await sharp(req.file.buffer)
                .resize({height: 400})
                .webp({ quality: 80 })
                .toBuffer(); // Retourne le buffer de l'image traitée

            // Sauvegarder le buffer traité sur le système de fichiers
            const fs = require('fs');
            fs.writeFile(`./images/${newName}`, processedBuffer, (err) => {
                if (err) {
                    throw err;
                }
                console.log('The file has been saved!');
                next();
            });

        } catch (error) {
            console.error("Error processing the file", error);
            res.status(500).json({ error: "Error processing the image" });
        }
    } else {
        next();
    }
};
