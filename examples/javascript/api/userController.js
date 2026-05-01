/**
 * 用户控制器
 * 处理用户相关的 API 请求
 */

const { UserService } = require('../services/userService');
const { UserRepository } = require('../repositories/userRepository');

// 初始化服务
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

/**
 * 获取所有用户
 * GET /api/users
 */
async function getAllUsers(req, res) {
    try {
        const users = await userService.findAllUsers();
        const userResponses = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            active: user.active
        }));
        res.json(userResponses);
    } catch (error) {
        res.status(500).json({ error: '获取用户失败' });
    }
}

/**
 * 根据ID获取用户
 * GET /api/users/:id
 */
async function getUserById(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const user = await userService.findUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            active: user.active
        });
    } catch (error) {
        if (error.message.includes('必须为正数')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: '获取用户失败' });
    }
}

/**
 * 创建新用户
 * POST /api/users
 */
async function createUser(req, res) {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: '缺少必要字段' });
        }
        
        const user = {
            username,
            email,
            password,
            firstName,
            lastName,
            active: true
        };
        
        const createdUser = await userService.createUser(user);
        
        res.status(201).json({
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            active: createdUser.active
        });
    } catch (error) {
        if (error.message.includes('邮箱格式不正确') || 
            error.message.includes('不能为空')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: '创建用户失败' });
    }
}

/**
 * 更新用户信息
 * PUT /api/users/:id
 */
async function updateUser(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const { username, email, firstName, lastName, active } = req.body;
        
        const existingUser = await userService.findUserById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        const updatedUserData = {
            id: userId,
            username: username || existingUser.username,
            email: email || existingUser.email,
            password: existingUser.password,
            firstName: firstName !== undefined ? firstName : existingUser.firstName,
            lastName: lastName !== undefined ? lastName : existingUser.lastName,
            active: active !== undefined ? active : existingUser.active
        };
        
        const updatedUser = await userService.updateUser(userId, updatedUserData);
        
        res.json({
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            active: updatedUser.active
        });
    } catch (error) {
        if (error.message.includes('必须为正数') || 
            error.message.includes('邮箱格式不正确')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: '更新用户失败' });
    }
}

/**
 * 删除用户
 * DELETE /api/users/:id
 */
async function deleteUser(req, res) {
    try {
        const userId = parseInt(req.params.id);
        
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        if (error.message.includes('必须为正数')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: '删除用户失败' });
    }
}

/**
 * 激活用户
 * PATCH /api/users/:id/activate
 */
async function activateUser(req, res) {
    try {
        const userId = parseInt(req.params.id);
        
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        user.active = true;
        const updatedUser = await userService.updateUser(userId, user);
        
        res.json({
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            active: updatedUser.active
        });
    } catch (error) {
        if (error.message.includes('必须为正数')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: '激活用户失败' });
    }
}

/**
 * 停用用户
 * PATCH /api/users/:id/deactivate
 */
async function deactivateUser(req, res) {
    try {
        const userId = parseInt(req.params.id);
        
        const user = await userService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        user.active = false;
        const updatedUser = await userService.updateUser(userId, user);
        
        res.json({
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            active: updatedUser.active
        });
    } catch (error) {
        if (error.message.includes('必须为正数')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: '停用用户失败' });
    }
}

/**
 * 根据邮箱搜索用户
 * GET /api/users/search/email
 */
async function searchUserByEmail(req, res) {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ error: '邮箱参数不能为空' });
        }
        
        const users = await userService.findAllUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            return res.status(404).json({ error: '用户不存在' });
        }
        
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            active: user.active
        });
    } catch (error) {
        res.status(500).json({ error: '搜索用户失败' });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    searchUserByEmail
};
