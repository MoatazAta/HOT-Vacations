const Joi = require("joi");

class VacationModel {

    constructor(vacation) {
        this.vacationId = vacation.vacationId;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.price = vacation.price;
        this.start = vacation.start;
        this.end = vacation.end;
        this.picture = vacation.picture;
    }

    validatePut() {
        const currentDate = new Date().toLocaleDateString();
        const validationSchema = Joi.object({
            vacationId: Joi.string().required().guid({ version: 'uuidv4' }).min(36).max(36),
            description: Joi.string().required().min(10).max(1000),
            destination: Joi.string().required().min(3).max(50),
            price: Joi.number().required().precision(2).positive().max(10000),
            start: Joi.date().iso().required().greater(currentDate),
            end: Joi.date().iso().required().greater(Joi.ref('start')),
            picture: Joi.string().optional().regex(/(.jpeg|.jpg|.png)$/),
        });
        // abortEarly: false --> return all errors and not only the first one
        const result = validationSchema.validate(this, { abortEarly: false });
        // If there is an error - return it as an array, otherwise return null
        return result.error ? result.error.message : null;
    }

    validatePost() {
        const currentDate = new Date().toLocaleDateString();
        const validationSchema = Joi.object({
            vacationId: Joi.forbidden(),
            description: Joi.string().required().min(10).max(500),
            destination: Joi.string().required().min(3).max(1000),
            price: Joi.number().required().precision(2).positive().max(10000),
            start: Joi.date().iso().required().greater(currentDate),
            end: Joi.date().iso().required().greater(Joi.ref('start')),
            picture: Joi.string().optional().regex(/(.jpeg|.jpg|.png)$/),
        });
        // abortEarly: false --> return all errors and not only the first one
        const result = validationSchema.validate(this, { abortEarly: false });
        // If there is an error - return it as an array, otherwise return null
        return result.error ? result.error.message : null;
    }


}

module.exports = VacationModel; 