const jwt = require('jsonwebtoken');
const {jwtConfig} = require('../config');
const {User, Server, Channel, Channelmessage, Directmessage} = require('../db/models');

const {secret, expiresIn} = jwtConfig;

const setTokenCookie = (res, user) => {
    const token = jwt.sign(
        {data:user.toSafeObject()},
        secret,
        {expiresIn: parseInt(expiresIn)}
    );
    const isProduction = process.env.NODE_ENV === "production"

    res.cookie('token', token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};



const restoreUser = (req,res,next) => {
    const {token} = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if(err){
            return next();
        }

        try {
            const {id} = jwtPayload.data;
            req.user = await User.scope('currentUser').findByPk(id);
        }catch(e){
            res.clearCookie('token');
            return next();
        }

        if(!req.user) res.clearCookie('token');

        return next();
    });
};

const requireAuth = (req, _res, next) => {
    if(req.user) return next();

    const err = new Error('Unauthorized');
    err.title = 'Unauthorized';
    err.errors = {authen:'Unauthorized'};
    err.status = 401;
    return next(err);
}

const authorCheck = (req, res, next) => {
    let uid = req.user.toJSON().id;
    if(uid !== req.permit){
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.message = "Forbidden";
        err.status = 403;
        err.errors = {author:["Forbidden"]}
        return next(err);
    }
    return next();
}

const authorListCheck = (req,res,next) => {
    let uid = req.user.toJSON().id;
    if(!req.permit.includes(uid)){
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.message = "Forbidden";
        err.errors = {author:["Forbidden"]}
        err.status = 403;
        return next(err);
    }
    return next();
}

const serverReq = async (req, res, next) => {
    let server = await Server.findByPk(req.params.id)
    if(!server){
        const err = new Error("Server couldn't be found");
        err.title = "Server couldn't be found";
        err.message = "Server couldn't be found";
        err.errors = {server:"Server couldn't be found"}
        err.status = 404;
        return next(err);
    }
    req.server = server;
    req.permit = server.ownerId;
    return next();
}

const channelReq = async (req,res,next) => {
    let channel = await Channel.findByPk(req.params.id,{
        include:[
            {
                model:Server
            }
        ]
    });
    if(!channel){
        const err = new Error("Channel couldn't be found");
        err.title = "Channel couldn't be found";
        err.message = "Channel couldn't be found";
        err.errors = {channel:"Channel couldn't be found"}
        err.status = 404;
        return next(err);
    }
    req.channel = channel;
    req.permit = channel.Server.ownerId;
    return next();
}

const serverUsersReq = async (req,res,next) => {
    let server = await Server.findByPk(req.params.id);
    if(!server){
        const err = new Error("Server couldn't be found");
        err.title = "Server couldn't be found";
        err.message = "Server couldn't be found";
        err.errors = {server:"Server couldn't be found"}
        err.status = 404;
        return next(err);
    }
    let members = await server.getUsers();
    // console.log(members[0].toJSON());
    let memberList = members.map(e => {
        return e.toJSON().UserServerBind.userId;
    });
    req.server = server;
    req.members = members.map(e => {
        memberObj = e.toJSON();
        delete memberObj.UserServerBind;
        return memberObj;
    })
    req.permit = memberList;
    return next();
}

const channelUsersReq = async (req, res, next) => {
    let channel = await Channel.findByPk(req.params.id);
    if(!channel){
        const err = new Error("Channel couldn't be found");
        err.title = "Channel couldn't be found";
        err.message = "Channel couldn't be found";
        err.errors = {channel:"Channel couldn't be found"}
        err.status = 404;
        return next(err);
    }
    let server = await channel.getServer();
    let members = await server.getUsers();
    let memberList = members.map(e => {
        return e.toJSON().UserServerBind.userId;
    });
    req.channel = channel;
    req.server = server;
    req.members = members.map(e => {
        memberObj = e.toJSON();
        delete memberObj.UserServerBind;
        return memberObj;
    })
    req.permit = memberList;
    return next();
}


module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth,
    serverReq,
    authorCheck,
    serverUsersReq,
    authorListCheck,
    channelReq,
    channelUsersReq
};
