const Joi = require('joi');

class Follower {
    constructor(follower) {
        this.userId = follower.userId;
        this.vacationId = follower.vacationId;
    }
    validate() {
        const validationSchema = Joi.object({
            userId: Joi.string().required().guid({ version: 'uuidv4' }).min(36).max(36),
            vacationId: Joi.string().required().guid({ version: 'uuidv4' }).min(36).max(36),
        });
        const result = validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.message : null;
    }
}

module.exports = Follower;