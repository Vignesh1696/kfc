const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new mongoose.Schema(
	{
		order_no: {
			type: String,
		},
		order_type: {
			type: String,
			enum: ["dine", "take"],
		},
		total:{
			type:Number
		},
		// items: [
		// 	{
		// 	  item: {
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: 'Item',
		// 		required: true
		// 	  },
		// 	  quantity: {
		// 		type: Number,
		// 		required: true
		// 	  },
		// 	  price: {
		// 		type: Number,
		// 		required: true
		// 	  }
		// 	}
		//   ],
		items:[{
			item:{
				type: Schema.Types.ObjectId,
				ref: "Item",
			},
			quantity:{
				type:String
			}
		}],
		user_id:{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		status: {
			type: String,
			enum: ['Pending', 'Shipped', 'Delivered'],
			default: 'Pending'
		},
		user_details:{
            type: Schema.Types.Mixed,
        },
        order_bill:{
            type:Schema.Types.Mixed
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

module.exports = mongoose.model("Order", orderSchema);
