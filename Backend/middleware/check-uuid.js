const uuid = require("uuid");

function uuidValidateV4(request, response, next) {
    const id = request.params.uuid;
    const valid = (uuid.validate(id) && uuid.version(id) === 4);
    if (!valid) {
        return response.status(400).send("The id that was sent was not a valid uuid");
    }
    next();
}

module.exports = uuidValidateV4;