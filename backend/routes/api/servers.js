const express = require('express');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

const {setTokenCookie, restoreUser, requireAuth, serverReq, authorCheck, serverUsersReq, authorListCheck} = require('../../utils/auth.js');
const {User, Server, Channel} = require('../../db/models');


const router = express.Router();

router.get('/:id/users', restoreUser, requireAuth,
    //serverUsersReq, authorListCheck,
    async (req,res,next) => {
        let serverMembers = req.members;
        return res.json(serverMembers)
    });

router.get('/:id/channels', restoreUser, requireAuth,
    // serverUsersReq, authorListCheck,
    async (req, res, next) => {
        let server = req.server;
        let serverChannels = await server.getChannels();
        return res.json(serverChannels);
    });

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

router.post('/:id/channels', restoreUser, requireAuth, serverReq, authorCheck, validateChannel, async (req,res,next) => {
    const {name} = req.body;
    const server = req.server;
    const newChannel = await server.createChannel({name});
    return res.json(newChannel);
});

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
    const joinedServers = await Server.findAll({
        joinTableAttributes: [],
        include:[
            {
                model:Channel,
                required:false,
                order:[['id']]
            }
        ]
    });

    return res.json(joinedServers);
});

const validateServer = [
    check('name')
        .exists({checkFalsy:true})
        .withMessage('Please provide a valid server name with alphabates and numbers under 20 characters.')
        .isLength({min:1,max:20})
        .withMessage('Please provide a valid server name with alphabates and numbers under 20 characters.')
        .isAlphanumeric()
        .withMessage('Please provide a valid server name with alphabates and numbers under 20 characters.'),
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
