use axum::{routing::post, Router};
use crate::{state::AppState, handlers};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/rcon/connect", post(handlers::connect))
        .route("/rcon/command", post(handlers::command))
        .route("/rcon/disconnect", post(handlers::disconnect))
}
