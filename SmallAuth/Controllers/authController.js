const authService = require("../Services/authService.js");

class AuthController {
    async login(req, res, next) {
        try {
            const {data, user_type, journal} = req.query;
            var result;
            if (data) 
                result = await authService.login(data);
            else
                result = await authService.login(JSON.stringify({
                    user_type: user_type,
                    journal: journal
                }));
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