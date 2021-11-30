const dal = require("../data-access-layer/dal");

async function getFollowersNumberAsync() {
    const sql = `SELECT F.vacationId, F.userId,
    COUNT( F.vacationId) AS followerNumber,V.destination 
    FROM followers AS F 
    JOIN vacations AS V 
    ON F.vacationId = V.vacationId 
    GROUP BY vacationId;`;
    const followers = await dal.executeAsync(sql);
    return followers;
} 


async function getFollowingDetailsAsync() {
    const sql = `SELECT followers.*, vacations.*, users.*
    FROM followers JOIN vacations ON vacations.vacationId = followers.vacationId
    JOIN users ON users.userId = followers.userId`;
    const followersDetails = await dal.executeAsync(sql);
    return followersDetails;
}



async function getFollowedVacationsByUserIdAsync(userId) {
    const sql = "SELECT * FROM followers where userId = ?";
    const followers = await dal.executeAsync(sql, [userId]);
    return followers;
}


async function getFollowedVacationsByVacationIdAsync(vacationId) {
    const sql = "SELECT * FROM followers where vacationId = ?";
    const followers = await dal.executeAsync(sql, [vacationId]);
    return followers;
}

async function getFollowingOnVacationAsync(userId, vacationId) {
    const sql = `SELECT * FROM followers WHERE userId= ? AND vacationId= ?`;
    const followers = await dal.executeAsync(sql, [userId, vacationId]);
    if (followers.length === 0) return null;
    return followers;
}

async function addFollowingToVacationAsync(follower) {

    const followedVacation = await getFollowingOnVacationAsync(follower.userId, follower.vacationId);
    if (followedVacation) return false;

    const sql = `INSERT INTO followers VALUES(?, ?)`;
    await dal.executeAsync(sql, [follower.userId, follower.vacationId]);
    return follower;
}

async function deleteFollowingFromVacationAsync(follower) {
    const sql = `DELETE FROM followers WHERE userId= ? AND vacationId= ?`;
    const info = await dal.executeAsync(sql, [follower.userId, follower.vacationId]);
    return info.affectedRows === 1;

} 

module.exports = {
    getFollowersNumberAsync,
    getFollowingDetailsAsync,
    getFollowingOnVacationAsync,
    addFollowingToVacationAsync,
    deleteFollowingFromVacationAsync,
    getFollowedVacationsByUserIdAsync,
    getFollowedVacationsByVacationIdAsync,
}
