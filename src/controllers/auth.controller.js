const { render } = require("ejs");
const { use } = require("../routes/auth.route");
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const config_mail = {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user:"dungbui180603@gmail.com",
        pass: "goqjwygogxqhmfqy"
    }
}

const transpost = nodemailer.createTransport(config_mail);



exports.register = (req,res)=>{      
    const auth = req.session.auth;
    if(auth) return res.send(`Ban da login bang email ${auth.email}`);    
    res.render("auth/register");
}
exports.create_user = async (req,res)=>{
    try {
        let existuser = await User.findOne({email:req.body.email});
        if(existuser) return res.status(422).send("Email is exist..");
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(req.body.password,salt);
        // save to db
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPwd
        })
        await user.save();
        req.session.auth= {
            name: user.name,
            email: user.email,
        }
        res.send("DONE");
    } catch (error) {
        res.send(error);
    }
}

exports.login =  (req,res)=>{
   res.render("auth/login");     
}
exports.loginUser = async (req,res)=>{
    try {
        let existuser = await User.findOne({email:req.body.email});
        if(!existuser) return res.status(401).send("Email or password is not correct..");
        const verified = await bcrypt.compare(req.body.password,existuser.password);
        if(!verified) return res.status(401).send("Email or password is not correct..");
        // login successfully
        res.send("Login DONE");
    } catch (error) {
        res.send(error);
    }
}
//change password
exports.edit = (req,res)=>{
    res.render("auth/edit")
}
exports.edituser = async (req,res)=>{
    try {
        let existuser = await User.findOne({email:req.body.email});
        if(!existuser) return res.status(401).send("Email is correct..");
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(req.body.password,salt);
        // save to db
        existuser.password = hashPwd;
        await existuser.save();
        res.send("DONE");
    } catch (error) {
        res.send(error);
    }
}

exports.logout = (req,red)=>{
    req.session.auth = null;
    req.redirect("/auth/login");
}

exports.form_forgot = (req,res)=>{
    res.render("auth/forgot");
}
exports.forgot = async (req,res)=>{
    const email = req.body.email;
    try {
        const user = await User.findOne({email:email});
        if(!user) return res.redirect("/auth/forgot-password");
        //neu co email
        const randomStr = btoa(user.email);
        const linkReset = "http://localhost:3000/auth/reset-password?code="+randomStr;        
        req.session.resetpassword ={
            user: user,
            code: randomStr
        };
        //send email
        transport.sendMail({
            from: "Demo NodeJS T2204M",
            to: user.email,      
            cc:"",
            subject: "Lấy lại mật khẩu tài khoản",
            html: `<p>Click <a href="${linkReset}">here</a> to reset password.</p>`  
        });
        res.send("Vui lòng kiểm tra email và kiểm tra hướng dẫn");
    } catch (error) {
        res.send(error);
    }
}

exports.from_reset = (req,res)=>{
    //check code
    const code = req.query.code;
    const resetSession = req.session.resetpassword;
    if(code != resetSession.code) return res.status(404).send("Error");
    res.render("auth/reset");
}
exports.reset = async (req,res)=>{
    const new_pass = req.body.password;
    const resetSession = req.session.resetpassword;
    const user = resetSession.user;
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(new_pass,salt);

    await User.findByIdAndUpdate(user._id,{
        password:hashPwd
    });
    req.session.resetpassword = null;
    res.send("done");
}
