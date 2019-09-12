const { LinValidator, Rule } = require('../../core/lin-validator')
const { User } = require('../models/user')
const { LoginType, Arttype } = require('../lib/enum')

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            // isInt会自动把字符串数字转化为数字
            new Rule('isInt', '需要是正整数', { min: 1 })
        ]
    }
}

/**
 *用户注册参数校验
 *
 * @class RegisterValidator
 * @extends {LinValidator}
 */
class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.email = [
            new Rule('isEmail', '不符合email规范')
        ]
        this.password1 = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            }),
            // "密码必须包含数字、大写英文字母、小写英文字母",
            new Rule('matches', '密码不符合规范', "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]")
        ]
        this.password2 = this.password1
        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范', {
                min: 4,
                max: 32
            }),
        ]
    }

    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2
        if (psw1 !== psw2) {
            throw new Error('两个密码必须相同')
        }
    }

    async validateEmail(vals) {
        const email = vals.body.email
        const user = await User.findOne({
            // 查询条件
            where: {
                email
            }
        })
        if (user) {
            throw new Error('邮箱已经存在')
        }
    }
}

class TokenValidator extends LinValidator {
    constructor() {
        super()
        // 账号
        this.account = [
            new Rule('isLength', '账号不符合规则', {
                min: 4, max: 32
            })
        ]
        // 密码   可传可不传
        this.secret = [
            new Rule('isOptional'),
            new Rule('isLength', '至少6个字符', {
                min: 6, max: 128
            })
        ]
    }

    validateLoginType(vals) {
        checkLoginType(vals)
    }
}

function checkLoginType(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
        throw new Error('type参数缺失')
    }
    type = parseInt(type)
    if (!LoginType.isThisType(type)) {
        throw new Error('type参数不正确')
    }
}

class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', 'token不能为空', { min: 1 })
        ]
    }
}


function checkArtType(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
        throw new Error('type参数缺失')
    }
    type = parseInt(type)
    if (!Arttype.isThisType(type)) {
        throw new Error('type参数不正确')
    }
}

class LikeValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.validateType = checkArtType
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator
}