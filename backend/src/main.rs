mod app;
mod auth;
mod config;
mod crypto;
mod handlers;
mod models;
mod observability;
mod state;

use app::router::build_router;

use auth::jwt::JwtManager;
use chrono::Utc;
use config::Config;
use crypto::Crypto;
use state::AppState;
use std::sync::Arc;
use tokio::{net::TcpListener, sync::Mutex};

#[tokio::main]
async fn main() {
    println!("🟡 rcon-api starting...");
    dotenvy::dotenv().expect("❌ .env not found");
    println!("✅ .env loaded");
    observability::Observability::init();
    let config = Config::from_env();
    println!("✅ Config loaded: {:?}", config);
    let addr = config.socket_addr();
    println!("🔌 Will bind to {}", addr);
    let jwt = JwtManager::new(config.auth_token.clone());

    let crypto = Crypto::new(&config.encryption_key);

    let state = AppState {
        client: Arc::new(Mutex::new(None)),
        jwt: Arc::new(jwt),
        last_issued: Arc::new(Mutex::new(Some(Utc::now().timestamp()))),
        crypto: Arc::new(crypto),
    };

    let app = build_router(state);
    let listener = TcpListener::bind(addr).await.expect("Failed to bind");
    println!("🚀 API running on http://{}", addr);
    axum::serve(listener, app).await.unwrap();
}
