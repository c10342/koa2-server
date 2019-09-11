
function isThisType(val){
    for (const key in this) {
        if(this[key] === val){
            return true
        }
    }
    return false
}

// 登录方式,模拟枚举类型
const LoginType = {
    USER_MINI_PROGRAM:100, //小程序登录
    USER_EMAIL:101,
    USER_MOBILE:100,
    ADMIN_EMAIL:200,
    isThisType
}

module.exports = {
    LoginType
}