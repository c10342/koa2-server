/**
 *异常基类
 *
 * @class HttpException
 * @extends {Error}
 */
class HttpException extends Error{
    constructor(msg='服务器错误',errorCode=1000,code=400){
        super()
        // 错误信息
        this.msg = msg
        // 具体错误码
        this.errorCode = errorCode
        // 请求响应错误码
        this.code = code
    }
}

/**
 *参数错误异常类
 *
 * @class ParameterException
 * @extends {HttpException}
 */
class ParameterException extends HttpException{
    constructor(msg,errorCode,code){
        super()
        this.msg = msg || '参数错误'
        this.errorCode = errorCode || 1000
        this.code = code || 400
    }
}

/**
 *操作成功
 *
 * @class Success
 * @extends {HttpException}
 */
class Success extends HttpException{
    constructor(msg,errorCode){
        super()
        this.msg = msg || 'ok'
        this.errorCode = errorCode || 0
        this.code = 201
    }
}

/**
 *找不到资源
 *
 * @class NotFound
 * @extends {HttpException}
 */
class NotFound extends HttpException{
    constructor(msg,errorCode){
        super()
        this.msg = msg || 'Not Found'
        this.errorCode = errorCode || 1000
        this.code = 404
    }
}

/**
 *登录失败
 *
 * @class AuthFailed
 * @extends {HttpException}
 */
class AuthFailed extends HttpException{
    constructor(msg,errorCode){
        super()
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10004
        this.code = 401
    }
}


class Forbidden extends HttpException{
    constructor(msg,errorCode){
        super()
        this.msg = msg || '禁止访问'
        this.errorCode = errorCode || 10006
        this.code = 403
    }
}




module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbidden
}