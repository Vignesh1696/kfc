 const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

exports.createStorage = ()=>{
    storage = new GridFsStorage({
      url:"mongodb://0.0.0.0:27017/kfc-dev",
      // db:conn.connection.db,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads'
            };
            resolve(fileInfo);
          });
        });
      }
    });
    exports.upload = multer({storage})
  }
