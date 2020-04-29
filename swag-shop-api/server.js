var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb+srv://admin:admin@mycluster-hbggp.mongodb.net/test?retryWrites=true&w=majority', { dbName:'swag-shop', useNewUrlParser: true, useUnifiedTopology: true });


var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/product', function(request, response) {
    
    var products = Product.find().exec(function(err, product) {
        if (err) {
            response.status(500).send({error:"Could not find products"});
        } else {
            response.send(product);
        }
    });
});

app.post('/product', function(request, response) {
    var product = new Product(request.body);
    product.save(function(err, savedProduct) {
        if (err) {
            response.status(500).send({error:"Could not save product"});
        } else {
            response.send(savedProduct);
        }
    });
});

app.get('/wishlist', function(request, response) {
    WishList.find({}).populate({path:'products',model:'Product'}).exec(function(err, wishLists) {
        if (err) {
            response.status(500).send({error: "Could not fetch wishlist"});
        } else {
            response.send(wishLists);
        }
    });
});

app.post('/wishlist', function(request, response) {
    var wishList = new WishList(request.body);
    
    wishList.save(function(err, newWishList) {
        if (err) {
            response.status(500).send({error: "Could not create wishlist"});
        } else {
            response.send(newWishList);
        }
    })
});

app.put('/wishlist/product/add', function(request, response) {
    Product.findOne({_id: request.body.productId}, function(err, product) {
        if (err) {
            response.status(500).send({error: "Could not add item to wishlist"});
        } else {
            WishList.update({_id:request.body.wishListId}, {$addToSet: {products: product._id}}, function (err, wishList) {
                if (err) {
                    response.status(500).send({error: "Could not add item to wishlist"});
                } else {
                    response.send("Successfully added the product to wishlist");
                }
            });
        }
    });
});

app.listen(3000, function() {
    console.log("Swag Shop API running on port 3000...");
});