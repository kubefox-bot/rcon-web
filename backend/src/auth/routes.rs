use axum::{
    Router,
    extract::{Json, State},
    routing::post,
};

use crate::{auth::types::*, state::AppState};

pub fn routes() -> Router<AppState> {
    Router::new().route("/login", post(login))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<AuthRequest>,
) -> Result<Json<AuthResponse>, AuthError> {

    println!("🔥 login request received: {:?}", payload.password);

    if payload.password != state.jwt.secret() {
        return Err(AuthError::InvalidCredentials);
    }

    let token = state
        .jwt
        .issue("rcon-admin", &state)
        .await
        .map_err(|_| AuthError::TokenError)?;

    Ok(Json(AuthResponse {
        access_token: token,
    }))
}
