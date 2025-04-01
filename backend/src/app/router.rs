use crate::{
    auth::{self, middleware::auth_middleware},
    handlers::rcon,
    state::AppState,
};
use axum::{Extension, Router, middleware::from_fn_with_state, routing::post};

use super::cors::build_cors;

pub fn build_router(state: AppState) -> Router {
    let protected = Router::new()
        .route("/rcon", post(rcon))
        .layer(from_fn_with_state(state.clone(), auth_middleware));

    Router::new()
        .merge(auth::routes())
        .merge(protected)
        .layer(Extension(state.clone()))
        .layer(build_cors(&state.config))
        .with_state(state)
}
