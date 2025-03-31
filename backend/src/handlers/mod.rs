mod command;
mod connect;
mod disconnect;

use crate::{models::request::RconRequest, state::AppState};
use axum::{
    extract::{Json, State},
    response::Response,
};

pub async fn rcon(State(state): State<AppState>, Json(payload): Json<RconRequest>) -> Response {
    match payload {
        RconRequest::Connect {
            host,
            port,
            password,
        } => connect::handle_connect(host, port, password, state).await,

        RconRequest::Command { command } => command::handle_command(command, state).await,

        RconRequest::Disconnect => disconnect::handle_disconnect(state).await,
    }
}
