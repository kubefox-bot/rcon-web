use serde::{Deserialize, Serialize};
use axum::{http::StatusCode, response::{IntoResponse, Response}, Json};

#[derive(Deserialize)]
pub struct AuthRequest {
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub access_token: String,
}

#[derive(Debug)]
pub enum AuthError {
    InvalidCredentials,
    TokenError,
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        match self {
            AuthError::InvalidCredentials => (
                StatusCode::UNAUTHORIZED,
                Json(serde_json::json!({ "error": "Invalid password" })),
            ),
            AuthError::TokenError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": "Token creation failed" })),
            ),
        }
        .into_response()
    }
}
