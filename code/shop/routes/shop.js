const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

//磁盘存储
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/upload"));
    },
    filename: function (req, file, cb) {
    //   console.log("file", file);
      const endName = file.originalname.split(".")[1];
      const fileName = file.fieldname + "-" + Date.now() + "." + endName;
      req.fileName = fileName
      cb(null, fileName);
    }
  });
  let upload = multer({storage:storage});


  //引入数据库处理模块
  const db = require('../db/shopData');
  const { shop } = require("../db/shopData");


router.route('/shop')
//商品信息查询
.get(async (req,res,next)=>{
    res.send(await db.shop.search());

})
//商品信息更新
.put(upload.any(),async (req,res,next)=>{
    // res.send('更新成功');
    console.log(123)
    console.log(req.fileName);
    console.log(req.body);
    if(req.fileName != undefined){
        console.log('有图');
        req.body.shopImg = "http://localhost:3000/upload/" + req.fileName;
    }
    console.log('走过if分支')
    const {status,msg} = await db.shop.update(req.body);
    res.json({
        status,msg
    });
})
//商品信息添加
.post(upload.any(),async (req,res,next)=>{
    //对于存入数据库的图片路径进行改变
    req.body.shopImg = "http://localhost:3000/upload/" + req.fileName;
    //添加操作
    const {status,msg} =await db.shop.add(req.body).catch((err)=>{
        return err;
    });
    res.json({
        status,
        msg
    });
})
//商品信息删除
.delete(async (req,res,next)=>{
    const {_id} = req.body;
    const {status,msg} = await db.shop.del(_id);
    res.json({
        status,msg
    });
});

module.exports = router;