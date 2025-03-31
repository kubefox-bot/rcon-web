use std::sync::Arc;
use tokio::sync::Mutex;
use rcon::Connection;
use tokio::net::TcpStream;

use crate::{auth::jwt::JwtManager, config::Config};


#[derive(Clone)]
pub struct AppState {
    pub client: Arc<Mutex<Option<Connection<TcpStream>>>>,
    pub jwt: Arc<JwtManager>,
    pub config: Arc<Config>
}
