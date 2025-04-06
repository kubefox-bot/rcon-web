use crate::observability::Observability;
use crate::{
    auth::{self, middleware::auth_middleware},
    handlers::rcon,
    state::AppState,
};
use axum::routing::get;
use axum::{Extension, Router, middleware::from_fn_with_state, routing::post};
use tower_http::trace::TraceLayer;
pub fn build_router(state: AppState) -> Router {
    let protected = Router::new()
        .route("/rcon", post(rcon))
        .layer(from_fn_with_state(state.clone(), auth_middleware));

    let api_routes = Router::new()
        .route("/health", get(|| async { "OK" }))
        .merge(auth::routes())
        .merge(protected);

    let common_router = Router::new()
        .nest("/api", api_routes)
        .layer(Extension(state.clone()))
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    Observability::apply(common_router)
}
