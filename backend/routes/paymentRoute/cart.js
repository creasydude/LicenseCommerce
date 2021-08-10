import express from 'express';
import userAuth from '../userAuth.js';
import userSchema from '../../db/userSchema.js';
const Router = express.Router();

Router.get('/showCartItems', userAuth, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "You Should Login!" })
    try {
        const getCartFromDb = await userSchema.findOne({ _id: req.user._id })
        if (getCartFromDb.cart.length === 0) return res.status(404).json({message : "404 No Items Found!"})
        res.status(200).json(getCartFromDb.cart)
    } catch (err) {
        return res.status(400).json({ message: "400 Bad Request!" })
    }
})



Router.post('/addToCart', userAuth, async (req, res) => {
    //Body : productId , productQty
    try {
        if (!req.user) return res.status(401).json({ message: "You Should Login!" })
        if ((req.body.productId || req.body.productQty) === undefined) return res.status(400).json({ message: "You Should Send Info!" })
        const addToCart = await userSchema.updateOne({ _id: req.user._id }, { $push: { cart: [{ productId: req.body.productId, productQty: req.body.productQty }] } })
        res.status(201).json({ message: "201 Added To Cart!" })
    } catch (err) {
        return res.status(400).json({ message: "400 Bad Request!" })
    }
})

Router.put('/updateQty', userAuth, async (req, res) => {
    //Body : _id (its id of cart object) , productQty
    try {
        if (!req.user) return res.status(401).json({ message: "You Should Login!" })
        // const removeItemFromDb = await userSchema.findOneAndUpdate({ _id: req.user._id }, { $pull: { cart: { _id: req.body._id } } })
        // const updateItemInDb = await userSchema.findOneAndUpdate({ _id: req.user._id }, { $push: { cart: [{ productId: req.body.productId, productQty: req.body.productQty }] } })
        const updateItemInDb = await userSchema.updateOne({ "cart._id": req.body._id }, {'$set': {'cart.$.productQty': req.body.productQty}})
        res.status(201).json({ message: "201 Qty Updated!" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

Router.delete('/deleteFromCart', userAuth, async (req, res) => {
    //Body : _id (its id of cart object)
    try {
        if (!req.user) return res.status(401).json({ message: "You Should Login!" })
        const removeItemFromDb = await userSchema.findOneAndUpdate({ _id: req.user._id }, { $pull: { cart: { _id: req.body._id } } })
        res.status(201).json({ message: "Item Removed!" })
    } catch (err) {
        res.status(400).json({ message: "400 Bad Request!" })
    }
})


export default Router;
