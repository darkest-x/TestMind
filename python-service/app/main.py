"""TestMind Python Service - FastAPI User Management"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="TestMind User Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class CreateUserRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    active: Optional[bool] = None

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[List[User]] | Optional[User] | None = None
    timestamp: int

users_db = [
    User(
        id=1,
        username="admin",
        email="admin@testmind.com",
        password="password123",
        first_name="Admin",
        last_name="User",
        active=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    User(
        id=2,
        username="johndoe",
        email="john@testmind.com",
        password="password123",
        first_name="John",
        last_name="Doe",
        active=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    User(
        id=3,
        username="janedoe",
        email="jane@testmind.com",
        password="password123",
        first_name="Jane",
        last_name="Doe",
        active=False,
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
]
next_id = 4

@app.get("/api/health", response_model=ApiResponse)
async def health_check():
    return ApiResponse(
        success=True,
        message="TestMind Python Service is running",
        data=None,
        timestamp=int(datetime.now().timestamp())
    )

@app.get("/api/v1/users", response_model=ApiResponse)
async def get_all_users():
    return ApiResponse(
        success=True,
        message="Success",
        data=users_db,
        timestamp=int(datetime.now().timestamp())
    )

@app.get("/api/v1/users/{user_id}", response_model=ApiResponse)
async def get_user_by_id(user_id: int):
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return ApiResponse(
        success=True,
        message="Success",
        data=user,
        timestamp=int(datetime.now().timestamp())
    )

@app.get("/api/v1/users/email/{email}", response_model=ApiResponse)
async def get_user_by_email(email: str):
    user = next((u for u in users_db if u.email == email), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return ApiResponse(
        success=True,
        message="Success",
        data=user,
        timestamp=int(datetime.now().timestamp())
    )

@app.get("/api/v1/users/username/{username}", response_model=ApiResponse)
async def get_user_by_username(username: str):
    user = next((u for u in users_db if u.username == username), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return ApiResponse(
        success=True,
        message="Success",
        data=user,
        timestamp=int(datetime.now().timestamp())
    )

@app.get("/api/v1/users/search", response_model=ApiResponse)
async def search_users(keyword: str):
    lower_keyword = keyword.lower()
    results = []
    for user in users_db:
        if (lower_keyword in user.username.lower() or
            lower_keyword in user.email.lower() or
            (user.first_name and lower_keyword in user.first_name.lower()) or
            (user.last_name and lower_keyword in user.last_name.lower())):
            results.append(user)
    return ApiResponse(
        success=True,
        message="Success",
        data=results,
        timestamp=int(datetime.now().timestamp())
    )

@app.get("/api/v1/users/active", response_model=ApiResponse)
async def get_active_users():
    active_users = [u for u in users_db if u.active]
    return ApiResponse(
        success=True,
        message="Success",
        data=active_users,
        timestamp=int(datetime.now().timestamp())
    )

@app.get("/api/v1/users/recent", response_model=ApiResponse)
async def get_recent_users():
    count = min(len(users_db), 10)
    return ApiResponse(
        success=True,
        message="Success",
        data=users_db[-count:],
        timestamp=int(datetime.now().timestamp())
    )

@app.post("/api/v1/users", status_code=status.HTTP_201_CREATED, response_model=ApiResponse)
async def create_user(request: CreateUserRequest):
    global next_id
    
    if any(u.email == request.email for u in users_db):
        raise HTTPException(status_code=409, detail="Email already exists")
    
    if any(u.username == request.username for u in users_db):
        raise HTTPException(status_code=409, detail="Username already exists")
    
    new_user = User(
        id=next_id,
        username=request.username,
        email=request.email,
        password=request.password,
        first_name=request.first_name,
        last_name=request.last_name,
        active=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    users_db.append(new_user)
    next_id += 1
    
    return ApiResponse(
        success=True,
        message="User created successfully",
        data=new_user,
        timestamp=int(datetime.now().timestamp())
    )

@app.put("/api/v1/users/{user_id}", response_model=ApiResponse)
async def update_user(user_id: int, request: UpdateUserRequest):
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if request.email and request.email != user.email:
        if any(u.email == request.email for u in users_db):
            raise HTTPException(status_code=409, detail="Email already exists")
    
    if request.username and request.username != user.username:
        if any(u.username == request.username for u in users_db):
            raise HTTPException(status_code=409, detail="Username already exists")
    
    if request.username:
        user.username = request.username
    if request.email:
        user.email = request.email
    if request.first_name:
        user.first_name = request.first_name
    if request.last_name:
        user.last_name = request.last_name
    if request.active is not None:
        user.active = request.active
    user.updated_at = datetime.now()
    
    return ApiResponse(
        success=True,
        message="User updated successfully",
        data=user,
        timestamp=int(datetime.now().timestamp())
    )

@app.delete("/api/v1/users/{user_id}", response_model=ApiResponse)
async def delete_user(user_id: int):
    global users_db
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    users_db = [u for u in users_db if u.id != user_id]
    
    return ApiResponse(
        success=True,
        message="User deleted successfully",
        data=None,
        timestamp=int(datetime.now().timestamp())
    )

@app.patch("/api/v1/users/{user_id}/activate", response_model=ApiResponse)
async def activate_user(user_id: int):
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.active = True
    user.updated_at = datetime.now()
    
    return ApiResponse(
        success=True,
        message="User activated successfully",
        data=user,
        timestamp=int(datetime.now().timestamp())
    )

@app.patch("/api/v1/users/{user_id}/deactivate", response_model=ApiResponse)
async def deactivate_user(user_id: int):
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.active = False
    user.updated_at = datetime.now()
    
    return ApiResponse(
        success=True,
        message="User deactivated successfully",
        data=user,
        timestamp=int(datetime.now().timestamp())
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
