const mongoose = require("mongoose");
const user = new mongoose.Schema({
    fristName:{
        type: String,
        required: true,
        minLength:[6,"Tên phải có độ dài tối thiểu là 6"],
        maxLength:100
    },
    lastName:{
        type: String,
        require: true,
        minLength: [6,"Tên phải có độ dài tối thiểu là 6"],
        maxLength:100
    },
    mobileNumber:{
        type: Number,
        require: true,
        minLength: 11,
        maxLength: 12
    },
    userNmae:{
        type:String,
        required:true,
        minLength:6,
        maxLength:255
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        maxLength:255
    },
});
module.exports = mongoose.model("User",user);