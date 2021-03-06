//Imports
const user = require('../models/user-model');
const authJWT = require('../helpers/jwt')

/**
 * POST     /api/login              -> login
 * POST     /api/signup             -> signup
 * POST     /api/refresh-token      -> refreshToken

 */

module.exports = {
    login,
    signup,
    refreshToken,
    googleLogin
}

const _UPDATE_DEFAULT_CONFIG = {
    new: true,
    runValidators: true
}

/**
 * Authenticates a user and returns JWT
 * @param {request} req Request
 * @param {*} res Response
 */
function login(req, res) {
    console.log(req.headers);
    if (req.body.password && req.body.email) {
        user.findOne({
            email: req.body.email
        })
            .select("_id password")
            .exec((err, userResult) => {
                if (err || !userResult) {
                    return res.status(401).send({ error: "LoginError" });
                }

                userResult.comparePassword(req.body.password, userResult.password, function (err, isMatch) {
                    if (isMatch & !err) {

                        let dataToken = authJWT.createToken(userResult);
                        return res.status(200).send({
                            access_token: dataToken[0],
                            refresh_token: authJWT.createRefreshToken(userResult),
                            expires_in: dataToken[1],
                            role: userResult.role
                        });

                    } else {
                        return res.status(401).send({ error: "LoginError" });
                    }
                });

            });
    } else {
        return res.status(401).send({ error: "BadRequest" });
    }
}

function googleLogin(req, res) {
    res.send(req.user);
}

/**
 * Creates a user and returns a JWT
 * @param {request} req Request
 * @param {*} res Response
 */
function signup(req, res) {
    // Save new user
    user.create(req.body)
        .then(user => {

            let dataToken = authJWT.createToken(user);
            let userResponse = {
                access_token: dataToken[0],
                refresh_token: authJWT.createRefreshToken(user),
                expires_in: dataToken[1],
                role: user.role
            };
            console.log(userResponse);
            return res.status(200).send(userResponse);

        })
        .catch(err => {
            console.log(err)
            return res.status(400).send(err);
        });

}

/**
 * Refreshes access_token
 * @param {request} req Request
 * @param {*} res Response
 */
function refreshToken(req, res) {
    authJWT.refreshToken(req, res)
}

function handdleError(err, res) {
    return res.status(400).json(err);
}