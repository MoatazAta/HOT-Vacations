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

    static #postValidationSchema = Joi.object({
        vacationId: Joi.forbidden(),
        description: Joi.string().required().min(2).max(500),
        destination: Joi.string().required().min(2).max(50),
        price: Joi.number().required().min(0),
        start: Joi.string().required().min(2).max(50),
        end: Joi.string().required().min(2).max(50),
        picture: Joi.string().optional().max(50)
    });

    static #putValidationSchema = Joi.object({
        vacationId: Joi.number().optional().integer(),
        description: Joi.string().required().min(2).max(500),
        destination: Joi.string().required().min(2).max(50),
        price: Joi.number().required().min(0),
        start: Joi.string().required().min(2).max(50),
        end: Joi.string().required().min(2).max(50),
        picture: Joi.string().optional().max(50)
    });
    
    validatePut() {
        const result = VacationModel.#putValidationSchema.validate(this, { abortEarly: false }); // abortEarly: false --> return all validation errors and not just one.
        return result.error ? result.error.message : null; // null = no errors.
    }

    validatePost() {
        const result = VacationModel.#postValidationSchema.validate(this, { abortEarly: false }); // abortEarly: false --> return all validation errors and not just one.
        return result.error ? result.error.message : null; // null = no errors.
    }


}

module.exports = VacationModel;