const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");

async function isUsernameTakenAsync(username) {
    const sql = `SELECT username FROM users WHERE username=${username}`;
    const userName = await dal.executeAsync(sql);
    if (userName.length > 0) return null;
}

async function registerAsync(user) {
    // user.password = cryptoHelper.hash(user.password);
    const sql = `INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)`;
    const info = await dal.executeAsync(sql, [user.firstName, user.lastName, user.username, user.password, false]);
    user.userId = info.userId;

    delete user.password;
    user.token = cryptoHelper.getNewToken(user);
    return user;
}

async function loginAsync(credentials) {
    // credentials.password = cryptoHelper.hash(credentials.password);
    const sql = `SELECT userId, firstName, lastName, username, isAdmin
                 FROM users WHERE username= ? AND password= ?`;
    const users = await dal.executeAsync(sql, [credentials.username, credentials.password]);
    if (users.length === 0) return null;
    user = users[0];
    user.token = cryptoHelper.getNewToken(user);
    console.log(user);

    return user;
}

module.exports = {
    isUsernameTakenAsync,
    registerAsync,
    loginAsync
};