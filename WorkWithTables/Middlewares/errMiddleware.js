const Logger = require("../../Utils/Logger");

module.exports = (err, req, res, next) => {
    Logger.error(err);
    console.log(err);
    return res.status(500).json({err});
}

