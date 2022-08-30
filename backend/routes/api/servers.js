const express = require('express');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

const {setTokenCookie, restoreUser, requireAuth, serverReq, authorCheck} = require('../../utils/auth.js');
const {User} = require('../../db/models');
const {Server} = require('../../db/models');

const router = express.Router();




router.put('/:id', restoreUser, requireAuth, serverReq, authorCheck, async (req,res,next) => {
    let server = req.server;
    const {name} = req.body;
    server.set({name});
    await server.save();
    let updated = await Server.findByPk(req.params.id);
    return res.json(updated);
});


router.delete('/:id', restoreUser, requireAuth, serverReq, authorCheck, async(req,res,next) => {
    let server = req.server;
    await server.destroy();
    return res.json({
        "message":"Successfully deleted",
        "statusCode": 200
    });
})

router.get('/', restoreUser, requireAuth, async (req,res,next) => {
    const {user} = req;
    const joinedServers = await user.getServers({
        joinTableAttributes: []
    });

    return res.json(joinedServers);
});

const validateServer = [
    check('name')
        .exists({checkFalsy:true})
        .isLength({min:1,max:20})
        .isAlphanumeric()
        .withMessage('Please provide a valid server name with alphabates and numbers.'),
    handleValidationErrors
];

router.post('/', restoreUser, requireAuth, validateServer, async (req,res,next) => {
    let {user} = req;
    let ownerId = req.user.toJSON().id;
    const {name} = req.body;
    let newServer = await Server.create({
        ownerId,
        name
    });
    await newServer.addUser(user);
    return res.json(newServer);
});

module.exports = router;
