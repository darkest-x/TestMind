"""
用户仓库实现模块
"""

from typing import List, Optional
from models.user import User
from repositories.user_repository import UserRepository


class UserRepositoryImpl(UserRepository):
    """用户仓库实现类"""

    def __init__(self):
        """初始化用户仓库"""
        self._users: dict[int, User] = {}
        self._next_id: int = 1

    def find_by_id(self, user_id: int) -> Optional[User]:
        """
        根据ID查找用户

        Args:
            user_id: 用户ID

        Returns:
            用户对象，如果不存在则返回None
        """
        return self._users.get(user_id)

    def find_all(self) -> List[User]:
        """
        获取所有用户

        Returns:
            用户列表
        """
        return list(self._users.values())

    def save(self, user: User) -> User:
        """
        保存用户

        Args:
            user: 用户对象

        Returns:
            保存后的用户对象
        """
        if user.id is None:
            user.id = self._next_id
            self._next_id += 1

        self._users[user.id] = user
        return user

    def delete_by_id(self, user_id: int) -> None:
        """
        根据ID删除用户

        Args:
            user_id: 用户ID
        """
        if user_id in self._users:
            del self._users[user_id]

    def find_by_email(self, email: str) -> Optional[User]:
        """
        根据邮箱查找用户

        Args:
            email: 邮箱地址

        Returns:
            用户对象，如果不存在则返回None
        """
        for user in self._users.values():
            if user.email == email:
                return user
        return None

    def find_by_username(self, username: str) -> Optional[User]:
        """
        根据用户名查找用户

        Args:
            username: 用户名

        Returns:
            用户对象，如果不存在则返回None
        """
        for user in self._users.values():
            if user.username == username:
                return user
        return None
