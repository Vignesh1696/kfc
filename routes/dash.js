const express = require('express');
// const async = require('async');

var itemModel = require("../models/item.model");
var orderModel = require("../models/order.model");
var categoryModel = require("../models/category.model");
var dealModel = require("../models/deals.model");
const upload = require("../service/upload");


const router = express.Router();

router.get('/dash', (req, res, next) => {
  res.render('header');
});

router.post('/create-category',async (req,res) => {
  try{
      req.body["category_image"] = 'http://localhost:9000/images/' + req.file.filename;
      var create_category = await categoryModel.create(req.body);
      if(create_category){
          res.send(create_category);
      }
  }catch(err){
      res.send(err);
  }
})

router.get('/get-category',async (req,res) => {
  try{
      var getCategories = await categoryModel.find({});
      res.send(getCategories)
  }catch(err){
    res.send(err);
  } 
})

router.post('/create-deals',async (req,res) => {
  try{
      req.body["image"] = 'http://localhost:9000/images/' + req.file.filename;
      var deal = await dealModel.create(req.body);
      if(deal){
          res.send(deal);
      }
  }catch(err){
      res.send(err);
  }
})

router.get('/get-deals',async (req,res) => {
  try{
      var deals = await dealModel.find({});
      res.send(deals)
  }catch(err){
    res.send(err);
  } 
})

router.post('/create-item',async (req,res) => {
    try{
        req.body["item_image"] = 'http://localhost:9000/images/' + req.file.filename;
        var create_item = await itemModel.create(req.body);
        if(create_item){
            res.send(create_item);
        }
    }catch(err){
        res.send(err);
    }
})

router.get('/get-item',async (req,res) => {
  try{
      var getItem = await itemModel.find({});
      res.send(getItem)
  }catch(err){
    res.send(err);
  }
})



module.exports = router;