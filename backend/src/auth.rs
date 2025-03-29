use axum::http::HeaderMap;
use axum::http::header::AUTHORIZATION;

pub fn check_auth(headers: &HeaderMap, expected_token: &str) -> bool {
    headers
        .get(AUTHORIZATION)
        .and_then(|val| val.to_str().ok())
        .map(|val| val == format!("Bearer {}", expected_token))
        .unwrap_or(false)
}
