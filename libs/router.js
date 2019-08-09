//路由表
let router={};

function addRouter(method,url,fn) {//方法名,地址,执行的函数
    method=method.toLowerCase();//忽略大小写
    url=url.toLowerCase();
    router[method]=router[method]||{};
    router[method][url]=fn
}


function findRouter(method,url) {//寻找路由
    method=method.toLowerCase();//忽略大小写
    url=url.toLowerCase();//忽略大小写
    if(!router[method]||!router[method][url]){
        return null
    }else{
        return router[method][url]
    }
}

module.exports={
    addRouter,findRouter
};