const passwordValidator = require('password-validator');

const passWordSchema = new passwordValidator();

passWordSchema
.is().min(8)                                    // Minimum length 8
.is().max(25)                                  // Maximum length 25
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res, next) => {
    if(passWordSchema.validate(req.body.password)) {
        console.log('Mot de passe fort')
        next();
    } else {
        console.log(`Le Mot de passe n'est pas assez fort  ${passWordSchema.validate('req.body.password', { list : true })}`)
        return res.status(400).json({error : "le mot de passe n'est pas assez fort"});
    }
}