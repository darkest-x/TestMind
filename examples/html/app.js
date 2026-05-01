/**
 * 用户管理系统应用
 */

// 模拟用户数据
let users = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        firstName: '管理员',
        lastName: '用户',
        active: true
    },
    {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        firstName: '测试',
        lastName: '用户',
        active: true
    }
];

let nextId = 3;

// DOM 元素
const addUserBtn = document.getElementById('addUserBtn');
const userModal = document.getElementById('userModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');
const userTableBody = document.getElementById('userTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderUsers();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    addUserBtn.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    userForm.addEventListener('submit', handleSubmit);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// 渲染用户列表
function renderUsers(filteredUsers = null) {
    const displayUsers = filteredUsers || users;
    userTableBody.innerHTML = '';

    if (displayUsers.length === 0) {
        userTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #94a3b8;">
                    没有找到用户
                </td>
            </tr>
        `;
        return;
    }

    displayUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.firstName || ''} ${user.lastName || ''}</td>
            <td>
                <span class="status-badge ${user.active ? 'status-active' : 'status-inactive'}">
                    ${user.active ? '激活' : '未激活'}
                </span>
            </td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editUser(${user.id})">
                    编辑
                </button>
                <button class="btn btn-delete" onclick="deleteUser(${user.id})">
                    删除
                </button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// 打开添加用户模态框
function openAddModal() {
    userForm.reset();
    document.getElementById('userId').value = '';
    modalTitle.textContent = '添加用户';
    userModal.style.display = 'block';
}

// 编辑用户
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        return;
    }

    document.getElementById('userId').value = user.id;
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('password').value = user.password || '';
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('active').checked = user.active;

    modalTitle.textContent = '编辑用户';
    userModal.style.display = 'block';
}

// 删除用户
function deleteUser(id) {
    if (confirm('确定要删除这个用户吗？')) {
        users = users.filter(u => u.id !== id);
        renderUsers();
    }
}

// 处理表单提交
function handleSubmit(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        active: document.getElementById('active').checked
    };

    if (userId) {
        // 更新用户
        const index = users.findIndex(u => u.id === parseInt(userId));
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
        }
    } else {
        // 添加新用户
        users.push({
            id: nextId++,
            ...userData
        });
    }

    renderUsers();
    closeModalHandler();
}

// 搜索用户
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        renderUsers();
        return;
    }

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm))
    );

    renderUsers(filteredUsers);
}

// 关闭模态框
function closeModalHandler() {
    userModal.style.display = 'none';
}

// 点击模态框外部关闭
window.addEventListener('click', function(e) {
    if (e.target === userModal) {
        closeModalHandler();
    }
});
