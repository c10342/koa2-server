const jwt = require("jsonwebtoken")
const config = require("../config/config")
/***
 *
 */
const findMembers = function (instance, { prefix, specifiedType, filter }) {
  // 递归函数
  function _find(instance) {
    //基线条件（跳出递归）
    if (instance.__proto__ === null) return []

    let names = Reflect.ownKeys(instance)
    names = names.filter(name => {
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name)
    })

    return [...names, ..._find(instance.__proto__)]
  }

  function _shouldKeep(value) {
    if (filter) {
      if (filter(value)) {
        return true
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true
    if (specifiedType) if (instance[value] instanceof specifiedType) return true
  }

  return _find(instance)
}


const generateToken = function (uid, scope) {
  const secretKey = global.config.security.secretKey
  const expiresIn = global.config.security.expiresIn
  // 生成token
  // 第一个参数是在token中携带的信息
  // 第二个参数是用于生成token的key
  // 第三个参数是配置项
  const token = jwt.sign({
    uid,
    scope
  }, secretKey, { expiresIn })
  return token
}

module.exports = {
  findMembers,
  generateToken
}