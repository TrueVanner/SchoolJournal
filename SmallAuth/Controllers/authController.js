const authService = require("../Services/authService.js");

class AuthController {
    async login(req, res, next) {
        try {
            const {user_type, journal} = req.query;
            const result = await authService.login(user_type, journal);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async validateT(req, res, next) {
        try {
            const {token} = req.query;
            const result = await authService.validateT(token);

            return res.json({result});
        } catch (e) {next(e);}
    }

}

module.exports = new AuthController();