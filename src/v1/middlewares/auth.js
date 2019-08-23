const dotenv = require('dotenv')
dotenv.config()
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const GoogleTokenStrategy = require('passport-google-token').Strategy
const {
    ExtractJwt
} = require('passport-jwt')
const User = require('../models/user-model')
var generator = require('generate-password');


/**
 * USER
 * Access for role: ROLE_USER
 */
passport.use('user', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_TOKEN,
}, async (payload, done) => {
    try {
        const user = await User.findOne({
            _id: payload.id,
            role: "ROLE_USER"
        })

        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

const authUser = passport.authenticate('user', {
    session: false,
})

/**
 * COMPANY
 * Access for role: ROLE_COMPANY
 */
passport.use('company', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_TOKEN,
}, async (payload, done) => {
    try {
        const user = await User.findOne({
            _id: payload.id,
            role: "ROLE_COMPANY"
        })

        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

const authCompany = passport.authenticate('company', {
    session: false,
})

passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET
},
    function (accessToken, refreshToken, profile, done) {
        console.log("hi");
        User.findOne({ googleId: profile.id }, function (err, user) {
            console.log(profile);
            return user ? done(err, user) : User.create(
                {
                    googleId: profile.id,
                    email: profile.email,
                    name: profile.name,
                    password: generator.generate(),
                    role: "ROLE_USER"
                }, (err, user) => { return done(err, user) })
        });
    }
));

const authGoogle = passport.authenticate('google-token', {
    session: false,
})

module.exports = {
    authUser,
    authCompany,
    authGoogle
}