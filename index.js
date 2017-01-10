/**
 * Created by BaiShuang on 2016/12/2.
 */
var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs');

var app = express();
app.use(express.static('wwwroot'))
app.use(bodyParser.urlencoded({extended:false}))

/**
 * 接口一：
 * 处理提交留言信息
 */

app.post('/content',function (req,res) {
    console.log("接受到post请求")
    console.log(req.body.content);

    var msg = {
        content:req.body.content,
        time:new Date(),
        ip:req.ip
    }
    //把接受到的留言信息存入文件当中
    //判断文件夹是否存在 如果存在ex为true 否则为false
    fs.exists('data',function (ex) {
        //如果文件夹不存在，则创建文件夹
        if (!ex){
            //make direction sync 同步的创建文件夹
            //参数为文件夹的名字
            console.log('创建文件夹')
            fs.mkdirSync('data');
        }
    })
    /**
     * writeFile 将数据保存在文件当中，如果已经存在这个文件，那么替换原文件
     * appendFile 向文件中添加数据 不会覆盖原文件（在原有的基础上添加）
     */
    // fs.writeFile('data/message.txt',req.body.content,function (error) {
    //     if (error){
    //         console.error('写入文件时错误',error);
    //     }
    // })
    fs.appendFile('data/message.txt',JSON.stringify(msg)+',',function (error) {
            if (error){
                console.error('写入文件时错误',error);
            }
    })

    res.status(200).json({msg:'收到留言数据'})

})


/**
 * 接口2 返回留言信息
 * 把message.txt文件当中的数据返回给客户端
 * 使用JSON形式
 */
app.get('/showMsg',function (req,res) {
    console.log("接受到get请求 ")

    fs.exists('data/message.txt',function (ex) {
        if (ex){
            //读取文件
            fs.readFile('data/message.txt',function (error,data) {
                if (!error && data.length != 0){
                    var result = '['+data;
                    result = result.substring(0,result.length-1);
                    result = result + ']';
                    res.json(result);
                }
                else{
                    res.json('[]');

                }

            })
        }
        else{
            res.status(200).json('[]');
        }

    })

})

app.listen('3000',function () {
    console.log('server runing at 3000')
})