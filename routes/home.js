const express = require('express');
var LocalStorage = require('node-localstorage').LocalStorage
var itemModel = require("../models/item.model");
var categoryModal = require("../models/category.model");
var orderModel = require("../models/order.model");
var User = require("../models/user.modal");
var Cart = require("../models/cart.model")
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { remove } = require('../models/cart.model');
var LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch');
var dealModel = require("../models/deals.model");
const { json } = require('body-parser');

localStorage = new LocalStorage('./scratch');


const router = express.Router();
var arr = [];
var complet = [];

router.get('/start', (req, res, next) => {
  // setTimeout(() => {
  //     complet = [];
  // },10000)
  res.render('main', {
    orders: arr,
    over: complet
  });
});

router.get('/order-complete', (req, res, next) => {
  for (let data of arr) {
    complet.push(data);
    break;
  }
  arr.shift();
  console.log("ooooooo", complet)
  res.render('orderOut');
});

router.get('/', async (req, res) => {
  var getCat = await categoryModal.find({}).lean();
  res.render("orderIn", { "Cat": getCat })
})

router.get('/login', async (req, res) => {
  res.render("login")
})

router.get('/signup', async (req, res) => {
  res.render("signup")
})



router.post('/reg-in', async (req, res) => {

  var newUser = req.body
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  var user = User.create(newUser)
  if (user) {
    res.render("login")
  } else {
    res.render("signup")
  }
})


router.post('/log-in', async (req, res) => {
  User.findOne({
    email: req.body.email
  }, async function (err, user) {
    if (err) throw err;
    if (!user || !user.comparePassword(req.body.password)) {
      return res.render("baduser")
    } else {
      var token = jwt.sign({ email: user.email, fullName: user.username, _id: user._id }, 'RESTFULAPIs',{
        expiresIn: 60
    })
      var getCat = await categoryModal.find({}).lean();
      res.render("orderIn", { "Cat": getCat, "access_token": token, "fullName": user.username })
    }
  });
})

router.get('/logout', async (req, res) => {
  var getCat = await categoryModal.find({}).lean();
  res.render("orderIn", { "Cat": getCat, "access_token": false })
})

router.post('/cart', async (req, res) => {
  if (req.body.token) {
    let user = await checkUser(req.body.token)
    if (user) {
      let findExitUser = await Cart.findOne({ 'user_id': user._id });
      if (findExitUser) {
        findExitUser.items.push({ "item": req.body.product_id, "quantity": req.body.quantity });
        findExitUser.save();
        res.status(201).json(findExitUser);
      } else {
        req.body.items = [];
        req.body.user_id = user._id;
        req.body.items.push({ "item": req.body.product_id, "quantity": req.body.quantity });
        try {
          const cart = await Cart.create(req.body);
          res.status(201).json(cart);
        } catch (err) {
          res.status(400).json({ message: err.message });
        }
      }
    } else {
      res.status(400).json({ message: err.message });
    }

  } else {
    res.status(400).json({ message: err.message });
  }
});

router.put('/cart-remove-item', async (req, res) => {
  try {
    if (req.body.token) {
      let user = await checkUser(req.body.token)
      if (user) {
        let cart = await Cart.findOne({ 'user_id': user._id });
        const objWithIdIndex = cart.items.findIndex((obj) => obj.item == req.body.id);
        console.log("objWithIdIndex", objWithIdIndex)
        cart.items.splice(objWithIdIndex, 1);
        cart.save()
        res.status(200).json(cart);
      } else {
        res.status(400).json({ message: err.message });
      }
    } else {
      res.status(400).json({ message: err.message });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

let checkUser = (token) => {
  try {
    const decoded = jwt.verify(token, 'RESTFULAPIs');
    console.log(decoded);
    return decoded

  } catch (err) {
    console.error(err);
  }
}

router.get('/user-cart', async (req, res) => {
  try {
    const userCart = await Cart.find({ user: req.query.user }).populate([{
      path: 'user_id',
      model: 'User'
    }, {
      path: 'item_id',
      model: 'Item'
    }]);
    res.render("cart", userCart);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

router.get('/cart/:id', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate([{
      path: 'user_id',
      model: 'User'
    }, {
      path: 'item_id',
      model: 'Item'
    }]);
    res.render("cart", cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

router.put('/cart/:id', async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

router.get('/view-cart', async (req, res) => {
  if (req.query.user) {
    let user = await checkUser(req.query.user)
    if (user) {
      const cart = await Cart.findOne({ 'user_id': user._id }).lean().populate([{
        path: 'user_id',
        model: 'User'
      }, {
        path: 'items.item',
        model: 'Item'
      }]);
      var tot = 0;
      var sub = 0;
      if (cart) {
        for (let data of cart.items) {
          if (data.item.item_rate) {
            tot += data.item.item_rate * data.quantity
          }

        }
        if (cart.items.length == 0) {
          res.render('cart', { "cart": cart, "count": false, "total": tot });
        } else {
          sub += tot + 70;
          res.render('cart', { "cart": cart, "count": cart.items.length, "total": tot, "sub": sub });
        }
      } else {
        res.render('cart');
      }
    } else {
      res.render('login');
    }
  } else {
    res.render('login');
  }

})

router.put('/cart-quantity-update', async (req, res) => {
  try {
    if (req.body.token) {
      let user = await checkUser(req.body.token)
      if (user) {
        let cart = await Cart.findOne({ 'user_id': user._id });
        if (cart) {
          for (let data of cart.items) {
            if (data.item == req.body.item) {
              data.quantity = req.body.quantity
            }
          }
          cart.save();
          res.status(200).send(cart)
        } else {
          res.render('cart');
        }
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
})

router.get('/view-item', async (req, res) => {
  try {
    if (req.query.item) {
      let item = await itemModel.find({ "category": req.query.item }).lean();
      let cat = await categoryModal.find({}).lean();
      if (item) {
        res.render('menu', { "item": item, "cat": cat, "count": item.length })
      } else {
        res.render('menu')
      }
    } else if (req.query.itemName) {
      var obj = {}
      obj["item_name"] = {
        $regex: new RegExp(`.*${req.query.itemName}`, "i"),

      }

      let item = await itemModel.find(obj).lean();
      let cat = await categoryModal.find({}).lean();
      if (item) {
        res.render('menu', { "item": item, "cat": cat, "count": item.length })
      } else {
        res.render('menu')
      }
    } else {
      let item = await itemModel.find({}).lean();
      let cat = await categoryModal.find({}).lean();
      if (item) {
        res.render('menu', { "item": item, "cat": cat, "count": item.length })
      } else {
        res.render('menu')
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
})

router.get('/deal', async (req, res) => {
  try {
    var deals = await dealModel.find({}).lean();
    res.render('deals', { "deal": deals })
  } catch (err) {
    res.status(500).send(err.message);
  }

})


router.get('/checkout',async (req,res) => {
  try{
    console.log("xxxxxxxx",req.query)
    if(req.query.user){
      let user = await checkUser(req.query.user)
      let findUser = await User.findOne({ '_id': user._id }).lean();
      let findCart = await Cart.findOne({"user_id":user._id}).lean();
      console.log(findUser)
      res.render("checkout",{"user": JSON.stringify(findUser),"cart":JSON.stringify(findCart)})
    }else{
      res.render("login")
    }
   
  }catch(err){
    res.status(500).send(err.message);
  }
})

router.get('/order',async (req,res) => {
  res.render('order')
})

router.post('/create-order',async(req,res) => {
  try{
    var createOrder = await orderModel.create(req.body);
    res.status(201).send(createOrder);
  }catch(err){
    res.status(500).send(err.message);
  }
})




module.exports = router;