mod app;
mod handlers;
mod models;
mod state;
mod auth;
mod config;

use app::router::build_router;

use auth::jwt::JwtManager;
use config::Config;
use state::AppState;
use tokio::{net::TcpListener, sync::Mutex};
use std::sync::Arc;
use chrono::Utc;

#[tokio::main]
async fn main() {
    let config = Config::from_env();
    let addr = config.socket_addr();

    let jwt = JwtManager::new(config.auth_token.clone());

    let state = AppState {
        client: Arc::new(Mutex::new(None)),
        jwt: Arc::new(jwt),
        config: Arc::new(config),
        last_issued: Arc::new(Mutex::new(Some(Utc::now().timestamp()))),
    };

    let app = build_router(state);
    let listener = TcpListener::bind(addr).await.expect("Failed to bind");
    println!("🚀 API running on http://{}", addr);
    axum::serve(listener, app).await.unwrap();
}
