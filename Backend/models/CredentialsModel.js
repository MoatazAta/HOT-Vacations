const Joi = require("joi");

class CredentialsModel {

    constructor(credentials) {
        this.userName = credentials.userName;
        this.password = credentials.password;
    }

    static #postValidationSchema = Joi.object({
        userName: Joi.string().required().min(4).max(50),
        password: Joi.string().required().min(4).max(128)
    });
    
    validatePost() {
        const result = CredentialsModel.#postValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null;
    }
}

module.exports = CredentialsModel;