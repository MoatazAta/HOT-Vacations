const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");
const uuid = require("uuid");


async function isUsernameTakenAsync(username) {
    const sql = "SELECT * FROM users WHERE username = ?";
    const users = await dal.executeAsync(sql, [username]);
    return users.length === 0 ? true : false; 
}

async function registerAsync(user) {
    user.password = cryptoHelper.hash(user.password); 

    user.userId = uuid.v4();

    const sql = `INSERT INTO users VALUES(?, ?, ?, ?, ?, ?)`;
    if (!user.isAdmin) {
        user.isAdmin = 0; 
    }  
    await dal.executeAsync(sql, [user.userId, user.firstName, user.lastName, user.username, user.password, user.isAdmin]);
    delete user.password;
    user.token = cryptoHelper.getNewToken(user);
    return user;
} 

async function loginAsync(credentials) {
    credentials.password = cryptoHelper.hash(credentials.password);
    const sql = `SELECT userId, firstName, lastName, username, isAdmin
                 FROM users WHERE username= ? AND password= ?`;
    const users = await dal.executeAsync(sql, [credentials.username, credentials.password]);
    if (users.length === 0) return null;
    user = users[0];
    user.token = cryptoHelper.getNewToken(user);
    return user;
}

async function getUserByIdAsync(userId) {
    const sql = "SELECT userId, firstName, lastName, username, isAdmin FROM users WHERE userId = ?";
    const users = await dal.executeAsync(sql, [userId]);
    if (users.length === 0) return null;
    const user = users[0]; 
    return user;
}

module.exports = {
    isUsernameTakenAsync,
    registerAsync,
    loginAsync,
    getUserByIdAsync
};