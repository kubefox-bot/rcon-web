use crate::{models::response::ApiResponse, state::AppState};
use axum::response::Response;

pub async fn handle_disconnect(state: AppState) -> Response {
    let mut lock = state.client.lock().await;
    *lock = None;
    ApiResponse::with_message_and_data("Disconnected from RCON", Some(()))
}
