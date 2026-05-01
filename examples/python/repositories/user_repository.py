"""
用户仓库模块
"""

from typing import List, Optional
from models.user import User


class UserRepository:
    """用户仓库接口"""

    def find_by_id(self, user_id: int) -> Optional[User]:
        """
        根据ID查找用户

        Args:
            user_id: 用户ID

        Returns:
            用户对象，如果不存在则返回None
        """
        raise NotImplementedError

    def find_all(self) -> List[User]:
        """
        获取所有用户

        Returns:
            用户列表
        """
        raise NotImplementedError

    def save(self, user: User) -> User:
        """
        保存用户

        Args:
            user: 用户对象

        Returns:
            保存后的用户对象
        """
        raise NotImplementedError

    def delete_by_id(self, user_id: int) -> None:
        """
        根据ID删除用户

        Args:
            user_id: 用户ID
        """
        raise NotImplementedError

    def find_by_email(self, email: str) -> Optional[User]:
        """
        根据邮箱查找用户

        Args:
            email: 邮箱地址

        Returns:
            用户对象，如果不存在则返回None
        """
        raise NotImplementedError

    def find_by_username(self, username: str) -> Optional[User]:
        """
        根据用户名查找用户

        Args:
            username: 用户名

        Returns:
            用户对象，如果不存在则返回None
        """
        raise NotImplementedError
