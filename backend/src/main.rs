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

use state::AppState;
use std::sync::Arc;
use tokio::{net::TcpListener, sync::Mutex};
use crate::crypto::{CryptoStorage, aes::CryptoAesGcm, chacha::CryptoChaCha20};


#[tokio::main]
async fn main() {
    observability::Observability::init();
    let config = Config::from_env();
    let addr = config.socket_addr();
    let jwt = JwtManager::new(config.auth_token.clone());
    let crypto: Box<dyn CryptoStorage> = match config.encryption_backend.as_str() {
        "aes" => Box::new(CryptoAesGcm::new(&config.encryption_key)),
        "chacha" => {
            let key_bytes = config.encryption_key.as_bytes();
            Box::new(CryptoChaCha20::new(key_bytes))
        },
        other => {
            panic!("Unknown encryption_backend: {}", other);
        }
    };
    

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
