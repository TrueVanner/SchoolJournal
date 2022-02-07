const Router = require("express").Router;
const contoller = require("../Controllers/tableController");

const authMiddleware = require("../Middlewares/authMiddleware");

const router = new Router();

router.post("/createJournal", contoller.create);
router.put("/setMark", contoller.setMark);
router.post("/addStudent", contoller.addStudent);
router.delete("/removeStudent", contoller.removeStudent);
router.post("/updateStudent", contoller.updateStudent);
router.post("/addSubject", contoller.addSubject);
router.delete("/removeSubject", contoller.removeSubject);
router.post("/updateSubject", contoller.updateSubject);

module.exports = router;