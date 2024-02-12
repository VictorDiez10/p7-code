const sharp = require('sharp');

module.exports = async (req, res, next) => {
    // fs.access("./images", (error) => {
    //     if (error) {
    //         fs.mkdirSync("./images");
    //     }
    // });
    try { 
        if (req.file) {
            const path = req.file.path;
            sharp(path)
                .resize({height: 400})
                .webp({ quality: 80 })
                .toFile(req.file.path.replace(/\.jpeg|\.jpg|\.png/g,'_')+'thumb.webp');
        }
        next()
    } catch (error) {
        res.status(500).json({error})
    }
    
}

