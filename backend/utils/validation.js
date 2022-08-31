const {validationResult} = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        const errorObj = {};
        const errors = validationErrors.array()
        for(let e of errors){
            errorObj[e.param] = e.msg;
        }
        const err = Error('Bad Request.');
        err.errors = errorObj;
        err.status = 400;
        err.title = 'Bad Request.';
        next(err);
    }
    next();
}

module.exports = { handleValidationErrors };
