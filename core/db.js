const Sequelize = require('sequelize')

const {user,password,host,port,dialect,dbName} = require('../config/config').database

const sequelize = new Sequelize(dbName,user,password,{
    dialect, //连接的数据库类型
    host,
    port,
    logging:false,  //把完整的sql语句输出到控制台
    timezone:'+08:00', //北京时间
    define:{
        // timestamps:true  所有表都会自动加上createAt和updateAt这2个字段
        timestamps:true,
        // timestamps:true并且paranoid:true  所有表将会添加deleteAt这个字段
        paranoid:true,
        // createAt:'create_at',  // createAt字段名改成create_at
        underscored:true //转换列名的驼峰命名规则为下划线命令规则
    }
})

sequelize.sync({
    // force:true,当已经存在数据表的时候，允许动态添加字段,并清空表数据
    force:false,
})

module.exports = {sequelize}