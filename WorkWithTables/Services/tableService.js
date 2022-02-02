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
        });

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

    async setMark(journalName, subject, student, mark) {
        const journal = new ExcelJS.Workbook;
        // journal.xlsx.readFile(`${journalName}.xlsx`);
        journal.xlsx.readFile("C:/Users/the_best/Desktop/Enterprise Developer/SchoolJournal/WorkWithTables/test.xlsx").then(() => {
            console.log(journal.title);

        journal.worksheets.forEach(ws => {
            if (ws.name == subject) {
                ws.getColumn(1).eachCell((cell) => {
                    if (cell.text == student) {
                        ws.getRow(cell.row).eachCell((cell) => {
                            if (cell.text.substring(0,2).includes(new Date().getDay())) {
                                cell.text = mark;
                                
                                journal.xlsx.writeFile(`${journalName}.xlsx`); //remove later, here just for tests

                                return {
                                    res: "Mark set successfully!"
                                }
                            }
                        })
                    }
                });
                throw new Error("This student does not exist!");
            }
        });
        throw new Error("This page does not exist!");
        })
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