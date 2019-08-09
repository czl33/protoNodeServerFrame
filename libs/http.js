const http=require('http');
const url=require('url');//分解get请求
const querystring=require('querystring');//拆分post请求  //引入一个新的模块，能够将 &&&  这种客户发来的url进行解析为对象
const zlip=require('zlib');//压缩
const fs=require('fs');//文件
const {Form}=require('multiparty');//处理formdata
const {HTTP_PORT,HTTP_ROOT,HTTP_UPLOAD}=require('../config');//http配置
const router=require('./router')


http.createServer(((req, res) => {
        res.writeJson=function (json) {
        res.setHeader('content-type','application/json');
        res.write(JSON.stringify(json));
    }
    //1.解析数据--GET.POST,file
    let {pathname,query}=url.parse(req.url,true);
        //console.log(req.url,pathname,query);

    if(req.method=='POST'){
        //1.有2种格式  一种普通头，一种fromdata
        if(req.headers['content-type'].startsWith('application/x-www-form-urlencoded')){
            //普通post
            let arr=[];
            req.on('data',buffer=>{
                arr.push(buffer)
            });
            req.on('end',()=>{
                let post =querystring.parse(Buffer.concat(arr).toString());//post数据
                //2.找路由
                handle(req.method,pathname,query,post,{})
            });

        }else{
            //文件post
            let form=new Form({
                uploadDir:HTTP_UPLOAD
            });
            form.parse(req);//解析

            let post={};//数据对象
            let files={};//文件对象

            form.on('field',(name,value)=>{
                post[name]=value
            });
            form.on('file',(name,file)=>{
                files[name]=file
            });
            form.on('error',err=>{
                console.log(err)
            });
            form.on('close',()=>{
                handle(req.method,pathname,query,post,files)
            })

        }

    }else if(pathname=='/'){
        //无参数
        res.writeJson({error:1,msg: 'api请求错误'});
        res.end()
    }
    else{
        //2.找路由
        handle(req.method,pathname,query,{},{})
    }

async function handle(method,url,get,post,file) {//数据准备好就执行这一个
    //console.log(method,url,get,post,file,HTTP_ROOT+url);
    let fn=router.findRouter(method,url);//找路由
    if(!fn){//没有的话，应该就是文件请求
        let filepath=HTTP_ROOT+url;
        fs.stat(filepath,(err, stats) => {//检测文件状态
            if(err){
                //不存在
                res.writeHead(404);
                res.write('no found');
                res.end();//结束
            }else{
               //存在
                let rs=fs.createReadStream(filepath);
                let gz=zlip.createGzip();//创建一个压缩文件

                rs.on('error',()=>{});//可能在输出流的过程中文件被删除的错误

                res.setHeader('content-encoding','gzip');
                rs.pipe(gz).pipe(res);

            }
        });
    }else{//接口请求

        try{
            await fn(res,get,post,file);//执行api的方法
        }catch (e) {
            console.log(e);
            res.writeHead(500);
            res.write('Internal Server Error');
            res.end();
        }

    }

}


})).listen(HTTP_PORT);

console.log(`服务器已经运行，运行在${HTTP_PORT}端口`)





