const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    description: {
        type: String,
    },
    discount: {
        type: Number,
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;