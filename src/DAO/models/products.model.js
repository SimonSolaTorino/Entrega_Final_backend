import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const products_collection = 'products'

const product_Schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: Array}
})

product_Schema.plugin(mongoosePaginate)

const product_model = mongoose.model(products_collection, product_Schema)

export default product_model