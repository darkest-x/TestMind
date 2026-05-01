/**
 * 用户模型类
 */

export class User {
    /**
     * 构造函数
     * @param {Object} userData - 用户数据
     * @param {number} [userData.id] - 用户ID
     * @param {string} userData.username - 用户名
     * @param {string} userData.email - 邮箱
     * @param {string} userData.password - 密码
     * @param {string} [userData.firstName] - 名字
     * @param {string} [userData.lastName] - 姓氏
     * @param {boolean} [userData.active=true] - 是否激活
     */
    constructor({
        id,
        username,
        email,
        password,
        firstName,
        lastName,
        active = true
    }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.active = active;
    }

    /**
     * 获取用户全名
     * @returns {string} 用户全名
     */
    get fullName() {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        } else if (this.firstName) {
            return this.firstName;
        } else if (this.lastName) {
            return this.lastName;
        }
        return this.username;
    }

    /**
     * 转换为对象
     * @returns {Object} 普通对象
     */
    toObject() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            active: this.active
        };
    }

    /**
     * 创建用户实例
     * @param {Object} data - 用户数据
     * @returns {User} 用户实例
     */
    static fromObject(data) {
        return new User(data);
    }
}
