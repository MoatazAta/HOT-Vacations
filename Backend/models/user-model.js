const Joi = require("joi");

class UserModel {

    constructor(user) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.isAdmin = user.isAdmin;
    }

    static #postValidationSchema = Joi.object({
        userId: Joi.forbidden(),
        firstName: Joi.string().required().min(2).max(50),
        lastName: Joi.string().required().min(2).max(50),
        username: Joi.string().required().min(3).max(50),
        password: Joi.string().required().min(4).max(150),
        isAdmin: Joi.boolean().optional()
    });
    
    validatePost() {
        const result = UserModel.#postValidationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null;
    }
}

module.exports = UserModel;