require("dotenv").config();
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

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log("Server started, port = " + PORT);
        });
    } catch (e) {console.log(e)}
}

start();