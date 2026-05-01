"""
用户模型模块
"""

from typing import Optional


class User:
    """用户实体类"""

    def __init__(
        self,
        username: str,
        email: str,
        password: str,
        id: Optional[int] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        active: bool = True
    ):
        """
        初始化用户对象

        Args:
            username: 用户名
            email: 邮箱
            password: 密码
            id: 用户ID
            first_name: 名字
            last_name: 姓氏
            active: 是否激活
        """
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.active = active

    @property
    def full_name(self) -> str:
        """
        获取用户全名

        Returns:
            用户全名
        """
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return self.username

    def __repr__(self) -> str:
        """
        获取对象的字符串表示

        Returns:
            字符串表示
        """
        return f"User(id={self.id}, username={self.username!r}, email={self.email!r})"
