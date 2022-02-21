const Logger = require("../../Utils/Logger");
/**
 * 
 * @param {Error} err 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (err, req, res, next) => {
    Logger.error(err);
    console.log(err);
    return res./*status(500).*/json({err: err.message});
}

