const express = require('express');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

const {setTokenCookie, requireAuth, restoreUser} = require('../../utils/auth.js');
const {User} = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({checkFalsy:true})
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({checkFalsy: true})
        .isLength({min:4})
        .withMessage('Please provide a username with at least 4 characters'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({checkFalsy:true})
        .isLength({min:6})
        .withMessage('Password must be 6 characters or more'),
    handleValidationErrors
];

router.post('/', validateSignup, async (req,res) => {
    // res.cookie('XSRF-Token', req.csrfToken());
    const {email, password, username,firstName,lastName} = req.body;
    const user = await User.signup({email, username, password,firstName,lastName});

    await setTokenCookie(res, user);

    return res.json({user});
});

router.get('/:id/servers', restoreUser, requireAuth, async (req, res) => {
    let currentUser = await User.findByPk(req.params.id);
    let userServers = await currentUser.getServers();
    // let serverList = userServers.map(e => {
    //     return e.toJson.UserServerBind.serverId;
    // })
    return res.json(userServers);
})

module.exports = router;
