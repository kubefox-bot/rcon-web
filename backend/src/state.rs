use rcon::Connection;
use std::sync::Arc;
use tokio::net::TcpStream;
use tokio::sync::Mutex;

use crate::auth::jwt::JwtManager;
use crate::crypto::CryptoStorage;

#[derive(Clone)]
pub struct AppState {
    pub client: Arc<Mutex<Option<Connection<TcpStream>>>>,
    pub jwt: Arc<JwtManager>,
    pub last_issued: Arc<Mutex<Option<i64>>>,
    pub crypto: Arc<Box<dyn CryptoStorage>>,
}
