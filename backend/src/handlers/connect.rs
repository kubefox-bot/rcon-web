use axum::{extract::{State, Json}, http::HeaderMap, response::IntoResponse, http::StatusCode};
use serde_json::json;

use crate::{auth::check_auth, state::AppState, models::ConnectRequest};
use rcon::Connection;
use tokio::net::TcpStream;

pub async fn handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<ConnectRequest>,
) -> impl IntoResponse {
    if !check_auth(&headers, &state.auth_token) {
        return (StatusCode::UNAUTHORIZED, "Invalid token").into_response();
    }

    let addr = format!("{}:{}", payload.host, payload.port);
    match Connection::<TcpStream>::connect(&addr, &payload.password).await {
        Ok(conn) => {
            let mut lock = state.client.lock().await;
            *lock = Some(conn);
            Json(json!({ "status": "connected" })).into_response()
        }
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to connect: {err}"),
        ).into_response(),
    }
}
