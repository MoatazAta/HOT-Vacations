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



    validatePost() {
        const validationSchema = Joi.object({
            userId: Joi.string().optional().guid({ version: 'uuidv4' }).min(36).max(36),
            firstName: Joi.string().required().min(2).max(30).regex(/^[a-zA-Z]{2,30}$/),
            lastName: Joi.string().required().min(2).max(30).regex(/^[a-zA-Z]{2,30}$/),
            username: Joi.string().required().min(4).max(30).regex(/^[0-9a-zA-Z]{4,30}$/),
            password: Joi.string().required().min(6).max(30).regex(/(?=.*[a-z])(?=.*[0-9])(?=.{6,})/),
            isAdmin: Joi.number().optional().positive().allow(1, 0).only(),
        });
        // abortEarly: false --> return all errors and not only the first one
        const result = validationSchema.validate(this, { abortEarly: false });

        return result.error ? result.error.message : null;
    } 
} 

module.exports = UserModel;