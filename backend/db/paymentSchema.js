import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const payDataSchema = new Schema({
    payId: {
        type: String
    },
    payLink: {
        type: String
    },
    payStatus: {
        type: Number
    },
    idPayTrackId: {
        type: Number
    },
    payTrackId: {
        type: Number
    },
    payOrderId: {
        type: String
    },
    payAmount: {
        type: Number
    },
    payCn: {
        type: String
    },
    payDate: {
        type: Date
    }
})

const paymentSchema = new Schema({
    email: {
        type: String,
        maxLength: 255,
        required: true
    },
    payData: {
        type: [payDataSchema],
        required: false
    }
})

const payment = mongoose.model("payments", paymentSchema);

export default payment;