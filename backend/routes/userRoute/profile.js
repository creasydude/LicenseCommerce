import express from 'express';
import userAuth from '../userAuth.js';
import adminAuth from '../adminAuth.js';
import userSchema from '../../db/userSchema.js';
import CryptoJS from 'crypto-js';
const Router = express.Router();

Router.get('/profile', userAuth, async (req, res) => {
    const findUserFromDb = await userSchema.findOne({ _id: req.user._id });
    if (!findUserFromDb) return res.status(400).json({ message: "400 Bad Request!" })
    res.status(200).json({
        _id: findUserFromDb._id,
        email: findUserFromDb.email,
    })
});

Router.get('/orders', userAuth, async (req, res) => {
    const findUserFromDb = await userSchema.findOne({ _id: req.user._id });
    if (!findUserFromDb) return res.status(400).json({ message: "400 Bad Request!" })
    if (findUserFromDb.orders.length === 0) return res.status(404).json({message : "404 No Order Found!"})
    let encryptedKeysArray = findUserFromDb.orders;
    let decryptedKeysArray = []

    for (const item of encryptedKeysArray) {
        let deKeysArray = item.orderKey.map(key => {
            let decryptKey = CryptoJS.AES.decrypt(key, process.env.CRYPTO_SEC_KEY);
            return decryptKey.toString(CryptoJS.enc.Utf8);
        })

        decryptedKeysArray.push({
            orderName: item.orderName,
            orderKey: deKeysArray
        })
    }

    res.status(200).json(decryptedKeysArray)
});

//Admin Routes
Router.get('/adminProfile', adminAuth, async (req, res) => {
    const findUserFromDb = await userSchema.findOne({ _id: req.user._id });
    if (!findUserFromDb) return res.status(400).json({ message: "400 Bad Request!" })
    res.status(200).json({
        _id: findUserFromDb._id,
        email: findUserFromDb.email,
    })
})

export default Router;