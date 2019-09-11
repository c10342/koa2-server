
const bcrypt = require('bcryptjs')

const { sequelize } = require('../../core/db')

const { Sequelize, Model } = require('sequelize')

const {AuthFailed} = require('../../core/http-exception')


class User extends Model {
    static async verifyMobilePassword(email,password){
        const user = await User.findOne({
            where:{
                email
            }
        })
        if(!user){
            throw new AuthFailed('用户不存在')
        }
        // 对比密码
        const correct = bcrypt.compareSync(password,user.password)
        if(!correct){
            throw new AuthFailed('密码错误')
        }
        return user
    }

    static async getUserByOpenid(openid){
        return await User.findOne({
            where:{
                openid
            }
        })
    }

    static async registerByopenid(openid){
        return await User.create({
            openid
        })
    }
 }

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true // 自增型
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        set(val) {
            // 生成盐值
            const salt = bcrypt.genSaltSync(10)
            // 加密密码
            const psw = bcrypt.hashSync(val, salt)

            this.setDataValue('password',psw)
        }
    },
    openid: {
        type: Sequelize.STRING(64), //长度为64位
        unique: true  //唯一的
    }
}, {
        sequelize,
        tableName: 'user'  //表名
    })

module.exports = { User }