const fs = require("fs");

const ExcelJS = require('exceljs');

const http = require("http");

class TableService {
    dateCheck(day, month, n) {
        const res = [null];
        for (let i = 0; i < n; i++) {
        if (day > ([1, 3, 5, 7, 8, 10, 12].includes(month) ? 31 : (month == 2 ? 28 : 30))) {
            day = 1;
            month++;
        }

        if (month > 12) {
            day == 1;
            month == 1;
        }

        res.push(`${day > 9 ? day : "0" + day}.${month > 9 ? month : "0" + month}`);
        day++;
        }
        return res;
    }

    initWorkbook(name) {
        const wb = new ExcelJS.Workbook;
        return wb.xlsx.readFile(process.env.JOURNAL_DIRECTORY + name + ".xlsx");
    }

    async create(name, params) {
        if (!name) name = "Journal"
        if (!params) {
            params = {
                subjects: ["Algebra", "Geometry", "English", "Physics", "P.E"],
                students: [null, "Василь", "Петро", "Тарас", "Єгор"],
                size: 14
            }
        }
        const now = new Date();

        /*
        const table = [];
        const data = [];
        
    
        data[0] = this.dateCheck(now.getDate(), now.getMonth() + 1, params.size);
    
        for (let student of params.students) {
            data.push([student]);
        }
        for (let subject of params.subjects) {
            table.push({name: subject, data: data})
        }
        const buffer = xlsx.build(table);
        // fs.writeFile(`${process.env.JOURNAL_DIRECTORY}/${name}.xlsx`, buffer, (err) => {
        //     if (err) throw err;
        // });
        fs.writeFile(`${name}.xlsx`, buffer, (err) => {
            if (err) throw err;
        }); */

        const journal = new ExcelJS.Workbook();
        params.subjects.forEach(s => {
            const ws = journal.addWorksheet(s);
            ws.getRow(1).values = this.dateCheck(now.getDate(), now.getMonth() + 1, params.size);
            ws.getColumn(1).values = params.students;
            ws.getColumn(1).width = 30
            for(let i = 2; i < params.size+2; i++) {
                ws.getColumn(i).width = 7;
            }
        });

        journal.title = name;

        await journal.xlsx.writeFile(`${name}.xlsx`);
        var body;

        //var client = http.createClient()

        // const req = http.request({
        //     "hostname": "localhost",
        //     "post": "3000",
        //     "path": "/auth/login",
        //     "method": "POST",
        //     "headers": {
        //         "user_type": "teacher",
        //         "journal_name": name
        //     }
        // });
        // req.end();
        // req.on("response", (res) => {
        //     console.log(res);
        // })

       /* const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/auth/login',
            method: 'POST',
          };

        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              body = JSON.parse(chunk);
              console.log(body);
            });
            res.on('end', () => {
                return {
                    res: `New journal with a name \"${name}.xlsx\" created successfully!`,
                    token: body.result.token
                }
            })
          });

          req.end();   */
    }

    async setMark(journalName, subject, student, mark, date) {
        const result = this.initWorkbook(journalName)
        .then(function (journal) {
            journal.eachSheet(ws => {
                if (ws.name == subject) {
                    ws.getColumn(1).eachCell((cell) => {
                        if (cell.text == student) {
                            if(!date) {
                                const now = new Date();
                                const day = now.getDate();
                                const month = now.getMonth() + 1;
                                date = `${day > 9 ? day : "0"+day}.${month > 9 ? month : "0"+month}`;
                            }
                            ws.getRow(1).eachCell((cell2) => {
                                if (cell2.text == date) {
                                    ws.getCell(cell.row, cell2.col).value = mark;
                                }
                            })
                        }
                    });
                    //throw new Error("This student does not exist!");
                }
            });
            journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(function () {
                return "Success!";
             });
            //throw new Error("This page does not exist!");
        });
        return {
            res: result
        }
    }

    async addStudent(journalName, student) {
        const result = this.initWorkbook(journalName)
        .then(function (journal) {
            if (!journal.getWorksheet(1).getColumn(1).values.includes(student)) {
                journal.eachSheet(ws => {
                    ws.lastRow.getCell(1).value = student;
                });
            } else throw new Error("This student already exists!");

            journal.xlsx.writeFile(process.env.JOURNAL_DIRECTORY + journalName + ".xlsx").then(function () {
                return "Success!";
            });
        });
        return {
            res: result
        }
    }

    /*async login(userType) {
        const token = tokenService.generateToken({
            user_type: userType
        });
        
        return {
            token: token,
        }
    }

    async validateT(token) {
        const data = tokenService.validateToken(token);
        return {
            res: data
        }
    }*/
}

module.exports = new TableService();