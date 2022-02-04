const ShortDate = require("./ShortDate");

module.exports = class InitJournal {
    name;
    subjects;
    students;
    staringDate;
    pageSize;

    constructor(name = "Journal", subjects = ["Algebra", "Geometry", "English", "Physics", "P.E"], students = ["Василь", "Петро", "Тарас", "Єгор"], startingDate = ShortDate.today().toString(), pageSize = 14) {
        this.name = name;
        this.subjects = subjects;
        this.students = students;
        this.staringDate = startingDate;
        this.pageSize = pageSize;
    }
}