var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
   title: String,
    price: Number,
    likes: {type: Number, default: 0},
    imgUrl: {type: String, default: ""}
});

module.exports = mongoose.model('Product', product);