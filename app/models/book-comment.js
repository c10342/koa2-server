const { Sequelize, Model } = require('sequelize')

const { sequelize } = require('../../core/db')

class Comment extends Model {
    static async addComment(bookId, content) {
        const comment = await Comment.findOne({
            where: {
                book_id: bookId,
                content
            }
        })
        if (!comment) {
            return await Comment.create({
                book_id: bookId,
                content,
                nums: 1
            })
        } else {
            return await comment.increment('nums', { by: 1 })
        }
    }

    static async getComment() {
        const result = await Comment.findAll()
        return result
    }

    /** 
     * 对象序列化就是根据这个函数
        可以过滤掉对象某些字段
        let obj = {
            a:1,
            b:2,
            toJSON(){
                return {
                    c:4
                }
            }
        }
        console.log(obj.toJSON()) //{ c: 4 }
    */
    // toJSON() {
    //     return {
    //         // this => Model
    //         content: this.getDataValue('content'),
    //         nums: this.getDataValue('nums')
    //     }
    // }
}

Comment.init({
    // 评论内容
    content: Sequelize.STRING(12),
    // 点赞数量
    nums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    book_id: Sequelize.INTEGER
}, {
        sequelize,
        tableName: 'comment'
    })

module.exports = { Comment }