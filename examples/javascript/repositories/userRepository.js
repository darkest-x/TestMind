/**
 * 用户仓库类
 */

export class UserRepository {
    /**
     * 构造函数
     */
    constructor() {
        this.users = new Map();
        this.nextId = 1;
    }

    /**
     * 根据ID查找用户
     * @param {number} id - 用户ID
     * @returns {Promise<import('../models/user.js').User|null>} 用户对象
     */
    async findById(id) {
        return this.users.get(id) || null;
    }

    /**
     * 获取所有用户
     * @returns {Promise<Array<import('../models/user.js').User>>} 用户列表
     */
    async findAll() {
        return Array.from(this.users.values());
    }

    /**
     * 保存用户
     * @param {import('../models/user.js').User} user - 用户对象
     * @returns {Promise<import('../models/user.js').User>} 保存后的用户对象
     */
    async save(user) {
        if (!user.id) {
            user.id = this.nextId++;
        }
        this.users.set(user.id, user);
        return user;
    }

    /**
     * 根据ID删除用户
     * @param {number} id - 用户ID
     */
    async deleteById(id) {
        this.users.delete(id);
    }

    /**
     * 根据邮箱查找用户
     * @param {string} email - 邮箱地址
     * @returns {Promise<import('../models/user.js').User|null>} 用户对象
     */
    async findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    /**
     * 根据用户名查找用户
     * @param {string} username - 用户名
     * @returns {Promise<import('../models/user.js').User|null>} 用户对象
     */
    async findByUsername(username) {
        for (const user of this.users.values()) {
            if (user.username === username) {
                return user;
            }
        }
        return null;
    }
}
