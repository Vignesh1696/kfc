const mongoose = require("mongoose");

const { Schema } = mongoose;

const itemSchema = new mongoose.Schema(
	{
		item_name: {
			type: String,
		},
		item_image: {
			type: String,
		},
		item_rate: {
			type: Number,
		},
		item_Quantaty:{
            type: Number,
        },
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		deleted: {
			type: Boolean,
			default: false,
		},
		status: {
			type: String,
		}
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "last_updated_at",
		},
	}
);

module.exports = mongoose.model("Item", itemSchema);
