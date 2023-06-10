const express = require("express");
const router = express.Router();

const controller = require("./../controllers/auth.controller");
const middleware = require("./../middlewares/auth.middleware");

router.get("/register",controller.register);
router.post("/register",controller.create_user);

router.use("/register",middleware.guest);
router.use("/forgot-password",middleware.guest);
router.use("/reset-passwor",middleware.guest);

router.use("/logout",middleware.logged);


router.get("/login",controller.login);
router.post("/login",controller.loginUser);

router.get("/edit",controller.edit);
router.post("/edit",controller.edituser);

router.post("/logout",controller.logout);

router.get("/forgot-password",controller.form_forgot);
router.post("/forgot-password",controller.forgot);

router.get("/reset-password",controller.from_reset);
router.post("/reset-password",controller.reset);

module.exports = router;