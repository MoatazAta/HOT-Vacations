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
}

module.exports = VacationModel;