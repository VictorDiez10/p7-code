
const sharp = require('sharp');

const fs = require('fs')

module.exports = async (req, res, next) => {
    // fs.access("./images", (error) => {
    //     if (error) {
    //         fs.mkdirSync("./images");
    //     }
    // });
    try { 
        console.log(req.file)
        if (req.file) {
            const { buffer, originalname } = req.file;
            const timestamp = new Date().toISOString();
            const ref = `${timestamp}-${originalname}.webp`;
            sharp(req.file.path)
                .resize({height: 400})
                .webp({ quality: 80 })
                .toFile(req.file.path.replace(/\.jpeg|\.jpg|\.png/g,'_')+'thumb.webp');
        }
        next()
    } catch (error) {
        res.status(500).json({error})
    }
    
}

