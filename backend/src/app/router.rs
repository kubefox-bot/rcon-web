use axum::{http::Method, routing::{get, post}, Router};
use tower_http::cors::{CorsLayer, Any};
use crate::{handlers::{connect, command, disconnect}, state::AppState};

pub fn build_router(state: AppState) -> Router {

    let cors = CorsLayer::new()
    .allow_origin(Any) // или .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
    .allow_methods([Method::GET, Method::POST])
    .allow_headers(Any);

    Router::new()
        .route("/", get(|| async { "CS2 RCON Rust API" }))
        .route("/connect", post(connect::handler))
        .route("/command", post(command::handler))
        .route("/disconnect", post(disconnect::handler))
        .with_state(state)
        .layer(cors)
}
