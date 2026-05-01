"""
用户 API 路由
"""

from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr

from models.user import User
from services.user_service import UserService


# 初始化路由
router = APIRouter(prefix="/api/users", tags=["users"])

# 依赖注入
def get_user_service() -> UserService:
    """获取用户服务实例"""
    return UserService()


# Pydantic 模型
class UserResponse(BaseModel):
    """用户响应模型"""
    id: int | None = None
    username: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    active: bool = True


class CreateUserRequest(BaseModel):
    """创建用户请求模型"""
    username: str
    email: EmailStr
    password: str
    first_name: str | None = None
    last_name: str | None = None


class UpdateUserRequest(BaseModel):
    """更新用户请求模型"""
    username: str | None = None
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    active: bool | None = None


@router.get("", response_model=List[UserResponse])
def get_all_users(
    user_service: UserService = Depends(get_user_service)
):
    """
    获取所有用户
    """
    users = user_service.find_all_users()
    return [
        UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            active=user.active
        )
        for user in users
    ]


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    user_service: UserService = Depends(get_user_service)
):
    """
    根据ID获取用户
    """
    user = user_service.find_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        active=user.active
    )


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_request: CreateUserRequest,
    user_service: UserService = Depends(get_user_service)
):
    """
    创建新用户
    """
    try:
        user = User(
            username=user_request.username,
            email=user_request.email,
            password=user_request.password,
            first_name=user_request.first_name,
            last_name=user_request.last_name,
            active=True
        )
        created_user = user_service.create_user(user)
        return UserResponse(
            id=created_user.id,
            username=created_user.username,
            email=created_user.email,
            first_name=created_user.first_name,
            last_name=created_user.last_name,
            active=created_user.active
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_request: UpdateUserRequest,
    user_service: UserService = Depends(get_user_service)
):
    """
    更新用户信息
    """
    try:
        # 获取现有用户
        existing_user = user_service.find_user_by_id(user_id)
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )

        # 更新用户信息
        if user_request.username is not None:
            existing_user.username = user_request.username
        if user_request.email is not None:
            existing_user.email = user_request.email
        if user_request.first_name is not None:
            existing_user.first_name = user_request.first_name
        if user_request.last_name is not None:
            existing_user.last_name = user_request.last_name
        if user_request.active is not None:
            existing_user.active = user_request.active

        updated_user = user_service.update_user(user_id, existing_user)
        return UserResponse(
            id=updated_user.id,
            username=updated_user.username,
            email=updated_user.email,
            first_name=updated_user.first_name,
            last_name=updated_user.last_name,
            active=updated_user.active
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service)
):
    """
    删除用户
    """
    try:
        user = user_service.find_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        user_service.delete_user(user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.patch("/{user_id}/activate", response_model=UserResponse)
def activate_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service)
):
    """
    激活用户
    """
    user = user_service.find_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    user.active = True
    updated_user = user_service.update_user(user_id, user)
    return UserResponse(
        id=updated_user.id,
        username=updated_user.username,
        email=updated_user.email,
        first_name=updated_user.first_name,
        last_name=updated_user.last_name,
        active=updated_user.active
    )


@router.patch("/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(
    user_id: int,
    user_service: UserService = Depends(get_user_service)
):
    """
    停用用户
    """
    user = user_service.find_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    user.active = False
    updated_user = user_service.update_user(user_id, user)
    return UserResponse(
        id=updated_user.id,
        username=updated_user.username,
        email=updated_user.email,
        first_name=updated_user.first_name,
        last_name=updated_user.last_name,
        active=updated_user.active
    )


@router.get("/search/by-email", response_model=UserResponse)
def search_user_by_email(
    email: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    根据邮箱搜索用户
    """
    users = user_service.find_all_users()
    user = next((u for u in users if u.email.lower() == email.lower()), None)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        active=user.active
    )
