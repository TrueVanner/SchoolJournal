const tableService = require("../Services/tableService.js");

class TableController {
    async create(req, res, next) {
        try {
            const {name, params} = req.body;
            const result = await tableService.create(name, params);
            return res.json({result});
        } catch (e) {next(e);}
    }
    
    async setMark(req, res, next) {
        try {
            const {subject, student, mark} = req.body;
            const result = await tableService.setMark(req.query.journal_name, subject, student, mark);
            return res.json({result});
        } catch (e) {next(e);}
    }

    /*
    async login(req, res, next) {
        try {
            const {user_type} = req.body;
            const result = await authService.login(user_type);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async validateT(req, res, next) {
        try {
            const {token} = req.body;
            const result = await authService.validateT(token);

            return res.json({result});
        } catch (e) {next(e);}
    }*/

}

module.exports = new TableController();