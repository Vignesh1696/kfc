const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'Item', 
             required: true
        },
        quantity: { type: Number }
    }],
    // quantity: { type: Number, required: true },
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart; 