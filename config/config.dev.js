const path=require('path');//路径模块
module.exports={
    //database
    DB_HOST:'127.0.0.1',
    DB_PORT:3306,
    DB_USER:'root',
    DB_PASS:'123123',
    DB_NAME:'user',
    //http配置
    HTTP_PORT:8080,
    HTTP_ROOT:path.resolve(__dirname,'../static/'),//dirname为当前目录，后面为上个目录下的static
    HTTP_UPLOAD:path.resolve(__dirname,'../static/upload/')
};