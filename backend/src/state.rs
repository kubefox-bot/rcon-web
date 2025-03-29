use std::sync::Arc;
use tokio::sync::Mutex;
use rcon::Connection;
use tokio::net::TcpStream;

#[derive(Clone)]
pub struct AppState {
    pub client: Arc<Mutex<Option<Connection<TcpStream>>>>,
    pub auth_token: String,
}
