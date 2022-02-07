const authService = require("../Services/authService.js");

class AuthController {
    /**
     * It was supposed to take data from either headers (if the request was sent from WorkWithTables) or body (if the result was sent by a human)
     */
    async login(req, res, next) {
        try {
            var journalName1 = req.query.journal_name
            var journalName2 = req.body.journal_name

            var result;
            if (journalName1)
                result = await authService.login(journalName1)
            else
                result = await authService.login(journalName2)
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