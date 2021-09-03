import VacationModel from "../Models/VacationModel";

export class VacationState {
    public vacations: VacationModel[] = [];

}

export enum VacationActionType {
    VacationsDownloaded = "VacationsDownloaded",
    VacationAdded = "VacationAdded",
    VacationUpdated = "VacationUpdated",
    VacationDeleted = "VacationDeleted"
}

export interface VacationAction {
    type: VacationActionType;
    payload: any;
}


export function vacationReducer(currentState: VacationState = new VacationState(), action: VacationAction): VacationState {

    const newState = { ...currentState };

    switch (action.type) {
        case VacationActionType.VacationsDownloaded:
            newState.vacations = action.payload;
            break;
        case VacationActionType.VacationAdded:
            newState.vacations.push(action.payload);
            break;
        case VacationActionType.VacationUpdated:
            const indexToUpdate = newState.vacations.findIndex(v => v.vacationId === action.payload.vacationId);
            newState.vacations[indexToUpdate] = action.payload;
            break;
        case VacationActionType.VacationDeleted:
            const indexToDelete = newState.vacations.findIndex(v => v.vacationId === action.payload);
            newState.vacations.splice(indexToDelete, 1);
            break;
    }

    return newState;
}
