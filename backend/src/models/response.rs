use axum::Json;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub status: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn ok(data: T) -> Response {
        Json(ApiResponse {
            status: "ok",
            message: None,
            data: Some(data),
        })
        .into_response()
    }

    pub fn with_message_and_data(message: &str, data: Option<T>) -> Response {
        Json(ApiResponse {
            status: "ok",
            message: Some(message.to_string()),
            data: Some(data),
        })
        .into_response()
    }

    pub fn error(message: &str, code: StatusCode) -> Response {
        (
            code,
            Json(ApiResponse::<()> {
                status: "error",
                message: Some(message.to_string()),
                data: None,
            }),
        )
            .into_response()
    }
}
