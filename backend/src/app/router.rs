use axum::{Router, middleware::from_fn_with_state, Extension};
use crate::{
    auth::{self, middleware::auth_middleware},
    handlers::routes::routes,
    state::AppState,
};
use super::cors::build_cors;

pub fn build_router(state: AppState) -> Router {
    Router::new()
        .merge(auth::routes())
        .merge(
            routes()
                .layer(from_fn_with_state(state.clone(), auth_middleware))
                .layer(Extension(state.clone())), 
        )
        .layer(build_cors(&state.config))
        .with_state(state)
}
