const sqlite = require('sqlite3')
const bcrypt = require('bcryptjs')
const db = new sqlite.Database("database.db")

//DB INITIALISATION
db.run(`
CREATE TABLE IF NOT EXISTS account(
    id INTEGER PRIMARY KEY NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS allergen(
    id INTEGER PRIMARY KEY NOT NULL UNIQUE,
    englishname TEXT NOT NULL UNIQUE,
    description TEXT UNIQUE,
    link TEXT,
    swedishname TEXT,
    frenchname TEXT
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS userallergen(
    id INTEGER PRIMARY KEY NOT NULL UNIQUE,
    username TEXT NOT NULL,
    alergen TEXT NOT NULL
)
`)

//Account
exports.createAccount = function(username, password, callback) {
    const query = "INSERT INTO account (username, password) VALUES(?,?)"
    const values = [username, password]
    db.run(query, values, function(error) {
        if (error) { callback(error) } else { callback(null) }
    })
}

exports.deleteAccount = function(username, callback) {
    const query = "DELETE FROM account WHERE username = ?"
    const value = [username]
    db.get("SELECT username FROM account WHERE username = ?", value, function(error, answer) {
        if (error) { callback(error) } else if (!answer) { callback("Account doesn't exist !") } else {
            db.run(query, value, function(error) {
                if (error) { callback(error) } else { callback(null) }
            })
        }
    })

}

exports.updateAccount = function(oldusername, newusername, callback) {
    const query = "UPDATE account SET username = ? WHERE username = ?"
    const values = [newusername, oldusername]
    db.get("SELECT username FROM account WHERE username = ?", oldusername, function(error, answer) {
        if (error) { callback(error) } else if (!answer) { callback("Account doesn't exist !") } else {
            db.run(query, values, function(error) {
                if (error) { callback(error) } else { callback(null) }
            })
        }
    })
}

exports.updatePassword = function(username, password, callback) {
    const query = "UPDATE account SET password = ? WHERE username = ?"
    const values = [password, username]
    db.get("SELECT username FROM account WHERE username = ?", username, function(error, answer) {
        if (error) { callback(error) } else if (!answer) { callback("Account doesn't exist !") } else {
            db.run(query, values, function(error) {
                if (error) { callback(error) } else { callback(null) }
            })
        }
    })
}

//GET stuffs

exports.getallergens = function(callback) {
    query = "SELECT * FROM allergen"
    db.all(query, function(error, answer) {
        if (error) { callback(error) } else { callback(null, answer) }
    })
}