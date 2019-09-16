const { Sequelize, Model, Op } = require('sequelize')

const { sequelize } = require('../../core/db')

const { Favor } = require('./favor')

class HotBook extends Model {
    static async getAll() {
        const books = await HotBook.findAll({
            // 排序，默认倒序
            order: [
                'index'
            ]
        })
        let ids = []
        books.forEach(book => {
            ids.push(book.id)
        })
        const favors = await Favor.findAll({
            where: {
                art_id: {
                    [Op.in]: ids
                },
                type:400
            },
            // 根据art_id进行分组查询
            group: ['art_id'],
            // attributes是最终查询出来的结果
            // [{art_id:1,count:10},{art_id:2,count:11}]
            attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']]
        })
        books.forEach(book=>{
            HotBook._getEachBookStatus(book,favors)
        })
        return books
    }

    static _getEachBookStatus(book,favors){
        let count = 0
        favors.forEach(favor=>{
            if(favor.art_id == book.id){
                // get：不是数据库中的字段需要用get获取
                count = favor.get('count')
            }
        })
        book.setDataValue('count',count)
    }
}

HotBook.init({
    index: Sequelize.INTEGER,
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.STRING,

}, {
        sequelize,
        tableName: 'hotbook'
    })
module.exports = {
    HotBook
}