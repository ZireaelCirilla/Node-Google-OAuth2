const router = require('express').Router()
const userController = require('./controllers/user-controller')
const pass = require('./middlewares/auth')

router.post('/login', userController.login)
router.post('/signup', userController.signup)
router.post('/refresh-token', userController.refreshToken)
router.get('/test', pass.authUser, (req, res) => {
    res.send("hi")
})

router.post('/google/login', pass.authGoogle, userController.googleLogin)


module.exports = router