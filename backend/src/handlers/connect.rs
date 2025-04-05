use crate::{models::response::ApiResponse, state::AppState};
use axum::{http::StatusCode, response::Response};
use serde_json::json;

pub async fn handle_connect(
    host: String,
    port: u16,
    password: String,
    state: AppState,
) -> Response {
    let addr = format!("{host}:{port}");
    let password = state.crypto.decrypt_if_needed(&password);

    match rcon::Connection::connect(&addr, &password).await {
        Ok(conn) => {
            let mut lock = state.client.lock().await;
            *lock = Some(conn);
            ApiResponse::<serde_json::Value>::with_message_and_data(
                "Connected to RCON",
                json!({ "host": host, "port": port }).into(),
            )
        }
        Err(err) => ApiResponse::<()>::error(
            &format!("Connect error: {err}"),
            StatusCode::INTERNAL_SERVER_ERROR,
        ),
    }
}
