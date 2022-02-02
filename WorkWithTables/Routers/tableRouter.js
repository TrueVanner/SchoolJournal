const Router = require("express").Router;
const contoller = require("../Controllers/tableController");

const router = new Router();

router.post("/create", contoller.create);
//router.post("/add", contoller.add);
//router.post("/remove", contoller.remove);
//router.post("/update", contoller.update);

module.exports = router;