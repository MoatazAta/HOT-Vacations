const dal = require("../data-access-layer/dal");

async function getAllFollowersAsync() {
    const sql = "SELECT * FROM followers";
    const followers = await dal.executeAsync(sql);
    return followers;
}

// async function getNumberOfFollowersPerVacationAsync() {
//     const sql = `SELECT vacations.vacationId, vacations.destination, COUNT(userId) AS numberOfFollowers
//         FROM followers JOIN vacations on vacations.vacationId = followers.vacationId
//         GROUP BY vacations.vacationId`;
//     const numberOfFollowers = await dal.executeAsync(sql);
//     return numberOfFollowers;
// }

async function getOneFollowerAsync(userId) {
    const sql = "SELECT * FROM followers WHERE userId = " + userId;
    const follower = await dal.executeAsync(sql);
    return follower;
}

async function getFollowerDetailsAsync() {
    const sql = `SELECT followers.*, vacations.*, users.*
    FROM followers JOIN vacations ON vacations.vacationId = followers.vacationId
    JOIN users ON users.userId = followers.userId`;
    const followersDetails = await dal.executeAsync(sql);
    return followersDetails;
}

async function getVacationsPerFollowerAsync(userId) {
    const sql = `SELECT followers.*, vacations.*, users.* 
                FROM followers JOIN vacations
                ON vacations.vacationId = followers.vacationId
                JOIN users
                ON users.userId = followers.userId
                WHERE followers.userId = ?`;
    const following = await dal.executeAsync(sql, [userId]);
    if (following.length === 0) return null;
    return following;
}

async function getUsersPerVacationFollowingAsync(vacationId) {
    const sql = `SELECT vacations.*, users.* 
                FROM followers JOIN vacations
                ON vacations.vacationId = followers.vacationId
                JOIN users
                ON users.userId = followers.userId
                WHERE followers.vacationId = ?`;
    const following = await dal.executeAsync(sql, [vacationId]);
    if (following.length === 0) return null;
    return following;
}

async function getFollowerPerVacationAsync(userId, vacationId) {
    const sql = `SELECT * FROM followers WHERE userId= ? AND vacationId= ?`;
    const followers = await dal.executeAsync(sql, [userId, vacationId]);
    if (followers.length === 0) return null;
    return followers;
}

async function addFollowerToVacationAsync(userId, vacationId) {
    const sql = `INSERT INTO followers (userId,vacationId) VALUES(?, ?)`;
    await dal.executeAsync(sql, [userId, vacationId]);
}

async function deleteFollowerFromVacationAsync(userId, vacationId) {
    const sql = `DELETE FROM followers WHERE userId= ? AND vacationId= ?`;
    await dal.executeAsync(sql, [userId, vacationId]);
}

module.exports = {
    getAllFollowersAsync,
    getFollowerDetailsAsync,
    getOneFollowerAsync,
    getFollowerPerVacationAsync,
    getUsersPerVacationFollowingAsync,
    getVacationsPerFollowerAsync,
    addFollowerToVacationAsync,
    deleteFollowerFromVacationAsync
}
