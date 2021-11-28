import FollowerModel from "../Models/FollowersModel";
import VacationModel from "../Models/VacationModel";
import store from "../Redux/Store";
import config from "../Services/Config";
import jwtAxios from "../Services/jwtAxios";

async function sortVacations(vacations: VacationModel[]) {
  try {
    const followedVacations: VacationModel[] = [];
    const notFollowedVacations: VacationModel[] = [];
    const response = await jwtAxios.get<FollowerModel[]>(
      config.getAllFollowedVacationsByUserId + store.getState().authState.user.userId
    );
    if (!response.data.length) {
      return vacations;
    }
    const followedByUser = response.data.map((f) => f.vacationId);
    for (const vacation of vacations) {
      if (followedByUser.includes(vacation.vacationId)) {
        followedVacations.push(vacation);
      } else {
        notFollowedVacations.push(vacation);
      }
    }

    return [...followedVacations.concat(notFollowedVacations)];
  } catch (error: any) {
    alert(error.message);
  }
}
export default sortVacations;
