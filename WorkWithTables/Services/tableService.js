const fs = require("fs");

const ExcelJS = require('exceljs');

const http = require("http");

const InitJournal = require("../../Utils/InitJournal");
const ShortDate = require("../../Utils/ShortDate");
const Logger = require("../../Utils/Logger");
const { fileURLToPath } = require("url");

class TableService {
    /**
     * Creates an array of ShortDates for the specified amount of days (page size)
     * 
     * @param {ShortDate} date - starting date of the journal
     * @param {number} n - basically page size
     * @returns ShortDate array
     */
    pageDate(date, n) {
        const res = [null];
        var day = date.day;
        var month = date.month;

        for (let i = 0; i < n; i++) {
            if (day > ([1, 3, 5, 7, 8, 10, 12].includes(month) ? 31 : (month == 2 ? 28 : 30))) {
                day = 1;
                month++;
            }

            if (month > 12) {
                day == 1;
                month == 1;
            }

            res.push(new ShortDate(`${day}.${month}`).userFriendly().toString());
            day++;
        }
        return res;
    }

    /**
     * Optimized WorkBook loading.
     */
    initWorkbook(name) {
        const wb = new ExcelJS.Workbook;
        return wb.xlsx.readFile(process.env.JOURNAL_DIRECTORY + name + ".xlsx");
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
                'Content-Length': Buffer.byteLength(data)
            }
        }, res => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(body));
        })
        req.on("error", () => reject)
        req.write(data);
        req.end();
        });
    };

    /**
     * Creates a new page in the specified journal according to the journal format.
     */
    createNewJournalPage(journal, subject, students) {
        const pageSize = parseInt(journal.keywords.split(" ")[0]);

        const ws = journal.addWorksheet(subject);
        ws.getRow(1).values = this.pageDate(new ShortDate(journal.keywords.split(" ")[1]), pageSize);
        ws.getColumn(1).values = students;
        ws.getColumn(1).width = 30;
        for(let i = 2; i < pageSize+2; i++) {
            ws.getColumn(i).width = 7;
        }
        ws.getRow(1).getCell(pageSize + 3).value = "Average"
    }

    /**
     * When creating a subject page dublicate, 
     * @param {String} subject - subject name to find dublicates of
     * 
     */
    checkDublicates(journal, subject) {
        var res = 0;
        journal.eachSheet((ws) => {
            if (ws.contains(subject)) res++;
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
        const init = new InitJournal(name, subjects, students, starting_date, page_size);
        init.students.unshift(null);

        const journal = new ExcelJS.Workbook();

        journal.keywords = init.pageSize + " " + new ShortDate(init.staringDate).noZeros().toString(); //for future use
        journal.title = name;

        init.subjects.forEach(subject => {
            this.createNewJournalPage(journal, subject, init.students);
        });

        return journal.xlsx.writeFile(`${name}.xlsx`).then(function() {
            return `New journal with a name '${name}.xlsx' was created successfully!`
            // const body = that.httpRequest("/auth/login", JSON.stringify({
            //     user_type: "teacher",
            //     journal_name: name
            // }));
            // return JSON.parse(body);
        });
    }


    /**
     * Sets a mark for the student in the specified journal. One student can only get one mark per day (per subject).
     * To change a mark, simply add a new one on the same date.
     * @param {ShortDate (String)} date - the date when the mark should be placed on. Current date is the default.
     * @returns status of the operation
     */
    async setMark(journalName, subject, student, mark, date) {
        var success = false;
        var that = this; //how to call class functions from a promise?
        

        return this.initWorkbook(journalName)
        .then(function (journal) {
            const pageSize = parseInt(journal.keywords.split(" ")[0]);
            journal.eachSheet(ws => {
                if (ws.name.includes(subject)) {
                    ws.getColumn(1).eachCell((cell1) => {
                        if (cell1.text == student) {
                            if(!date) {
                                date = ShortDate.today();
                            } else date = new ShortDate(date);
                            if (date.relativeTo(new ShortDate(ws.getCell(1, pageSize + 1).text)) <= 0) { //if the date is within the page's last date
                                ws.getRow(1).eachCell((cell2) => {
                                    if (cell2.text == date.userFriendly().toString()) {
                                        ws.getCell(cell1.row, cell2.col).value = mark;
                                        ws.getCell(cell1.row, pageSize + 3).value = that.average(ws.getRow(cell1.row).values.slice(2, pageSize));
                                        success = true;
                                    }
                                });
                            }
                        } 
                    });
                    //if (!success) success = "This student doesn't exist!";
                }
            });
            if (success == false) {
                that.createNewJournalPage(journal, that.checkDublicates(journal, subject), journal.getWorksheet(1).getColumn(1).values)
            }

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return (success == true ? "Success!" : success)
            })
        });
    }

    /**
     * Adds a new student, if he doesn't already exist. A student can have any desirable name
     * @returns status of the operation
     */
    async addStudent(journalName, student) {
        var success = false;
        return this.initWorkbook(journalName)
        .then(function (journal) {
            if (!journal.getWorksheet(1).getColumn(1).values.includes(student)) {
                journal.eachSheet(ws => {
                    ws.addRow([student]);
                    success = true;
                });
            }

            return journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(() => {
                return (success ? "Success!" : "This student already exists!")
            });
        });
    }
}

module.exports = new TableService();