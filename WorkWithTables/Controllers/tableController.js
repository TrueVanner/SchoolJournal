const tableService = require("../Services/tableService.js");

class TableController {
    async create(req, res, next) {
        try {
            const {name} = req.body;
            const {subjects, students, starting_date, page_size} = req.body.parameters;
            const result = await tableService.create(name, subjects == null ? undefined : subjects, students == null ? undefined : students, starting_date, page_size);
            return res.json({result});
        } catch (e) {next(e);}
    }
    
    async setMark(req, res, next) {
        try {
            const {journal_name, subject, student, mark, date} = req.body;
            const result = await tableService.setMark(journal_name, subject, student, mark, date);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async addStudent(req, res, next) {
        try {
            const {journal_name, student} = req.body;
            const result = await tableService.addStudent(journal_name, student);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async removeStudent(req, res, next) {
        try {
            const {journal_name, student} = req.body;
            const result = await tableService.removeStudent(journal_name, student);
            return res.json({result});
        } catch (e) {next(e);}
    }
    async updateStudent(req, res, next) {
        try {
            const {journal_name, old_student, new_student} = req.body;
            const result = await tableService.updateStudent(journal_name, old_student, new_student);
            return res.json({result});
        } catch (e) {next(e);}
    }

    async addSubject(req, res, next) {
        try {
            const {journal_name, subject} = req.body;
            const result = await tableService.addSubject(journal_name, subject);
            return res.json({result});
        } catch (e) {next(e);}
    }
    async removeSubject(req, res, next) {
        try {
            const {journal_name, subject} = req.body;
            const result = await tableService.removeSubject(journal_name, subject);
            return res.json({result});
        } catch (e) {next(e);}
    }
    async updateSubject(req, res, next) {
        try {
            const {journal_name, old_subject, new_subject} = req.body;
            const result = await tableService.updateSubject(journal_name, old_subject, new_subject);
            return res.json({result});
        } catch (e) {next(e);}
    }

    
    async getStudents(req, res, next) {
        try {
            const result = await tableService.getStudents(req.body.journal_name);
            return res.json({result});
        } catch (e) {next(e);}
    }
    async getSubjects(req, res, next) {
        try {
            const result = await tableService.getSubjects(req.body.journal_name);
            return res.json({result});
        } catch (e) {next(e);}
    }
}

module.exports = new TableController();