const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const serversRouter = require('./servers.js');
const channelsRouter = require('./channels.js');
const channelMessagesRouter = require('./channelmessages.js');
const {restoreUser} = require('../../utils/auth.js');
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/servers', serversRouter);
router.use('/channels', channelsRouter);
router.use('/channelmessages', channelMessagesRouter);

// router.post('/test', (req,res) => {
//     res.json({requestBody:req.body});
// });

// router.post('/test', (req,res) => {
//     res.json({requestBody:req.body});
// });


// router.get('/restore-user', (req, res) => {
//     return res.json(req.user);
// });

const {requireAuth} = require('../../utils/auth.js');
// router.get('/require-auth', requireAuth, (req,res) => {
//     return res.json(req.user);
// });

const {setTokenCookie} = require('../../utils/auth.js');
const {User} = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//     const user = await User.findOne({
//         where:{
//             username: 'Demo-lition'
//         }
//     });
//     setTokenCookie(res, user);
//     return res.json({user});
// });


module.exports = router;
