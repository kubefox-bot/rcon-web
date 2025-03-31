use axum::{
    extract::State,
    response::IntoResponse,
    Json,
};
use serde_json::json;

use crate::state::AppState;

pub async fn handler(
    State(state): State<AppState>,

) -> impl IntoResponse {
  
    let mut lock = state.client.lock().await;
    *lock = None;

    Json(json!({ "status": "disconnected" })).into_response()
}
