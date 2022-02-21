const Router = require("express").Router;
const controller = require("../Controllers/tableController");

const authMiddleware = require("../Middlewares/authMiddleware");

const router = new Router();

router.post("/createJournal", controller.create);
router.put("/setMark", controller.setMark);
router.post("/addStudent", controller.addStudent);
router.delete("/removeStudent", controller.removeStudent);
router.post("/updateStudent", controller.updateStudent);
router.post("/addSubject", controller.addSubject);
router.delete("/removeSubject", controller.removeSubject);
router.post("/updateSubject", controller.updateSubject);

router.post("/getStudents", controller.getStudents);
router.post("/getSubjects", controller.getSubjects);

module.exports = router;