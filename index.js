var express = require("express")
var path = require("path")
const { engine } = require ('express-handlebars');
const mongoose = require("mongoose");
var multer = require("multer");
const bodyParser = require("body-parser");
var app = express();


app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: false,layoutsDir: "views/layouts/"}));
app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use(
    bodyParser.json({
        limit: "50mb",
    })
);
// // for parsing application/xwww-form-urlencoded
// app.use(
//     bodyParser.urlencoded({
//         limit: "50mb",
//         extended: true,
//     })
// );
app.use(bodyParser.urlencoded({
    extended: true
}))

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
});

// for parsing multipart/form-data
app.use(upload.single("file"));


mongoose.set('strictQuery', true);
// Connect to DB
mongoose.connect("mongodb://0.0.0.0:27017/kfc-dev", {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => console.log("Mongodb connected")).catch((err) => console.log(err));
//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
const home = require('./routes/home');
const dash = require('./routes/dash');
const Razorpay = require('razorpay'); 
// const razorpayInstance = new Razorpay({
  
//     // Replace with your key_id
//     key_id: "rzp_test_mVjfIxanXColF7",
  
//     // Replace with your key_secret
//     key_secret: "tmLXfonlaggdaRhtlA0ONBJx"
// });

// app.post('/createOrder', (req, res)=>{ 
  
//     // STEP 1:
//     const {amount,currency,receipt, notes}  = req.body;      
          
//     // STEP 2:    
//     razorpayInstance.orders.create({amount, currency, receipt, notes}, 
//         (err, order)=>{
//           console.log("ccccccccccc",order)
//           //STEP 3 & 4: 
//           if(!err)
//             res.json(order)
//           else
//             res.send(err);
//         }
//     )
// });
  

app.use("/admin",dash);
app.use("/",home);

app.listen(9000,()=>{
    console.log("server connect")
})
