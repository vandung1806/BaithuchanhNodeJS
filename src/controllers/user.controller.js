const { use } = require("./../models/user");
const User = require("../models/user");

exports.create = (req,res)=>{
    res.render("user/form");
};

exports.save = async (req,res)=>{
    try {
        const rs = await User.find({});
        res.render("user/list", {
            users: rs
        })
    } catch (error) {
        res.send(error);
    }
   };
