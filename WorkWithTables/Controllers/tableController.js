const tableService = require("../Services/tableService.js");

class TableController {
    async create(req, res, next) {
        try {
            const {name} = req.body;
            const {subjects, students, starting_date, page_size} = req.body.params;
            const result = await tableService.create(name, subjects, students, starting_date, page_size);
            return res.json({result});
        } catch (e) {next(e);}
    }
    
    async setMark(req, res, next) {
        try {
            const {subject, student, mark, date} = req.body;
            const result = await tableService.setMark(req.query.journal_name, subject, student, mark, date);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async addStudent(req, res, next) {
        try {
            const {student} = req.body;
            const result = await tableService.addStudent(req.query.journal_name, student);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async removeStudent(req, res, next) {
        try {
            const {student} = req.body;
            const result = await tableService.removeStudent(req.query.journal_name, student);
            return res.json({result});
        } catch (e) {next(e);}
    }
    async updateStudent(req, res, next) {
        try {
            const {old_student, new_student} = req.body;
            const result = await tableService.updateStudent(req.query.journal_name, old_student, new_student);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async addSubject(req, res, next) {
        try {
            const {subject} = req.body;
            const result = await tableService.addSubject(req.query.journal_name, subject);
            return res.json({result});
        } catch (e) {next(e);}
    }
    async removeSubject(req, res, next) {
        try {
            const {subject} = req.body;
            const result = await tableService.removeSubject(req.query.journal_name, subject);
            return res.json({result});
        } catch (e) {next(e);}
    }
    async updateSubject(req, res, next) {
        try {
            const {old_subject, new_subject} = req.body;
            const result = await tableService.updateSubject(req.query.journal_name, old_subject, new_subject);
            return res.json({result});
        } catch (e) {next(e);}
    }
}

module.exports = new TableController();