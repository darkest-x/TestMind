"""
用户服务模块
提供用户管理的核心功能
"""

from typing import List, Optional
from models.user import User
from repositories.user_repository import UserRepository


class UserService:
    """用户服务类"""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def find_user_by_id(self, user_id: int) -> Optional[User]:
        """
        根据ID查找用户

        Args:
            user_id: 用户ID

        Returns:
            用户对象，如果不存在则返回None

        Raises:
            ValueError: 当用户ID无效时
        """
        if not isinstance(user_id, int) or user_id <= 0:
            raise ValueError("用户ID必须为正整数")

        return self.user_repository.find_by_id(user_id)

    def find_all_users(self) -> List[User]:
        """
        获取所有用户

        Returns:
            用户列表
        """
        return self.user_repository.find_all()

    def create_user(self, user: User) -> User:
        """
        创建新用户

        Args:
            user: 用户对象

        Returns:
            创建的用户对象

        Raises:
            ValueError: 当用户信息无效时
        """
        if not user:
            raise ValueError("用户信息不能为空")

        if not user.email or not user.email.strip():
            raise ValueError("用户邮箱不能为空")

        self._validate_email_format(user.email)
        return self.user_repository.save(user)

    def update_user(self, user_id: int, user: User) -> User:
        """
        更新用户信息

        Args:
            user_id: 用户ID
            user: 用户信息

        Returns:
            更新后的用户对象

        Raises:
            ValueError: 当参数无效时
            RuntimeError: 当用户不存在时
        """
        if not isinstance(user_id, int) or user_id <= 0:
            raise ValueError("用户ID必须为正整数")

        existing_user = self.user_repository.find_by_id(user_id)
        if not existing_user:
            raise RuntimeError("用户不存在")

        return self.user_repository.save(user)

    def delete_user(self, user_id: int) -> None:
        """
        删除用户

        Args:
            user_id: 用户ID

        Raises:
            ValueError: 当用户ID无效时
        """
        if not isinstance(user_id, int) or user_id <= 0:
            raise ValueError("用户ID必须为正整数")

        self.user_repository.delete_by_id(user_id)

    def _validate_email_format(self, email: str) -> None:
        """
        验证邮箱格式

        Args:
            email: 邮箱地址

        Raises:
            ValueError: 当邮箱格式不正确时
        """
        import re
        email_pattern = r'^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'
        if not re.match(email_pattern, email):
            raise ValueError("邮箱格式不正确")
