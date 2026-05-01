//! TestMind Rust Service - User Management API

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: Option<i64>,
    username: String,
    email: String,
    #[serde(skip_serializing)]
    password: String,
    first_name: Option<String>,
    last_name: Option<String>,
    active: bool,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CreateUserRequest {
    username: String,
    email: String,
    password: String,
    first_name: Option<String>,
    last_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct UpdateUserRequest {
    username: Option<String>,
    email: Option<String>,
    first_name: Option<String>,
    last_name: Option<String>,
    active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct ApiResponse<T> {
    success: bool,
    message: String,
    data: Option<T>,
    timestamp: i64,
}

impl<T> ApiResponse<T> {
    fn success(data: T) -> Self {
        ApiResponse {
            success: true,
            message: "Operation successful".to_string(),
            data: Some(data),
            timestamp: Utc::now().timestamp_millis(),
        }
    }

    fn error(message: &str) -> Self {
        ApiResponse {
            success: false,
            message: message.to_string(),
            data: None,
            timestamp: Utc::now().timestamp_millis(),
        }
    }
}

struct AppState {
    users: Mutex<Vec<User>>,
    next_id: Mutex<i64>,
}

impl AppState {
    fn new() -> Self {
        let users = vec![
            User {
                id: Some(1),
                username: "admin".to_string(),
                email: "admin@testmind.com".to_string(),
                password: "password123".to_string(),
                first_name: Some("Admin".to_string()),
                last_name: Some("User".to_string()),
                active: true,
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
            User {
                id: Some(2),
                username: "johndoe".to_string(),
                email: "john@testmind.com".to_string(),
                password: "password123".to_string(),
                first_name: Some("John".to_string()),
                last_name: Some("Doe".to_string()),
                active: true,
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
            User {
                id: Some(3),
                username: "janedoe".to_string(),
                email: "jane@testmind.com".to_string(),
                password: "password123".to_string(),
                first_name: Some("Jane".to_string()),
                last_name: Some("Doe".to_string()),
                active: false,
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
        ];
        AppState {
            users: Mutex::new(users),
            next_id: Mutex::new(4),
        }
    }
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(ApiResponse::<()>::success(()))
}

async fn get_all_users(state: web::Data<AppState>) -> impl Responder {
    let users = state.users.lock().unwrap();
    HttpResponse::Ok().json(ApiResponse::success(users.clone()))
}

async fn get_user_by_id(id: web::Path<i64>, state: web::Data<AppState>) -> impl Responder {
    let users = state.users.lock().unwrap();
    let user = users.iter().find(|u| u.id == Some(id.into_inner()));
    match user {
        Some(user) => HttpResponse::Ok().json(ApiResponse::success(user.clone())),
        None => HttpResponse::NotFound().json(ApiResponse::<()>::error("User not found")),
    }
}

async fn get_user_by_email(email: web::Path<String>, state: web::Data<AppState>) -> impl Responder {
    let users = state.users.lock().unwrap();
    let user = users.iter().find(|u| u.email == *email);
    match user {
        Some(user) => HttpResponse::Ok().json(ApiResponse::success(user.clone())),
        None => HttpResponse::NotFound().json(ApiResponse::<()>::error("User not found")),
    }
}

async fn get_user_by_username(username: web::Path<String>, state: web::Data<AppState>) -> impl Responder {
    let users = state.users.lock().unwrap();
    let user = users.iter().find(|u| u.username == *username);
    match user {
        Some(user) => HttpResponse::Ok().json(ApiResponse::success(user.clone())),
        None => HttpResponse::NotFound().json(ApiResponse::<()>::error("User not found")),
    }
}

async fn search_users(query: web::Query<SearchQuery>, state: web::Data<AppState>) -> impl Responder {
    let users = state.users.lock().unwrap();
    let keyword = query.keyword.to_lowercase();
    let results: Vec<User> = users
        .iter()
        .filter(|u| {
            u.username.to_lowercase().contains(&keyword)
                || u.email.to_lowercase().contains(&keyword)
                || u.first_name.as_ref().map(|n| n.to_lowercase().contains(&keyword)).unwrap_or(false)
                || u.last_name.as_ref().map(|n| n.to_lowercase().contains(&keyword)).unwrap_or(false)
        })
        .cloned()
        .collect();
    HttpResponse::Ok().json(ApiResponse::success(results))
}

#[derive(Debug, Deserialize)]
struct SearchQuery {
    keyword: String,
}

async fn get_active_users(state: web::Data<AppState>) -> impl Responder {
    let users = state.users.lock().unwrap();
    let active: Vec<User> = users.iter().filter(|u| u.active).cloned().collect();
    HttpResponse::Ok().json(ApiResponse::success(active))
}

async fn get_recent_users(state: web::Data<AppState>) -> impl Responder {
    let users = state.users.lock().unwrap();
    let count = std::cmp::min(users.len(), 10);
    let recent: Vec<User> = users.iter().skip(users.len() - count).cloned().collect();
    HttpResponse::Ok().json(ApiResponse::success(recent))
}

async fn create_user(req: web::Json<CreateUserRequest>, state: web::Data<AppState>) -> impl Responder {
    let mut users = state.users.lock().unwrap();
    let mut next_id = state.next_id.lock().unwrap();

    if users.iter().any(|u| u.email == req.email) {
        return HttpResponse::Conflict().json(ApiResponse::<()>::error("Email already exists"));
    }

    if users.iter().any(|u| u.username == req.username) {
        return HttpResponse::Conflict().json(ApiResponse::<()>::error("Username already exists"));
    }

    let user = User {
        id: Some(*next_id),
        username: req.username.clone(),
        email: req.email.clone(),
        password: req.password.clone(),
        first_name: req.first_name.clone(),
        last_name: req.last_name.clone(),
        active: true,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };

    *next_id += 1;
    users.push(user.clone());
    HttpResponse::Created().json(ApiResponse::success(user))
}

async fn update_user(id: web::Path<i64>, req: web::Json<UpdateUserRequest>, state: web::Data<AppState>) -> impl Responder {
    let mut users = state.users.lock().unwrap();
    let id = id.into_inner();

    if let Some(user) = users.iter_mut().find(|u| u.id == Some(id)) {
        if let Some(email) = &req.email {
            if users.iter().any(|u| u.id != Some(id) && u.email == *email) {
                return HttpResponse::Conflict().json(ApiResponse::<()>::error("Email already exists"));
            }
        }

        if let Some(username) = &req.username {
            if users.iter().any(|u| u.id != Some(id) && u.username == *username) {
                return HttpResponse::Conflict().json(ApiResponse::<()>::error("Username already exists"));
            }
        }

        if let Some(username) = &req.username {
            user.username = username.clone();
        }
        if let Some(email) = &req.email {
            user.email = email.clone();
        }
        if let Some(first_name) = &req.first_name {
            user.first_name = Some(first_name.clone());
        }
        if let Some(last_name) = &req.last_name {
            user.last_name = Some(last_name.clone());
        }
        if let Some(active) = req.active {
            user.active = active;
        }
        user.updated_at = Utc::now();

        HttpResponse::Ok().json(ApiResponse::success(user.clone()))
    } else {
        HttpResponse::NotFound().json(ApiResponse::<()>::error("User not found"))
    }
}

async fn delete_user(id: web::Path<i64>, state: web::Data<AppState>) -> impl Responder {
    let mut users = state.users.lock().unwrap();
    let id = id.into_inner();
    let len_before = users.len();
    users.retain(|u| u.id != Some(id));

    if users.len() < len_before {
        HttpResponse::Ok().json(ApiResponse::<()>::success(()))
    } else {
        HttpResponse::NotFound().json(ApiResponse::<()>::error("User not found"))
    }
}

async fn activate_user(id: web::Path<i64>, state: web::Data<AppState>) -> impl Responder {
    let mut users = state.users.lock().unwrap();
    let id = id.into_inner();

    if let Some(user) = users.iter_mut().find(|u| u.id == Some(id)) {
        user.active = true;
        user.updated_at = Utc::now();
        HttpResponse::Ok().json(ApiResponse::success(user.clone()))
    } else {
        HttpResponse::NotFound().json(ApiResponse::<()>::error("User not found"))
    }
}

async fn deactivate_user(id: web::Path<i64>, state: web::Data<AppState>) -> impl Responder {
    let mut users = state.users.lock().unwrap();
    let id = id.into_inner();

    if let Some(user) = users.iter_mut().find(|u| u.id == Some(id)) {
        user.active = false;
        user.updated_at = Utc::now();
        HttpResponse::Ok().json(ApiResponse::success(user.clone()))
    } else {
        HttpResponse::NotFound().json(ApiResponse::<()>::error("User not found"))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = Arc::new(AppState::new());

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .route("/api/health", web::get().to(health_check))
            .route("/api/v1/users", web::get().to(get_all_users))
            .route("/api/v1/users", web::post().to(create_user))
            .route("/api/v1/users/{id}", web::get().to(get_user_by_id))
            .route("/api/v1/users/{id}", web::put().to(update_user))
            .route("/api/v1/users/{id}", web::delete().to(delete_user))
            .route("/api/v1/users/email/{email}", web::get().to(get_user_by_email))
            .route("/api/v1/users/username/{username}", web::get().to(get_user_by_username))
            .route("/api/v1/users/search", web::get().to(search_users))
            .route("/api/v1/users/active", web::get().to(get_active_users))
            .route("/api/v1/users/recent", web::get().to(get_recent_users))
            .route("/api/v1/users/{id}/activate", web::patch().to(activate_user))
            .route("/api/v1/users/{id}/deactivate", web::patch().to(deactivate_user))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
