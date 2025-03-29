use dotenvy::dotenv;
use std::net::SocketAddr;
use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub auth_token: String,
    pub host: String,
    pub port: u16,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv().ok();

        let auth_token = env::var("AUTH_TOKEN").unwrap_or_else(|_| "changeme".into());
        let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".into());
        let port = env::var("PORT")
            .ok()
            .and_then(|v| v.parse::<u16>().ok())
            .unwrap_or(3000);

        Self {
            auth_token,
            host,
            port,
        }
    }

    pub fn socket_addr(&self) -> SocketAddr {
        format!("0.0.0.0:{}", self.port)
            .parse()
            .expect("Invalid HOST or PORT in .env")
    }
}
