use dotenvy::dotenv;
use std::{env, net::SocketAddr};

#[derive(Debug, Clone)]
pub struct Config {
    pub auth_token: String,
    pub port: u16,
    pub encryption_key: String,
    pub encryption_backend: String,
}

impl Config {
    pub fn from_env() -> Self {
        let _ = dotenv();

        Self {
            auth_token: get_env("AUTH_TOKEN", "changeme"),
            port: get_env_parse("PORT", 3000),
            encryption_key: get_env("ENCRYPTION_KEY", "12345678901234567890123456789012"),
            encryption_backend: get_env("ENCRYPTION_METHOD", "chacha"),
        }
    }

    pub fn socket_addr(&self) -> SocketAddr {
        format!("0.0.0.0:{}", self.port)
            .parse()
            .expect("Invalid HOST or PORT in .env")
    }
}

fn get_env(key: &str, default: &str) -> String {
    env::var(key)
        .map(|v| v.trim().to_owned())
        .unwrap_or_else(|_| default.to_owned())
}

fn get_env_parse<T: std::str::FromStr>(key: &str, default: T) -> T {
    env::var(key)
        .ok()
        .and_then(|v| v.trim().parse::<T>().ok())
        .unwrap_or(default)
}
