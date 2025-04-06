use axum::{Router, http::Request};
use std::time::{SystemTime, UNIX_EPOCH};
use tower_http::trace::TraceLayer;
use tracing::Span;
use tracing_subscriber::{EnvFilter, fmt, prelude::*};
pub struct Observability;

impl Observability {
    pub fn init() {
        tracing_subscriber::registry()
            .with(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
            .with(fmt::layer().pretty())
            .try_init()
            .expect("Failed to initialize tracing");
    }

    pub fn apply(router: Router) -> Router {
        router.layer(TraceLayer::new_for_http().make_span_with(Self::make_span))
    }

    fn generate() -> String {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default();

        let millis = now.as_millis();
        let nanos = now.as_nanos();

        let hash = (millis ^ nanos) as u64;

        format!("req_{:x}{:x}", millis, hash)
    }

    fn make_span<B>(req: &Request<B>) -> Span {
        let request_id = Self::generate();
        let method = req.method().as_str();
        let uri = req.uri().to_string();
        let client_ip = req
            .headers()
            .get("x-real-ip")
            .or_else(|| req.headers().get("x-forwarded-for"))
            .and_then(|v| v.to_str().ok())
            .unwrap_or("unknown");

        let user_id = req
            .extensions()
            .get::<String>().cloned()
            .unwrap_or_else(|| "unauthenticated".into());

        tracing::info_span!(
            "http_request",
            request_id = %request_id,
            user_id = %user_id,
            method,
            uri,
            client_ip,
        )
    }
}
