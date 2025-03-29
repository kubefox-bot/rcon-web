use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    Json,
};
use serde_json::json;

use crate::{auth::check_auth, state::AppState};

pub async fn handler(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> impl IntoResponse {
    if !check_auth(&headers, &state.auth_token) {
        return (
            StatusCode::UNAUTHORIZED,
            "Missing or invalid Authorization header",
        )
            .into_response();
    }

    let mut lock = state.client.lock().await;
    *lock = None;

    Json(json!({ "status": "disconnected" })).into_response()
}
