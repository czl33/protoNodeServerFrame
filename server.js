const db=require('./libs/database');//数据库配置模块
const http=require('./libs/http');//http模块
const {addRouter}=require('./libs/router');//路由模块下的添加路由


addRouter('get','/list',async (res,get,post,file)=>{
    try {
        let data=await db.query('SELECT * FROM item_table');
        res.writeJson({error:0,data});
    }catch (e) {
        res.writeJson({error:1,msg:'database error'})
    }

    res.end();

});
addRouter('post','/add',async (res,get,post,file)=>{
    let {title,price,count}=post;

    if(!title||!price||!count){
        res.writeJson({error:1,msg: '参数有误'});
    }else{
        price=Number(price);
        count=Number(count);
        if(isNaN(price)||isNaN((count))){
            res.writeJson({error:1,msg: '参数有误'});
        }else{
            //都没有问题了
           // await db.query(`INSET INTO item_table (title,price,count) VALUES (${title},${price},${count})`)//这个会被
            //注入攻击
            try {
                await db.query('INSERT INTO item_table (title,price,count) VALUES (?,?,?)', [title, price, count]);//就都当做字符串进去，不存在数据库的问题
                res.writeJson({error:0,msg: '成功'});
            }catch (e) {
                console.log(e);
                res.writeJson({error:1,msg: 'database错误'});
            }
        }
    }
    res.end()
});

// addRouter('get','/user',async (res,get,post,file)=>{
//
//
// });



// (async ()=>{
//     let data=await db.query('SELECT * FROM item_table');
//     console.log(data.title)
// })()

