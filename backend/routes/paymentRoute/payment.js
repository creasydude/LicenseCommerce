import express from 'express';
import userAuth from '../userAuth.js';
import userSchema from '../../db/userSchema.js';
import productSchema from '../../db/productSchema.js';
import superagent from 'superagent';
import paymentSchema from '../../db/paymentSchema.js';
import orderIdGenerator from './orderIdGenerator.js';
import e from 'express';
const Router = express.Router();



Router.post('/idpay', userAuth, async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "You Should Login!" });
    try {
        const getCartFromDb = await userSchema.findOne({ _id: req.user._id });
        if (getCartFromDb.cart.length === 0) return res.status(404).json({ message: "404 No Items Found!" });
        let cartArray = getCartFromDb.cart;
        let priceArray = [];
        for (const item of cartArray) {
            const getProductFromDb = await productSchema.findOne({ pid: item.productId });
            priceArray.push(getProductFromDb.price * item.productQty);
        }
        const finalPrice = priceArray.reduce((a, b) => a + b);
        const getRandomOrderId = await orderIdGenerator();

        //Payment Section\\
        const getInfoFromUserSchema = await userSchema.findOne({ _id: req.user._id });
        if (!getInfoFromUserSchema) return res.status(401).json({ message: "401 Unauthorized!" })
        try {
            const saPost = await superagent
                .post(process.env.IDPAY_API_SITE)
                .set("X-API-KEY", process.env.IDPAY_API_KEY)
                .set("X-SANDBOX", process.env.IDPAY_SANDBOX)
                .send({
                    order_id: getRandomOrderId,
                    amount: finalPrice,
                    mail: getInfoFromUserSchema.email,
                    callback: req.protocol + '://' + req.get('host') + "/api/payments/callback",

                });

            if (saPost.status === 201) {
                const idAndLink = JSON.parse(saPost.text);
                const EmailExist = await paymentSchema.findOne({ email: getInfoFromUserSchema.email });

                if (!EmailExist) {
                    const newPayment = new paymentSchema({
                        email: getInfoFromUserSchema.email,
                        payData: [
                            {
                                payId: idAndLink.id,
                                payLink: idAndLink.link,
                                payOrderId: getRandomOrderId
                            }
                        ]
                    })
                    try {
                        const savePayment = await newPayment.save()
                        res.status(200).json({ idAndLink });
                    } catch (err) {
                        return res.status(400).json({ message: "400 Bad Request!" });
                    }
                } else if (EmailExist) {
                    try {
                        const paymentUpdate = await paymentSchema.updateOne({ email: EmailExist.email }, {
                            $push: {
                                payData: [
                                    {
                                        payId: idAndLink.id,
                                        payLink: idAndLink.link,
                                        payOrderId: getRandomOrderId
                                    }
                                ]
                            }

                        })
                        res.status(200).json(idAndLink);
                    } catch (err) {
                        return res.status(400).json({ message: "400 Bad Request!" })
                    }
                }

            } else {
                res.status(400).json({ message: "400 Bad Request!" })
            }
        } catch (err) {
            return res.status(err.status).json(err)
        }
        //Payment Section\\



    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
})

Router.post('/callback', async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(406).json({ message: "Not Acceptable!" })
    try {
        const payIdExist = await paymentSchema.findOne({ "payData.payId": req.body.id })
        if (!payIdExist) return res.status(400).json({ message: "Pay Id Not Found!" })
        const payIdsArray = payIdExist.payData;
        const filterPayId = payIdsArray.filter(item => item.payId == req.body.id)
        const saPostVerify = await superagent
            .post("https://api.idpay.ir/v1.1/payment/verify")
            .set("X-API-KEY", process.env.IDPAY_API_KEY)
            .set("X-SANDBOX", process.env.IDPAY_SANDBOX)
            .send({
                id: filterPayId[0].payId,
                order_id: filterPayId[0].payOrderId
            })
        if (saPostVerify.body.verify) {
            const findMailInPaymentSchema = await paymentSchema.findOne({ "payData.payId": req.body.id });
            const UserCart = await userSchema.findOne({ email: findMailInPaymentSchema.email })
            const cartArray = UserCart.cart;
            const updatePayment = await paymentSchema.updateOne({ "payData.payId": req.body.id }, {
                '$set': {
                    'payData.$.payStatus': saPostVerify.body.status,
                    'payData.$.idPayTrackId': saPostVerify.body.track_id,
                    'payData.$.payAmount': saPostVerify.body.amount,
                    'payData.$.payTrackId': saPostVerify.body.payment.track_id,
                    'payData.$.payCn': saPostVerify.body.payment.card_no,
                    'payData.$.payDate': saPostVerify.body.verify.date
                }
            })
            //Key Section\\
            const keys = async (obj) => {
                try {
                    const product = await productSchema.findOne({ pid: obj.productId });
                    const keysOfProduct = product.keys;
                    const qtyOfProduct = obj.productQty;
                    let usedKeysArr = []
                    for (let i = 0; i < qtyOfProduct; i++) {
                        usedKeysArr.push(keysOfProduct.pop())
                    }
                    const unUsedKeysArr = keysOfProduct.filter(item => {
                        return !usedKeysArr.includes(item)
                    })

                    const updateKeys = await productSchema.updateOne({ pid: obj.productId }, {
                        '$set': {
                            'keys': unUsedKeysArr
                        }
                    })
                    return usedKeysArr;
                } catch (err) {
                    console.log(err)
                }

            }
            //Key Section\\

            for (const item of cartArray) {
                const getNameOfProduct = await productSchema.findOne({ pid: item.productId });
                const addOrders = await userSchema.updateOne({ email: findMailInPaymentSchema.email }, {
                    '$push': {
                        'orders': [
                            {
                                orderName: getNameOfProduct.name,
                                orderKey: await keys(item),
                            }
                        ]
                    }
                })
            }

            const updateUserCart = await userSchema.updateOne({ email: findMailInPaymentSchema.email }, {
                '$set': {
                    'cart': []
                }
            })

        } else {
            // return res.status(400).json({ message: saPostVerify.error_message })
            return res.redirect(301, process.env.FRONTEND_REDIRECT);
        }
        return res.redirect(301, process.env.FRONTEND_REDIRECT);
    } catch (err) {
        // res.status(err.status).json({
        //     code: err.status,
        //     message: "تایید پرداخت امکان پذیر نیست"
        // });
        return res.redirect(301, process.env.FRONTEND_REDIRECT);
    }
})

Router.get('/callback', userAuth, async (req, res, next) => {
    const userData = await userSchema.findOne({ _id: req.user._id });
    const getPayment = await paymentSchema.findOne({ email: userData?.email });
    const lastPayment = getPayment?.payData?.pop();
    if (!lastPayment?.payStatus) {
        res.status(400).json({code : 400, message : "Payment Failed!"})
    } else if (lastPayment.payStatus === 100|| 101) {
        res.status(200).json({code: 200 , message : "Payment Success!"})
    } else {
        res.status(400).json({code : 400, message : "Payment Failed!"})
    }
})

// Router.get('/y', async (req, res) => {
//     try {
//         const sa = await superagent
//             .post('http://localhost:8080/api/payments/x')
//             res.json(JSON.parse(sa.text))
//     }catch(err) {
//         res.send(err)
//     }
// })


// Router.post('/t', async (req, res) => {
//     try {
//         const UserCart = await userSchema.findOne({ email: "mohammadicecream@yahoo.com" })
//         const cartArray = UserCart.cart;

//         const keys = async (obj) => {
//             try {
//                 const product = await productSchema.findOne({ pid: obj.productId });
//                 const keysOfProduct = product.keys;
//                 const qtyOfProduct = obj.productQty;
//                 let usedKeysArr = []
//                 for (let i = 0; i < qtyOfProduct; i++) {
//                     usedKeysArr.push(keysOfProduct.pop())
//                 }
//                 const unUsedKeysArr = keysOfProduct.filter(item => {
//                     return !usedKeysArr.includes(item)
//                 })

//                 const updateKeys = await productSchema.updateOne({ pid: obj.productId }, {
//                     '$set': {
//                         'keys': unUsedKeysArr
//                     }
//                 })
//                 return usedKeysArr;
//             } catch (err) {
//                 console.log(err)
//             }

//         }

//         for (const item of cartArray) {
//             const getNameOfProduct = await productSchema.findOne({ pid: item.productId });

//             const addOrders = await userSchema.updateOne({ email: "mohammadicecream@yahoo.com" }, {
//                 '$push': {
//                     'orders': [
//                         {
//                             orderName: getNameOfProduct.name,
//                             orderKey: await keys(item)
//                         }
//                     ]
//                 }
//             })
//         }

//         // res.json(await keys(cartArray[0]))
//         res.json({ message: "SUCCESS!" })
//     } catch (err) {
//         res.send(err)
//     }
// })

// Router.post('/testp', async (req, res) => {


//     try {
//         const saPost = await superagent
//             .post(process.env.IDPAY_API_SITE)
//             .set("X-API-KEY", process.env.IDPAY_API_KEY)
//             .set("X-SANDBOX", process.env.IDPAY_SANDBOX)
//             .send({
//                 order_id: req.body.order_id,
//                 amount: req.body.amount,
//                 mail: req.body.email,
//                 callback: req.protocol + '://' + req.get('host') + "/api/payments/callback",

//             });

//         if (saPost.status === 201) {
//             const idAndLink = JSON.parse(saPost.text);
//             const EmailExist = await paymentSchema.findOne({ email: "mohammadicecream@yahoo.com" });

//             if (!EmailExist) {
//                 const newPayment = new paymentSchema({
//                     email: "mohammadicecream@yahoo.com",
//                     payData: [
//                         {
//                             payId: idAndLink.id,
//                             payLink: idAndLink.link
//                         }
//                     ]
//                 })
//                 try {
//                     const savePayment = await newPayment.save()
//                     res.status(200).json({ idAndLink });
//                 } catch (err) {
//                     return res.status(400).json({ message: "400 Bad Request!" });
//                 }
//             } else if (EmailExist) {
//                 try {
//                     const paymentUpdate = await paymentSchema.updateOne({ email: EmailExist.email }, {
//                         $push: {
//                             payData: [
//                                 {
//                                     payId: idAndLink.id,
//                                     payLink: idAndLink.link
//                                 }
//                             ]
//                         }

//                     })
//                     res.status(200).json(idAndLink);
//                 } catch (err) {
//                     return res.status(400).json({ message: "400 Bad Request!" })
//                 }
//             }

//         }
//     } catch (err) {
//         return res.status(400).json({ message: err.message })
//     }

// })


export default Router;