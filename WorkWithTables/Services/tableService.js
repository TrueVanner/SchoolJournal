const fs = require("fs");
const ExcelJS = require('exceljs');
const http = require("http");

const InitJournal = require("../../Utils/InitJournal");
const ShortDate = require("../../Utils/ShortDate");
const Logger = require("../../Utils/Logger");

class TableService {
    /**
     * To avoid code dublcation.
     * 
     * @param {String} date - starting date of the journal in a form of a ShortDate string.
     * @param {number} n - page size
     * @returns ShortDate array
     */
    pageDate(date, n) {
        const res = [null];
        for (let i = 0; i < n; i++) {
            date = new ShortDate(date.toString());
            res.push(date.userFriendly());
            date.addDay(1);
        }
        return res;
    }

    /**
     * Optimized WorkBook loading.
     */
    initWorkbook(name) {
        const wb = new ExcelJS.Workbook;
        if (fs.existsSync(process.env.JOURNAL_DIRECTORY + name + ".xlsx")) {
            return wb.xlsx.readFile(process.env.JOURNAL_DIRECTORY + name + ".xlsx");
        } else throw new Error("This journal does not exist!");
    }

    /**
     * To avoid code dublication.
     * @param {ExcelJS.Worksheet} ws
     */
    setMarkFinal(ws, date, mark, studentPos, pageSize) {
        var status = "Unknown error 2!";
        ws.getRow(1).eachCell((cell) => {
            if (cell.text == date) {
                ws.getCell(studentPos, cell.col).value = mark;
                ws.getCell(studentPos, pageSize + 3).value = this.average(ws.getRow(studentPos).values.slice(2, pageSize));
                status = "Success!"
            }
        });
        return status;
    }

    /**
     * Was supposed to be able to send requests to any path of localhost:3000 (SmallAuth), works but 
     * I am unable to write anything in the request, which makes the whole thing useless.
     * @param {String} path - adress in localhost:3000
     * @param {JSON} data - what to write in the header
     * @returns body of the response
     */
    httpRequest(path, data) {
        return new Promise((resolve, reject) => {
            var body = "";
            const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'data': data
            }
        }, res => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(body));
        })
        req.on("error", () => reject)
        //req.write(data);
        req.end();
        });
    };

    /**
     * Creates a new page in the specified journal according to the journal format.
     * @param {ExcelJS.Workbook} journal
     * @param {String} subject
     * @param {Array<String>} students
     * @param {ShortDate} startingDate
     */
    createNewJournalPage(journal, subject, students, startingDate) {
        const pageSize = parseInt(journal.keywords.split(" ")[0]);

        const ws = journal.addWorksheet(subject);
        ws.getRow(1).values = this.pageDate(startingDate.toString(), pageSize);
        ws.getColumn(1).values = students;
        ws.getColumn(1).width = 30;
        for(let i = 2; i < pageSize+2; i++) {
            ws.getColumn(i).width = 7;
        }
        ws.getRow(1).getCell(pageSize + 3).value = "Average"

        return ws;

    }

    /**
     * When creating a subject page dublicate, determines the number of the new page based on the previous ones.
     * @param {String} subject - subject name to find dublicates of
     * @param {ExcelJS.Workbook} journal
     */
    checkDublicates(journal, subject) {
        var res = 0;
        journal.eachSheet((ws) => {
            if (ws.name.includes(subject)) res++;
        });
        return `${subject} (${res + 1})`;
    }
    /**
     * Only needed to calculate students average, because, believe it or not, ExcelJS cannot count! I'm not kidding. 
     * At least that's what they say in their documentation.
     * @param {Array<number>} arr - an array of cell values
     * @returns array's average.
     */
    average(arr) {
        var res = 0, i = 0;
        arr.forEach((n) => {
            if (n) {
                res += parseInt(n);
                i++;
            }
        })
        return res / i;
    }

    /**
     * 
     * @param {String} name - name of the future journal
     * @param {Array<String>} subjects - for each subject, a new page will be created.
     * @param {Array<String>} students - for each student, a new entry on the left will be created
     * @param {ShortDate (String)} starting_date - the first date of the journal. All the future dates will be counted from this point
     * @param {number} page_size - amount of dates on one page. I tried to make it like a real paper journal, with a
     *                        limited amount of dates per subject page.
     * @returns status of the operation
     */
    async create(name, subjects, students, starting_date, page_size) {
        if (fs.existsSync(process.env.JOURNAL_DIRECTORY + name + ".xlsx")) return "The journal with this name already exists!";
        const init = new InitJournal(name, subjects, students, starting_date, page_size);
        console.log(init)
        init.students.unshift(null);

        const journal = new ExcelJS.Workbook();

        journal.keywords = init.pageSize + " " + new ShortDate(init.staringDate).noZeros().toString(); //for future use
        journal.title = name;

        init.subjects.forEach(subject => {
            this.createNewJournalPage(journal, subject, init.students, new ShortDate(init.staringDate).noZeros());
        });


        return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + name + ".xlsx").then(function() {
            return `New journal with a name '${name}.xlsx' was created successfully!`
            // const body = that.httpRequest("/auth/login", JSON.stringify
            //     journal_name: name
            // }));
            // return body;
        });
    }


    /**
     * Sets a mark for the student in the specified journal. One student can only get one mark per day (per subject).
     * To change a mark, simply add a new one on the same date.
     * @param {ShortDate} date - is a String. It's the date when the mark should be placed on, current date is the default.
     * @returns status of the operation
     */
    async setMark(journalName, subject, student, mark, date) {
        var status = "Unknown error!";
        var that = this; //how to call class functions from a promise?    

        return this.initWorkbook(journalName)
        .then(function (journal) {
            if(!date) {
                date = ShortDate.today();
            } else { 
                date = new ShortDate(date);
                if (date.relativeTo(new ShortDate(journal.keywords.split(" ")[1])) == -1) {
                    return "Wrong date: it's earlier than the journal's starting date!"
                }
            }
            date.userFriendly();

            const pageSize = parseInt(journal.keywords.split(" ")[0]);
            const students = journal.getWorksheet(1).getColumn(1).values;
            var studentPos, lastDate;

            if (!students.includes(student)) {
                return "This student does not exist!";
            }
            else 
                studentPos = students.indexOf(student);
            
            journal.eachSheet(ws => {
                if (ws.name.includes(subject)) {
                    
                    lastDate = new ShortDate(ws.getCell(1, pageSize + 1).text);
                    if (date.relativeTo(lastDate) <= 0) { //if the date is within the page's last date
                        status = that.setMarkFinal(ws, date.userFriendly(), mark, studentPos, pageSize);
                    }
                }
            });
            if (status == "Unknown error!") { //shows that the only problem is the absence of specified date within the existing set of pages.
                var ws;
                while (date.relativeTo(lastDate) > 0) {
                    ws = that.createNewJournalPage(journal, that.checkDublicates(journal, subject), students, lastDate.addDay(1));
                    lastDate = new ShortDate(ws.getCell(1, pageSize + 1).text);
                }
                status = that.setMarkFinal(ws, date.userFriendly(), mark, studentPos, pageSize);
            }

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return status;
            })
        });
    }

    /**
     * Adds a new student to the journal. A student can have any desirable name.
     * @param {String} journalName 
     * @param {String} student - name of the new student
     * @returns status of the operation.
     */
    async addStudent(journalName, student) {
        var status = "Unknown error!"
        return this.initWorkbook(journalName)
        .then(function (journal) {
            if (!journal.getWorksheet(1).getColumn(1).values.includes(student)) {
                journal.eachSheet(ws => {
                    ws.addRow([student]);
                    status = "Success!";
                });
            } else return "This student already exists!"

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return status;
            });
        });
    }
    
    /**
     * Removes a student from the journal 
     * @param {String} journalName 
     * @param {String} student - name of the student to remove
     * @returns status of the operation.
     */
    async removeStudent(journalName, student) {
        var status = "Unknown error!"
        return this.initWorkbook(journalName)
        .then(function (journal) {
            const students = journal.getWorksheet(1).getColumn(1).values;
            if (students.includes(student)) {
                journal.eachSheet(ws => {
                    ws.spliceRows(students.indexOf(student), 1);
                    status = "Success!";
                });
            } else return "This student does not exist!"

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return status;
            });
        });
    }
    
    /**
     * Updates a student from the database
     * @param {String} journalName 
     * @param {String} student - old student name
     * @param {String} newStudent - new student name
     * @returns status of the operation.
     */
    async updateStudent(journalName, student, newStudent) {
        var status = "Unknown error!"
        return this.initWorkbook(journalName)
        .then(function (journal) {
            const students = journal.getWorksheet(1).getColumn(1).values;
            if (students.includes(student)) {
                journal.eachSheet(ws => {
                    ws.getRow(students.indexOf(student)).getCell(1).value = newStudent;
                    status = "Success!";
                });
            } else return "This student does not exist!"

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return status;
            });
        });
    }
    
    /**
     * Adds a new subject to the journal, creating a page formatted the same way as all the other ones
     * @param {String} journalName 
     * @param {String} subject - name of the subject to add
     * @returns status of the operation.
     */
    async addSubject(journalName, subject) {
        var status = "Unknown error!"
        var that = this;

        if (!subject) return "No subject name!";

        return this.initWorkbook(journalName)
        .then(function (journal) {
            journal.eachSheet(ws => {
                if (ws.name == subject) status = "This subject already exists!"
            });
            if (status != "This subject already exists!") {
                that.createNewJournalPage(journal, subject, journal.getWorksheet(1).getColumn(1).values, new ShortDate(journal.keywords.split(" ")[1]));
                status = "Success!";
            }

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return status;
            });
        });
    }
    
    /**
     * Removes all subject pages from the journal. When selecting pages by names, will only take the originals ("English"),
     * and copies ("English (1)"), ignoring any other formats (Like "Grammar(English)", which some teachers might create)
     * @param {String} journalName 
     * @param {String} subject - name of the subject to remove
     * @returns status of the operation.
     */
    async removeSubject(journalName, subject) {
        var status = "This subject does not exist!"

        return this.initWorkbook(journalName)
        .then(function (journal) {
            journal.eachSheet(ws => {
                if (ws.name == subject || ws.name.includes(`${subject} (`)) {  // all pages and copies ("English" and "English (1)"), 
                    journal.removeWorksheet(ws.id);                            //not including pages like "Grammar(English)"", which some teachers might create
                    status = "Success!"; // success if at least one page was removed
                }
            });

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return status;
            });
        });
    }
    
    /**
     * Updates all subject pages with a new name. Data within remains unchanged.
     * @param {String} journalName 
     * @param {String} subject - old subject name
     * @param {String} newSubject - new subject name
     * @returns status of the operation.
     */
    async updateSubject(journalName, subject, newSubject) {
        var status = "This subject does not exist!"

        return this.initWorkbook(journalName)
        .then(function (journal) {
            journal.eachSheet(ws => {
                if (ws.name == subject || ws.name.includes(`${subject} (`)) {
                    ws.name = ws.name.replace(subject, newSubject);
                    status = "Success!"; // success if at least one page was updated
                }
            });

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return status;
            });
        });
    }


    async getStudents(journalName) {
        return this.initWorkbook(journalName).then((journal) => {
            return journal.getWorksheet(1).getColumn(1).values.slice(2);
        })
    }
    async getSubjects(journalName) {
        let arr = [];
        return this.initWorkbook(journalName).then((journal) => {
            journal.eachSheet((sheet) => {
                arr.push(sheet.name);
            })
            return arr;
        });

        
    }
}

module.exports = new TableService();