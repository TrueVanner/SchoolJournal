const Router = require("express").Router;
const contoller = require("../Controllers/tableController");

const authMiddleware = require("../Middlewares/authMiddleware");

const router = new Router();

router.post("/createJournal", contoller.create);
router.post("/setMark", authMiddleware, contoller.setMark);
router.post("/addStudent", authMiddleware, contoller.addStudent);

module.exports = router;