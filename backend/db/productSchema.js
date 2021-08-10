import mongoose from 'mongoose';
import AutoIncrement from 'mongoose-sequence';


const Schema = mongoose.Schema;

const productSchema = new Schema({
    pid: {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String
    },
    keys: {
        type: Array,
        default: null
    }
})

productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.plugin(AutoIncrement(mongoose), {inc_field: 'pid' });
const product = mongoose.model("product", productSchema);
export default product;