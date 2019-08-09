const process=require('process');

let mode=(process.env.OS=='Windows_NT'?'dev':'prod');

module.exports={
    mode,
    ...(mode =='dev'?require('./config.dev'):require('./config.dev'))
};