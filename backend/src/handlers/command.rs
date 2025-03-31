use crate::{models::response::ApiResponse, state::AppState};
use axum::{http::StatusCode, response::Response};
use serde_json::json;

pub async fn handle_command(command: String, state: AppState) -> Response {
    let mut lock = state.client.lock().await;
    if let Some(conn) = lock.as_mut() {
        match conn.cmd(&command).await {
            Ok(response) => ApiResponse::ok(json!({ "response": response })),
            Err(err) => ApiResponse::<()>::error(
                &format!("Command error: {err}"),
                StatusCode::INTERNAL_SERVER_ERROR,
            ),
        }
    } else {
        ApiResponse::<()>::error("Not connected", StatusCode::BAD_REQUEST)
    }
}
