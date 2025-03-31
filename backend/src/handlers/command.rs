use axum::{extract::{State, Json}, response::IntoResponse, http::StatusCode};
use serde_json::json;

use crate::{state::AppState, models::CommandRequest};

pub async fn handler(
    State(state): State<AppState>,

    Json(payload): Json<CommandRequest>,
) -> impl IntoResponse {
   

    let mut lock = state.client.lock().await;
    if let Some(conn) = lock.as_mut() {
        match conn.cmd(&payload.command).await {
            Ok(response) => Json(json!({ "response": response })).into_response(),
            Err(err) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Command failed: {}", err),
            ).into_response(),
        }
    } else {
        (
            StatusCode::BAD_REQUEST,
            "Not connected. Use /connect first",
        ).into_response()
    }
}
