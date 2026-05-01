//! 用户管理模块
//! 提供用户管理功能

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use regex::Regex;

/// 用户结构体
#[derive(Debug, Clone)]
pub struct User {
    pub id: Option<u64>,
    pub username: String,
    pub email: String,
    pub password: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub active: bool,
}

impl User {
    /// 创建新用户
    pub fn new(username: String, email: String, password: String) -> Self {
        User {
            id: None,
            username,
            email,
            password,
            first_name: None,
            last_name: None,
            active: true,
        }
    }

    /// 获取用户全名
    pub fn full_name(&self) -> String {
        match (&self.first_name, &self.last_name) {
            (Some(first), Some(last)) => format!("{} {}", first, last),
            (Some(first), None) => first.clone(),
            (None, Some(last)) => last.clone(),
            (None, None) => self.username.clone(),
        }
    }
}

/// 用户管理器
pub struct UserManager {
    users: Mutex<HashMap<u64, User>>,
    next_id: Mutex<u64>,
}

impl UserManager {
    /// 创建新的用户管理器
    pub fn new() -> Self {
        UserManager {
            users: Mutex::new(HashMap::new()),
            next_id: Mutex::new(1),
        }
    }

    /// 根据ID查找用户
    pub fn find_user_by_id(&self, id: u64) -> Option<User> {
        let users = self.users.lock().unwrap();
        users.get(&id).cloned()
    }

    /// 获取所有用户
    pub fn find_all_users(&self) -> Vec<User> {
        let users = self.users.lock().unwrap();
        users.values().cloned().collect()
    }

    /// 创建新用户
    pub fn create_user(&self, mut user: User) -> Result<User, String> {
        if user.email.is_empty() {
            return Err("邮箱不能为空".to_string());
        }

        if !Self::validate_email(&user.email) {
            return Err("邮箱格式不正确".to_string());
        }

        let mut users = self.users.lock().unwrap();
        let mut next_id = self.next_id.lock().unwrap();
        
        user.id = Some(*next_id);
        *next_id += 1;
        
        users.insert(user.id.unwrap(), user.clone());
        
        Ok(user)
    }

    /// 更新用户信息
    pub fn update_user(&self, id: u64, user: User) -> Result<User, String> {
        let mut users = self.users.lock().unwrap();
        
        if !users.contains_key(&id) {
            return Err("用户不存在".to_string());
        }
        
        let mut updated_user = user;
        updated_user.id = Some(id);
        users.insert(id, updated_user.clone());
        
        Ok(updated_user)
    }

    /// 删除用户
    pub fn delete_user(&self, id: u64) -> bool {
        let mut users = self.users.lock().unwrap();
        users.remove(&id).is_some()
    }

    /// 激活用户
    pub fn activate_user(&self, id: u64) -> bool {
        let mut users = self.users.lock().unwrap();
        
        if let Some(user) = users.get_mut(&id) {
            user.active = true;
            return true;
        }
        
        false
    }

    /// 停用用户
    pub fn deactivate_user(&self, id: u64) -> bool {
        let mut users = self.users.lock().unwrap();
        
        if let Some(user) = users.get_mut(&id) {
            user.active = false;
            return true;
        }
        
        false
    }

    /// 根据邮箱查找用户
    pub fn find_user_by_email(&self, email: &str) -> Option<User> {
        let users = self.users.lock().unwrap();
        
        users.values()
            .find(|user| user.email == email)
            .cloned()
    }

    /// 根据用户名查找用户
    pub fn find_user_by_username(&self, username: &str) -> Option<User> {
        let users = self.users.lock().unwrap();
        
        users.values()
            .find(|user| user.username == username)
            .cloned()
    }

    /// 搜索用户
    pub fn search_users(&self, keyword: &str, search_username: bool, search_email: bool, search_name: bool) -> Vec<User> {
        let users = self.users.lock().unwrap();
        let lower_keyword = keyword.to_lowercase();
        let mut results = Vec::new();
        
        for user in users.values() {
            let mut matched = false;
            
            if search_username {
                if user.username.to_lowercase().contains(&lower_keyword) {
                    matched = true;
                }
            }
            
            if !matched && search_email {
                if user.email.to_lowercase().contains(&lower_keyword) {
                    matched = true;
                }
            }
            
            if !matched && search_name {
                if let Some(first_name) = &user.first_name {
                    if first_name.to_lowercase().contains(&lower_keyword) {
                        matched = true;
                    }
                }
                
                if !matched {
                    if let Some(last_name) = &user.last_name {
                        if last_name.to_lowercase().contains(&lower_keyword) {
                            matched = true;
                        }
                    }
                }
            }
            
            if matched {
                results.push(user.clone());
            }
        }
        
        results
    }

    /// 获取活跃用户数量
    pub fn active_user_count(&self) -> usize {
        let users = self.users.lock().unwrap();
        users.values().filter(|user| user.active).count()
    }

    /// 获取用户总数
    pub fn total_user_count(&self) -> usize {
        let users = self.users.lock().unwrap();
        users.len()
    }

    /// 验证邮箱格式
    fn validate_email(email: &str) -> bool {
        let email_regex = Regex::new(r"^[a-zA-Z0-9_+.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
        email_regex.is_match(email)
    }
}

impl Default for UserManager {
    fn default() -> Self {
        Self::new()
    }
}
