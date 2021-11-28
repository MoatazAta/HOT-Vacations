const Joi = require("joi");

class CredentialsModel {

    constructor(credentials) {
        this.username = credentials.username;
        this.password = credentials.password;
    }

    static #postValidationSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });
    
    validateLogin() {
        const result = CredentialsModel.#postValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null;
    }

}

module.exports = CredentialsModel;