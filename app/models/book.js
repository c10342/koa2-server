const { Sequelize, Model } = require('sequelize')

const axios = require('axios')

const util = require('util')

const { sequelize } = require('../../core/db')

const { Favor } = require('./favor')


class Book extends Model {
    // 自定义模型中不要使用构造函数
    // constructor(id) {
    //     super()
    //     this.id = id
    // }

    async detail(id) {
        const url = util.format(global.config.yushu.detailUrl, id)
        const result = await axios.get(url)
        return result
    }

    static async searchFromYuShu(q, start, count, summary = 1) {
        const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
        const result = await axios.get(url)
        return result.data
    }

    static async getMyFavorBookCount(uid) {
        // Favor.count 内置函数，返回一个数量
        const result = await Favor.count({
            where: {
                uid,
                type: 400
            }
        })
        return result
    }

    static async getBookFavor(uid, bookID) {
        const favorNums = await Favor.count({
            where: {
                art_id: bookID,
                type: 400
            }
        })
        const myFavor = await Favor.findOne({
            where: {
                uid,
                art_id: bookID,
                type: 400
            }
        })
        return {
            fav_nums:favorNums,
            like_status:myFavor?1:0
        }
    }
}

Book.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fav_nums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, {
        sequelize,
        tableName: 'book'
    })


module.exports = {
    Book
}