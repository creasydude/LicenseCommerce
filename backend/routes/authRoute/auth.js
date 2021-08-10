import express from 'express';
import userSchema from '../../db/userSchema.js';
import otpSchema from '../../db/otpSchema.js';
import Otp from './otp.js';
import bcrypt from 'bcrypt';
import joiVerification from './verification.js'
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
const Router = express.Router();

//JWT TOKEN SECTION\\
const getAccessToken = (data) => {
    return jwt.sign({ _id: data._id, isAdmin: data.isAdmin }, process.env.AUTH_KEY, { expiresIn: '1h' });
}
const getRefreshToken = (data) => {
    return jwt.sign({ _id: data._id, isAdmin: data.isAdmin }, process.env.REF_KEY);
}
//JWT TOKEN SECTION\\

Router.post('/auth', async (req, res) => {
    //Body : email 
    const emailVerification = await joiVerification(req.body.email);
    if (emailVerification.error) return res.status(400).json(emailVerification.error.details[0].message);

    const OtpRequestHandler = async (email) => {
        const otpExist = await otpSchema.findOne({ email: email });
        if(otpExist) return res.status(400).json({message : "Otp Exist! Wait 1 Min."})
        const genSalt = await bcrypt.genSalt(10);
        const notHashedOtp = Otp();

        //Mail The Otp Section
        // let testAccount = await nodemailer.createTestAccount();
        // var transporter = nodemailer.createTransport({
        //     host: "smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //         user: "121b8900abae4f",
        //         pass: "c17d5490ca8645"
        //     }
        // });

        // let info = await transporter.sendMail({
        //     from: 'NO REPLY | support@creasy.com', // sender address
        //     to: email, // list of receivers
        //     subject: "Your Otp Code Is Here.", // Subject line
        //     text: notHashedOtp, // plain text body
        //     html: `<b>${notHashedOtp}</b>`, // html body
        // });
        //Mail The Otp Section
        console.log(notHashedOtp);

        if (!otpExist) {
            const otp = new otpSchema({
                email: email,
                otp: await bcrypt.hash(notHashedOtp, genSalt),
            })

            try {
                const otpSave = await otp.save();
                return res.status(201).json({ message: "201 Otp Created!" });
            } catch (err) {
                return res.status(400).json({ message: err });
            }

        } else if (otpExist) {
            return res.status(400).json({ message: "400 Otp Exist! Wait 1 Min!" })
        }

    }

    const emailExist = await userSchema.findOne({ email: req.body.email });

    if (emailExist) {
        return OtpRequestHandler(req.body.email);
    }


    const addMail = new userSchema({ email: req.body.email });
    try {
        const saveMailToDb = await addMail.save();
        OtpRequestHandler(req.body.email);
    } catch (err) {
        return res.status(400).json({ message: err });
    }

});

Router.post('/authVerify', async (req, res) => {
    //Body : email , otp
    const getOtpFromDb = await otpSchema.findOne({ email: req.body.email });
    if (!getOtpFromDb) return res.status(400).json({message: "400 Make New Login!No Otp Found!"})

    const comparedOtp = await bcrypt.compare(req.body.otp, getOtpFromDb.otp)
    if (!comparedOtp) return res.status(401).json({ message: "401 Wrong Otp ,Access Denied!" })

    const getInfoFromMainDb = await userSchema.findOne({ email: req.body.email });
    const accessToken = getAccessToken(getInfoFromMainDb);
    const refreshToken = getRefreshToken(getInfoFromMainDb);
    try {
        const insertRefTokenToDb = await userSchema.updateOne({ email: req.body.email }, { token: refreshToken });
    } catch (err) {
        return res.status(400).json({ message: "400 Bad Request!" })
    }
    res.status(200).json({ message: "Logged In !", accessToken: accessToken, refreshToken: refreshToken });


});

Router.post('/refreshToken', async (req, res) => {
    //Body : token
    const findRefTokenFromDb = await userSchema.findOne({ token: req.body.token });
    if(!findRefTokenFromDb) return res.status(401).json({ message: "401 You Should Login Again!" });
    if (!findRefTokenFromDb.token) return res.status(401).json({ message: "401 You Should Login Again!" });

    try {
        const verifyRefToken = await jwt.verify(findRefTokenFromDb.token, process.env.REF_KEY);
        const newAccessToken = getAccessToken(findRefTokenFromDb);
        res.status(200).json({ message: "Access Token Refreshed!", accessToken: newAccessToken });

    } catch (err) {
        return res.status(400).json({ message: err });
    }
});


Router.post('/isAuth' , async (req,res) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ message: "401 Access Denied No Token Found!" })
    try {
        const verifyToken = jwt.verify(token, process.env.AUTH_KEY);
        res.status(200).json({isAuth : true})
    } catch (err) {
        return res.status(200).json({isAuth: false})
    }
})

Router.delete('/logout', async (req, res) => {
    //Body : _id (objectId)
    const findRefIdFromDb = await userSchema.findOne({ _id: req.body._id });
    if (!findRefIdFromDb) return res.status(400).json({ message: "400 No User Found!" });
    try {
        const removeRefTokenFromDb = await userSchema.updateOne({ _id: req.body._id }, {token : null});
        res.status(200).json({ message: "200 Success Logout!" })
    } catch (err) {
        return res.status(400).json({ message: "400 Bad Request!" });
    }
})

// Router.delete('/logout', async (req, res) => {
//     //Body : token
//     const findRefTokenFromDb = await userSchema.findOne({ token: req.body.token });
//     if (!findRefTokenFromDb) return res.status(400).json({ message: "400 No Token Found!" });
//     try {
//         const removeRefTokenFromDb = await userSchema.updateOne({ token: req.body.token }, {token : null});
//         res.status(200).json({ message: "200 Success Logout!" })
//     } catch (err) {
//         return res.status(400).json({ message: "400 Bad Request!" });
//     }

// })

export default Router;