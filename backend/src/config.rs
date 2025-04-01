use dotenvy::dotenv;
use std::{env, net::SocketAddr};

#[derive(Debug, Clone)]
pub struct Config {
    pub auth_token: String,
    pub host: String,
    pub port: u16,
    pub front_host: String,
    pub front_port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        let _ = dotenv();

        Self {
            auth_token: get_env("AUTH_TOKEN", "changeme"),
            host: get_env("HOST", "0.0.0.0"),
            port: get_env_parse("PORT", 3000),
            front_host: get_env("FRONT_HOST", "localhost"),
            front_port: get_env_parse("FRONT_PORT", 3001),
        }
    }

    pub fn socket_addr(&self) -> SocketAddr {
        format!("0.0.0.0:{}", self.port)
            .parse()
            .expect("Invalid HOST or PORT in .env")
    }

    pub fn frontend_origins(&self) -> Vec<String> {
        let base = &self.front_host;
        let port = self.front_port;

        vec![
            format!("http://{}:{}", base, port),
            format!("https://{}:{}", base, port),
            format!("http://localhost:{}", port),
            format!("http://127.0.0.1:{}", port),
        ]
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
