const joi = require('joi');

function signupValidation(req, res, next) {
    const schema = joi.object({
        username : joi.string().min(3).max(15).required(),
        email : joi.string().email().required(),
        password : joi.string().min(5).max(8).required(),
    })

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({
            message : "please fill the credentials according to the requirement"
        })
    }
    next();
}

function loginValidation(req, res, next) {
    const schema = joi.object({
        email : joi.string().email().required(),
        password : joi.string().min(5).max(8).required(),
    })

    const { error } = schema.validate(req.body);
    if(error) {
        return res.status(400).json({
            message : "bad request"
        })
    }
    next();
}

module.exports = { signupValidation, loginValidation };