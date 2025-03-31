use axum::{Router, middleware::from_fn_with_state, routing::post, Extension};
use crate::{

    auth::{self, middleware::auth_middleware}, handlers::rcon, state::AppState
};

use super::cors::build_cors;

pub fn build_router(state: AppState) -> Router {
    Router::new()
        .merge(auth::routes())
        .route("/rcon", post(rcon))
        .layer(from_fn_with_state(state.clone(), auth_middleware))
        .layer(Extension(state.clone())) // обязательно для middleware
        .layer(build_cors(&state.config))
        .with_state(state)
}