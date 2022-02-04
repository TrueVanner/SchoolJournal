require("dotenv").config();
const Logger = require("../Utils/Logger");
const express = require("express");

const tableRouter = require("./Routers/tableRouter.js");
const errMiddleware = require("./Middlewares/errMiddleware");
const authMiddleware = require("./Middlewares/authMiddleware");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/table", tableRouter);
//app.use(authMiddleware);
app.use(errMiddleware);

app.get('/table/getJournal', function(req, res){
    res.download(process.env.JOURNAL_DIRECTORY + req.query.journal_name + ".xlsx");
});

const start = async () => {
    try {
        app.listen(PORT, () => {
            Logger.serverStart(PORT);
        });
    } catch (e) {console.log(e)}
}

start();