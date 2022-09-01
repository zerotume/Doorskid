const express = require('express');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

const {setTokenCookie, restoreUser} = require('../../utils/auth.js');
const {User} = require('../../db/models');

const router = express.Router();



router.get('/', restoreUser, (req, res) => {
    // res.cookie('XSRF-Token', req.csrfToken());
    const {user} = req;
    if(user) {
        return res.json({user: user.toSafeObject()});
    }else{
        return res.json({});
    }
});

const validateLogin = [
    check('credential')
        .exists({checkFalsy: true})
        .notEmpty()
        .withMessage('Please provide a valid email or username'),
    check('password')
        .exists({checkFalsy: true})
        .withMessage('Please provide a password'),
    handleValidationErrors
];

router.post('/', validateLogin, async (req,res,next) => {
    //res.cookie('XSRF-Token', req.csrfToken());
    const {credential, password} = req.body;

    const user = await User.login({credential, password});

    if(!user){
        const err = new Error('Login Failed');
        err.status = 401;
        err.title = 'Login Failed';
        err.errors = ['The provided credentials were invalid.']
        return next(err);
    }

    await setTokenCookie(res, user);

    return res.json({user});
});

router.delete('/', (_req, res) => {
    //res.cookie('XSRF-Token', req.csrfToken());
    res.clearCookie('token');
    return res.json({message:'success'});
});

module.exports = router;
