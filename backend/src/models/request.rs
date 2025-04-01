use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(tag = "action", rename_all = "lowercase")]
pub enum RconRequest {
    Connect {
        host: String,
        port: u16,
        password: String,
    },
    Command {
        command: String,
    },
    Disconnect,
}
