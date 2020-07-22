const mongoose = require('mongoose');
//1、连接数据库
const dbURL = 'mongodb://127.0.0.1:27017/user';
mongoose.connect(dbURL,{useNewUrlParser:true},err=>{
    if(err) throw err;
    console.log('数据库连接成功');
});

//创建骨架
function createSchema(type){
    return new mongoose.Schema(type);
}
//创建模型
function createModel(collecNames,schemaName){
    return mongoose.model(collecNames,schemaName);
}

//商品骨架定义
const shopSchame = createSchema({
    shopID:String,
    shopName:String,
    shopNumber:String,
    shopPrice:String,
    shopImg:String
});
//商品模型创建
const shopModel = createModel('shops',shopSchame);

module.exports = {
    shop:{
        //添加
        add(data){
            console.log('添加');
            return new Promise( async (resolve,reject)=>{

                //需要在此处对于前端传过来的数据进行唯一性验证
                const datas = await this.search();//这里获得到的结果是当集合的所有数据，将这个数据与前端传过来的数据进行对比
                const result = datas.some(item =>{
                    return item.shopID == data.shopID;
                });
                if(result){
                    reject({
                        status:0,
                        msg:'商品已存在，请不要重复添加'
                    });
                }else{
                    //模型的实例化对象进行增加操作
                    const shopEnity = new shopModel(data);
                    shopEnity.save(err=>{
                        if(err){
                            reject({
                                status:2,
                                msg:err.message
                            });
                        }else{
                            resolve({
                                status:1,
                                msg:'添加成功'
                            });
                        }
                    });
                }
            })
        },
        //删除
        del(_id){
            return new Promise((resolve,reject)=>{
                shopModel.findById(_id,(err,docs)=>{
                    docs.remove(err=>{
                        if(err) reject({
                            status:1,
                            msg:err.message
                        });
                        else resolve({
                            status:2,
                            msg:'删除成功'
                        })
                    })
                })
            })
        },
        //更新
        update(data){
            console.log('更新');
            console.log(data);
            return new Promise((resolve,reject)=>{
                shopModel.findById(data._id,(err,docs)=>{
                    if(err) reject({
                        status:1,
                        msg:err.message
                    });
                    else{
                        docs.shopName = data.shopName;
                        docs.shopNumber = data.shopNumber;
                        console.log(data.shopImg);
                        //这里会出现这种情况的原因在于一开始定义好了集合的格式，即使没有添加shopImg，结合中也是有shopImg这个属性名的，不修改，值就为[object Object]
                        if(data.shopImg != '[object Object]'){
                            docs.shopImg = data.shopImg;
                        }
                        docs.save(err=>{
                            if(err) reject({
                                status:1,
                                msg:err.message
                            });
                            else resolve({
                                status:1,
                                msg:'修改成功'
                            })
                        })
                    }
                })
            })
        },
        //查询
        search(){
            //这样书写的原因在于如果没有使用promise其他方法中无法获得查询结果，这样书写后，在需要此方法的地方直接.then执行即可，所以promise不仅是可以解决异步问题
            console.log('筛选');
            return new Promise((resolve,reject)=>{
                //第一个参数是筛选条件
                shopModel.find({},(err,docs)=>{
                    if(err) throw err;
                    resolve(docs);
                });
            });
        }
    },
    user:{
        add(){

        },
        del(){},
        update(){},
        search(){}
    }
}
