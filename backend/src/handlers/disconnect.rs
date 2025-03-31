use axum::response::Response;
use crate::{state::AppState, models::response::ApiResponse};

pub async fn handle_disconnect(state: AppState) -> Response {
    let mut lock = state.client.lock().await;
    *lock = None;
    ApiResponse::with_message_and_data("Disconnected from RCON", Some(()))
}
