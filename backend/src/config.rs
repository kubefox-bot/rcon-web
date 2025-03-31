use dotenvy::dotenv;
use std::env;
use std::net::SocketAddr;

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
        dotenv().ok();

        let auth_token = env::var("AUTH_TOKEN").unwrap_or_else(|_| "changeme".into());
        let host = env::var("HOST").unwrap_or_else(|_| "0.0.0.0".into());
        let port = env::var("PORT")
            .ok()
            .and_then(|v| v.parse::<u16>().ok())
            .unwrap_or(3000);

        let front_host = env::var("FRONT_HOST").unwrap_or_else(|_| "localhost".into());
        let front_port = env::var("FRONT_PORT")
            .ok()
            .and_then(|v| v.parse::<u16>().ok())
            .unwrap_or(3001);

        Self {
            auth_token,
            host,
            port,
            front_host,
            front_port,
        }
    }

    pub fn socket_addr(&self) -> SocketAddr {
        format!("{}:{}", self.host, self.port)
            .parse()
            .expect("Invalid HOST or PORT in .env")
    }

    /// Возвращает список разрешённых origin'ов для CORS
    pub fn frontend_origins(&self) -> Vec<String> {
        vec![
            format!("http://{}:{}", self.front_host, self.front_port),
            format!("http://localhost:{}", self.front_port),
            format!("http://127.0.0.1:{}", self.front_port),
        ]
    }
}
