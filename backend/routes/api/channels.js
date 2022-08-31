const express = require('express');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

const {setTokenCookie, restoreUser} = require('../../utils/auth.js');
const {User, Server, Channel, Channelmessage, Directmessage} = require('../../db/models');

const router = express.Router();

const validateChannel = [
    check('name')
        .exists({checkFalsy:true})
        .withMessage('Please provide a valid channel name with alphabates and numbers under 20 characters.')
        .isLength({min:1,max:20})
        .withMessage('Please provide a valid channel name with alphabates and numbers under 20 characters.')
        .isAlphanumeric()
        .withMessage('Please provide a valid channel name with alphabates and numbers under 20 characters.'),
    handleValidationErrors
];


module.exports = router;
