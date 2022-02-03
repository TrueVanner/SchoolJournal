const Router = require("express").Router;
const contoller = require("../Controllers/tableController");

const authMiddleware = require("../Middlewares/authMiddleware");

const router = new Router();

router.post("/createJournal", contoller.create);
router.post("/setMark", authMiddleware, contoller.setMark);
router.post("/addStudent", authMiddleware, contoller.addStudent);
//router.post("/add", contoller.add);
//router.post("/remove", contoller.remove);
//router.post("/update", contoller.update);

module.exports = router;