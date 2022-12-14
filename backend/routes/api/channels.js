const express = require('express');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation.js');

const {setTokenCookie, restoreUser, requireAuth, channelReq, authorCheck, channelUsersReq, authorListCheck} = require('../../utils/auth.js');
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

router.put('/:id', restoreUser, requireAuth, validateChannel, channelReq, authorCheck, async (req,res) => {
    const channel = req.channel;
    const {name} = req.body;
    channel.set({name});
    await channel.save();
    let updated = await Channel.findByPk(req.params.id);
    return res.json(updated);
});

router.delete('/:id', restoreUser, requireAuth, channelReq, authorCheck, async (req, res, next) => {
    const channel = req.channel;
    await channel.destroy();
    return res.json({
        "message":"Successfully deleted",
        "statusCode": 200
    });
})

router.get('/:id/messages', restoreUser, requireAuth,
// channelUsersReq, authorListCheck,
async (req, res, next) => {
    // const channel = req.channel;

    const channelmessages = await Channelmessage.findAll({
        where:{
            channelId:req.params.id
        },
        include:[
            {
                model:User,
                required:false
            }
        ]
    })
    return res.json(channelmessages);
})

module.exports = router;
