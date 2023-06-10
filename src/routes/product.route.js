const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");



const multer = require("multer");
const storage =  multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/uploads/product");
    },
    filename: function(req,file,cb){
        cb(null,Date,now()+"-"+file.originalname);
    }
});
const upload = multer({storage:storage});


router.get("/",controller.get);
router.get("/create",controller.create);
router.post("/create",upload.single("thumbnall"),controller.save);

module.exports = router;