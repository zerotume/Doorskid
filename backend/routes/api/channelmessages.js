const express = require('express');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

const {setTokenCookie, restoreUser, requireAuth, channelReq, authorCheck} = require('../../utils/auth.js');
const {User, Server, Channel, Channelmessage, Directmessage} = require('../../db/models');

const router = express.Router();




module.exports = router;
