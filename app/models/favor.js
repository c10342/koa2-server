const { Sequelize, Model,Op } = require('sequelize')

const { sequelize } = require('../../core/db')

const { LikeError,DislikeError,NotFound } = require('../../core/http-exception')


const { Art } = require('./art')

class Favor extends Model {
    static async like(art_id, type, uid) {
        const favor = await Favor.findOne({
            where: { art_id, type, uid }
        })
        if (favor) {
            throw new LikeError()
        }

        // 开启事务
        return sequelize.transaction(async t => {
            await Favor.create({ art_id, type, uid }, { transaction: t })
            const art = await Art.getData(art_id, type)
            // fav_nums字段加一
            await art.increment('fav_nums', { by: 1, transaction: t })
        })
    }

    static async disLike(art_id, type, uid) {
        const favor = await Favor.findOne({
            where: { art_id, type, uid }
        })
        if (!favor) {
            throw new DislikeError()
        }

        // 开启事务
        return sequelize.transaction(async t => {
            // 删除记录
            await favor.destroy({
                // force:true硬删除，直接删除记录
                // force:fasle软删除，不直接删除，记录还在，但查不出来
                force:true,
                transaction:t
            })
            const art = await Art.getData(art_id, type)
            // fav_nums字段减一
            await art.decrement('fav_nums', { by: 1, transaction: t })
        })
    }

    static async getMyClassicFavors(uid){
        const arts = await Favor.findAll({
            where:{
                uid,
                // type!=400
                type:{
                    [Op.not]:400
                }
            }
        })
        if(!arts){
            throw new NotFound()
        }
        return await Art.getList(arts)
    }
}

Favor.init({
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}, {
        sequelize,
        tableName: 'favor'
    })

module.exports = { Favor }