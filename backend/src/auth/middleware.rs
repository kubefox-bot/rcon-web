use axum::{
    body::Body,
    extract::Extension,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};

use crate::state::AppState;

pub async fn auth_middleware(
    Extension(state): Extension<AppState>,
    req: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "));

    match token {
        Some(t) => {
            if let Some(claims) = state.jwt.decode(t) {
                let last = state.last_issued.lock().await;
                let iat = claims.iat as i64;
                if let Some(revoked_after) = *last {
                    if iat < revoked_after {
                        return Err(StatusCode::UNAUTHORIZED);
                    }
                }
                Ok(next.run(req).await)
            } else {
                Err(StatusCode::UNAUTHORIZED)
            }
        }
        None => Err(StatusCode::UNAUTHORIZED),
    }
}

