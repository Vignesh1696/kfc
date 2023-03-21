const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category_image: {
    type: String,
    required: true
  },
//   subcategories: [{
//     name: {
//       type: String,
//       required: true
//     },
//     description: {
//       type: String,
//       required: true
//     },
//     image: {
//       type: String,
//       required: true
//     }
//   }]
});

module.exports = mongoose.model('Category', CategorySchema);
