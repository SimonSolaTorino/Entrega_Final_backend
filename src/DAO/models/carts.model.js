import mongoose, { Schema } from "mongoose";

const cart_collection = 'carts'

const cart_Schema = new mongoose.Schema({
    products: [
        {
            _id: false,
            quantity: {type: Number, default: 1},
            product: {type: Schema.Types.ObjectId, ref: "products"}
        }
    ]
})

const cart_model = mongoose.model(cart_collection, cart_Schema)

export default cart_model