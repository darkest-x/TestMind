/**
 * 用户服务模块
 * 提供用户管理的核心功能
 */

import { User } from './models/user.js';
import { UserRepository } from './repositories/userRepository.js';

export class UserService {
    /**
     * 构造函数
     * @param {UserRepository} userRepository - 用户仓库实例
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 根据ID查找用户
     * @param {number} userId - 用户ID
     * @returns {Promise<User|null>} 用户对象
     * @throws {Error} 当用户ID无效时
     */
    async findUserById(userId) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('用户ID必须为正整数');
        }

        return await this.userRepository.findById(userId);
    }

    /**
     * 获取所有用户
     * @returns {Promise<User[]>} 用户列表
     */
    async findAllUsers() {
        return await this.userRepository.findAll();
    }

    /**
     * 创建新用户
     * @param {User} user - 用户对象
     * @returns {Promise<User>} 创建的用户对象
     * @throws {Error} 当用户信息无效时
     */
    async createUser(user) {
        if (!user) {
            throw new Error('用户信息不能为空');
        }

        if (!user.email || !user.email.trim()) {
            throw new Error('用户邮箱不能为空');
        }

        this._validateEmailFormat(user.email);
        return await this.userRepository.save(user);
    }

    /**
     * 更新用户信息
     * @param {number} userId - 用户ID
     * @param {User} user - 用户信息
     * @returns {Promise<User>} 更新后的用户对象
     * @throws {Error} 当参数无效或用户不存在时
     */
    async updateUser(userId, user) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('用户ID必须为正整数');
        }

        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('用户不存在');
        }

        return await this.userRepository.save(user);
    }

    /**
     * 删除用户
     * @param {number} userId - 用户ID
     * @throws {Error} 当用户ID无效时
     */
    async deleteUser(userId) {
        if (!userId || typeof userId !== 'number' || userId <= 0) {
            throw new Error('用户ID必须为正整数');
        }

        await this.userRepository.deleteById(userId);
    }

    /**
     * 验证邮箱格式
     * @param {string} email - 邮箱地址
     * @throws {Error} 当邮箱格式不正确时
     * @private
     */
    _validateEmailFormat(email) {
        const emailPattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
        if (!emailPattern.test(email)) {
            throw new Error('邮箱格式不正确');
        }
    }
}
