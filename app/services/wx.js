const util = require('util')
const axios = require('axios')
const {AuthFailed} = require('../../core/http-exception')
const {User} = require('../models/user')
const {generateToken} = require('../../core/util')
const {Auth} = require('../../middlewares/auth')
class WXManager{
    static async codeToToken(code){
        // 将url中的%s替换掉
        const url = util.format(global.config.wx.loginUrl,global.config.wx.appId,global.config.wx.appSecret,code)

        const result = await axios.get(url)
        if(result.status !== 200){
            throw new AuthFailed('openid获取失败')
        }
        const errorCode = result.data.errcode
        const errMsg = result.data.errmsg
        if(errorCode && errorCode !== 0){
            throw new AuthFailed('openid获取失败:'+errMsg)
        }
        const openid = result.data.openid
        let user = await User.getUserByOpenid(openid)
        if(!user){
            user = await User.registerByopenid(openid)
        }
        return generateToken(user.id,Auth.USER)
    }
}

module.exports = {WXManager}