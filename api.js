const express = require('express')
const db = require('./database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('./config.json');

const router = express.Router()

//TOOLS

function TokenVerification(request, username) {
    const authorizationHeader = request.header("authorization")
    const accessToken = authorizationHeader.substring("Bearer ".length)
    const payload = jwt.verify(accessToken, config.secret)
    if (payload.usernameAccount != username) { return false }
    return true
}

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
        if (!username || username === "") { throw "emptyUsername" }
        //AUTHORIZATION HEADER CHECK
        if (!TokenVerification(request, username)) { throw "invalid user" }
        //HEADER CHECK
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
            case "emptyUsername":
                response.status(401).json({ status: 401, error: "Empty username " + err })
                break;
            case "invalid user":
                response.status(401).json({ status: 401, error: "invalid user " + err })
                break;
            default:
                response.status(500).json({ status: 500, error: "Unexpected error : " + err })
                break;
        }
    }
})

//NEED TOKEN
router.put("/account", function(request, response) {
    try {
        const old_username = request.body.old_username;
        const new_username = request.body.new_username;
        //AUTHORIZATION HEADER CHECK
        if (!TokenVerification(request, old_username)) { throw "invalid user" }
        //HEADER CHECK
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
            case "invalid user":
                response.status(401).json({ status: 401, error: "invalid user " + err })
                break;
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
        //AUTHORIZATION HEADER CHECK
        if (!TokenVerification(request, username)) { throw "invalid user" }
        //HEADER CHECK
        const checkPassword = /([a-zA-Z]|[0-9]){8,15}$/ //Password  8 to 15 length letter and digit
        if (!checkPassword.test(password)) { throw "password" }
        let hash = bcrypt.hashSync(password, 10)
        if (!hash) { throw 'hash' }
        db.updatePassword(username, hash, function(error) {
            if (error) {
                console.log(error);
                response.status(500).json({ status: 500, error: "DataBase error : " + error });
            } else {
                response.status(200).json({ status: 200, description: "Password update" })
            }
        })
    } catch (err) {
        switch (err) {
            case "invalid user":
                response.status(401).json({ status: 401, error: "invalid user " + err })
                break;
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
    try {
        const username = request.body.username;
        const password = request.body.password;
        db.login(username, password, function(error) {
            if (error) {
                console.log(error);
                response.status(500).json({ status: 500, error: "DataBase error : " + error });
            } else {

                const accessToken = jwt.sign({
                    usernameAccount: username
                }, config.secret)

                response.status(200).json({
                    access_token: accessToken,
                    token_type: "Bearer"
                })
            }
        })
    } catch (err) {
        switch (err) {
            default: response.status(500).json({ status: 500, error: "Unexpected error : " + err })
            break;
        }
    }
})

//DON'T NEED TOKEN
router.get("/getAlergen", function(request, response) {
    try {
        db.getallergens(function(error, answer) {
            if (error) {
                console.log(error);
                response.status(500).json({ status: 500, error: "DataBase error : " + error });
            } else {
                response.status(200).json(answer)
            }
        })
    } catch (err) {
        switch (err) {
            default: response.status(500).json({ status: 500, error: "Unexpected error : " + err })
            break;
        }
    }
})


module.exports = router