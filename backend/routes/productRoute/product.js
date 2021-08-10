import express from 'express';
import productSchema from '../../db/productSchema.js';
import CryptoJS from 'crypto-js';
import adminAuth from '../adminAuth.js';
import multer from 'multer';

const Router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.MAX_UPLOAD_SIZE,
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|gif|JPG|PNG|JPEG|GIF)$/)) return cb(new Error('Invalid File Format!'));
        cb(undefined, true);
    }
}).single('image');

Router.get('/', async (req, res) => {
    const showProducts = await productSchema.find();
    if (showProducts.length === 0) return res.status(404).json({ message: "404 No Products Found!" })
    const products = showProducts.map(products => {
        let Obj = {
            _id: products._id,
            pid: products.pid,
            name: products.name,
            description: products.description,
            price: products.price,
            category: products.category,
            imageUrl: products.imageUrl
        };
        return Obj;
    })
    res.status(200).json(products);
})

Router.get('/id/:id', async (req, res) => {
    //Params : id
    const showProducts = await productSchema.findOne({ pid: req.params.id });
    if (!showProducts) return res.status(404).json({ message: "404 Not Found!" })
    res.status(200).json({
        pid: showProducts.pid,
        name: showProducts.name,
        description: showProducts.description,
        price: showProducts.price,
        category: showProducts.category,
        imageUrl: showProducts.imageUrl
    });
})

Router.post('/search', async (req, res) => {
    try {
        const searchDb = await productSchema.find({ $text: { $search: req.body.search } });
        const search = searchDb.map(search => {
            let Obj = {
                _id: search._id,
                pid: search.pid,
                name: search.name,
                description: search.description,
                price: search.price,
                category: search.category,
                imageUrl: search.imageUrl
            };
            return Obj;
        })
        res.status(200).json(search);
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
})

//Admin Panel Routes
Router.post('/addProduct', adminAuth, upload, async (req, res, next) => {
    //Body : name , description , category[array] , price
    if (!req.file) return res.status(400).json({ message: "Bad Request! No Image Sent!" });
    if (!(req.body.name && req.body.description && req.body.category && req.body.price)) return res.status(400).json({ message: "Bad Request! No Info Sent!" });
    const picUrl = req.protocol + '://' + req.get('host') + '/public/images/' + req.file.filename;
    const addProduct = new productSchema({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        imageUrl: picUrl
    })

    try {
        const saveProduct = await addProduct.save();
        return res.status(201).json({ message: "201 Saved!" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }

})


Router.delete('/removeProduct', adminAuth, async (req, res) => {
    //Body : pid
    const getProductId = await productSchema.findOne({ pid: req.body.pid });
    if (!getProductId) return res.status(400).json({ message: "400 No Product Found!" })
    try {
        const removeProduct = await productSchema.deleteOne({ pid: req.body.pid });
        res.status(200).json({ message: "200 Successful Delete!" })
    } catch (err) {
        return res.status(400).json({ message: "400 Bad Request!" })
    }

})

Router.put('/updateProduct', adminAuth, upload, async (req, res) => {
    //Body : pid , name , description , category[array] , price
    const getProductId = await productSchema.findOne({ pid: req.body.pid });
    if (!getProductId) return res.status(400).json({ message: "400 No Product Found!" })
    if (!(req.body.name && req.body.description && req.body.category && req.body.price)) return res.status(400).json({ message: "400 No Info Found!" })
    if (req.file) {
        const picUrl = req.protocol + '://' + req.get('host') + '/public/images/' + req.file.filename;
        try {
            const updateProduct = await productSchema.updateOne({ pid: req.body.pid }, {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                imageUrl: picUrl
            })
            return res.status(200).json({ message: "200 Update Successful!" })
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } else if (!req.file) {
        try {
            const updateProduct = await productSchema.updateOne({ pid: req.body.pid }, {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price
            })
            return res.status(200).json({ message: "200 Update Successful!" })
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } else {
        return res.status(400).json({ message: "400 Bad Request!" })
    }

})

Router.get('/viewKeysOfProduct/:id', async (req, res) => {
    //Params : id
    const getProductId = await productSchema.findOne({ pid: req.params.id });
    if (!getProductId) return res.status(404).json({ message: "404 No Products Found!" });
    //For Decryption
    let keysArray = getProductId.keys;
    let decryptedKeysArray = keysArray.map(key => {
        let decryptKey = CryptoJS.AES.decrypt(key, process.env.CRYPTO_SEC_KEY);
        return decryptKey.toString(CryptoJS.enc.Utf8);
    })
    res.status(200).json({
        pid: getProductId.pid,
        name: getProductId.name,
        encryptedKeys: getProductId.keys,
        decryptedKeys: decryptedKeysArray
    })
})

Router.post('/addKeyToProduct', async (req, res) => {
    //Body : pid , keys[array]
    const getProductId = await productSchema.findOne({ pid: req.body.pid });
    if (!getProductId) return res.status(400).json({ message: "400 No Product Found!" })
    //For Encryption
    let keysArray = req.body.keys;
    let encryptedKeysArray = keysArray.map(key => {
        return CryptoJS.AES.encrypt(key, process.env.CRYPTO_SEC_KEY).toString();
    })

    try {
        const addKeyToProduct = await productSchema.updateOne({ pid: req.body.pid }, { $addToSet: { keys: encryptedKeysArray } })
        res.status(201).json({ message: "201 Keys Added!" })
    } catch (err) {
        return res.status(400).json({ message: "400 Bad Request!" })
    }
});

Router.delete('/removeKeyFromProduct', async (req, res) => {
    //Body : pid , key
    const getProductId = await productSchema.findOne({ pid: req.body.pid });
    if (!getProductId) return res.status(400).json({ message: "400 No Product Found!" });

    try {
        const removeKeyFromProduct = await productSchema.updateOne({ pid: req.body.pid }, { $pull: { key: req.body.key } })
        res.status(201).json({ message: "201 Key Removed!" })
    } catch (err) {
        return res.status(400).json({ message: "400 Bad Request!" })
    }



});

export default Router;
