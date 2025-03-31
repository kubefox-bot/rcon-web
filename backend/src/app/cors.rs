use axum::http::{header::{AUTHORIZATION, CONTENT_TYPE}, HeaderValue, Method};
use tower_http::cors::CorsLayer;
use crate::config::Config;

pub fn build_cors(config: &Config) -> CorsLayer {
    let allowed_origins = config
        .frontend_origins()
        .into_iter()
        .filter_map(|origin| origin.parse::<HeaderValue>().ok())
        .collect::<Vec<_>>();

    CorsLayer::new()
        .allow_origin(allowed_origins)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([AUTHORIZATION, CONTENT_TYPE])
        .allow_credentials(true)
}
