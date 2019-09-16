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

    module.exports = {Comment}