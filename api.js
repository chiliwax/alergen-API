const express = require('express')
const db = require('./database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

//ACCOUNT

//DONT NEED TOKEN
router.post("/register", function(request, response) {
    try {
        const username = request.body.username;
        const password = request.body.password;

        const checkPassword = /([a-zA-Z]|[0-9]){8,15}$/ //Password  8 to 15 length letter and digit
        const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //email format

        if (!checkEmail.test(username)) { throw "username" }
        if (!checkPassword.test(password)) { throw "password" }

        let hash = bcrypt.hashSync(password, 10)
        if (!hash) { throw 'hash' }
        db.createAccount(username, hash, function(error) {
            if (error) {
                console.log(error);
                response.status(500).json({ status: 500, error: "DataBase error : " + error });
            } else {
                response.status(202).json({ status: 200, description: "Account created" })
            }
        })

    } catch (err) {
        switch (err) {
            case 'username':
                response.status(400).json({ status: 400, error: "Username should be nice formated email" })
                break;
            case 'password':
                response.status(400).json({ status: 400, error: "Password should be 8 to 15 alphanumeric character" })
                break;
            case 'hash':
                response.status(500).json({ status: 500, error: "Bcrypt Error" })
                break;
            default:
                response.status(500).json({ status: 500, error: "Unexpected error : " + err })
                break;
        }
    }

})

//NEED TOKEN
router.delete("/account", function(request, response) {
    try {
        const username = request.body.username;
        db.deleteAccount(username, function(error) {
            if (error) {
                console.log(error);
                response.status(500).json({ status: 500, error: "DataBase error : " + error });
            } else {
                response.status(202).json({ status: 200, description: "Account deleted" })
            }
        })
    } catch (err) {
        switch (err) {
            default: response.status(500).json({ status: 500, error: "Unexpected error : " + err })
            break;
        }
    }
})

//NEED TOKEN
router.put("/account", function(request, response) {
    try {
        const old_username = request.body.old_username;
        const new_username = request.body.new_username;
        const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ //email format
        if (!checkEmail.test(new_username)) { throw "username" }

        db.updateAccount(old_username, new_username, function(error) {
            if (error) {
                console.log(error);
                response.status(500).json({ status: 500, error: "DataBase error : " + error });
            } else {
                response.status(202).json({ status: 200, description: "Account update" })
            }
        })
    } catch (err) {
        switch (err) {
            case 'username':
                response.status(400).json({ status: 400, error: "Bad Email format" })
                break;
            default:
                response.status(500).json({ status: 500, error: "Unexpected error : " + err })
                break;
        }

    }
})

//NEED TOKEN
router.put("/password", function(request, response) {
    try {
        const username = request.body.username;
        const password = request.body.password;
        const checkPassword = /([a-zA-Z]|[0-9]){8,15}$/ //Password  8 to 15 length letter and digit
        if (!checkPassword.test(password)) { throw "password" }
        let hash = bcrypt.hashSync(password, 10)
        if (!hash) { throw 'hash' }
        db.updatePassword(username, hash, function(error) {
            if (error) {
                console.log(error);
                response.status(500).json({ status: 500, error: "DataBase error : " + error });
            } else {
                response.status(202).json({ status: 200, description: "Password update" })
            }
        })
    } catch (err) {
        switch (err) {
            case 'password':
                response.status(400).json({ status: 400, error: "Bad password format" })
                break;
            case 'hash':
                response.status(500).json({ status: 500, error: "Bcrypt Error" })
                break;
            default:
                response.status(500).json({ status: 500, error: "Unexpected error : " + err })
                break;
        }
    }
})


//DON'T NEED TOKEN (GENERATE IT)
router.post("/login", function(request, response) {
    console.log("do something here")
    try {

    } catch (e) {

    }
})


module.exports = router