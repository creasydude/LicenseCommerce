import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderName : {
        type: String,
        default: null
    },
    orderKey: {
        type: Array,
        default: []
    },
});

const cartSchema = new Schema({
    productId : {
        type: Number,
        default: null
    },
    productQty: {
        type: Number,
        default: null
    }
});

const userSchema = new Schema({
    email: {
        type: String,
        maxLength: 255,
        required: true
    },
    orders: {
        type: [orderSchema],
        required: false
    },
    cart: {
        type: [cartSchema],
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: null
    }
});

const user = mongoose.model("users", userSchema);
export default user;