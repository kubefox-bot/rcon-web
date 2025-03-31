use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

use crate::state::AppState;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub iat: usize,
}

#[derive(Debug, Clone)]
pub struct JwtManager {
    secret: String,
    ttl_hours: i64,
}

impl JwtManager {
    pub fn new(secret: impl Into<String>) -> Self {
        Self {
            secret: secret.into(),
            ttl_hours: 24, // default
        }
    }

    pub fn secret(&self) -> &str{
          &self.secret
    }


    pub fn create(&self, user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
        let exp = (Utc::now() + Duration::hours(self.ttl_hours)).timestamp() as usize;
        let iat = Utc::now().timestamp() as usize;
        let claims = Claims {
            sub: user_id.to_string(),
            exp,
            iat
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )
    }

    pub fn decode(&self, token: &str) -> Option<Claims> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .ok()
    }

    pub async fn issue(&self, user_id: &str, state: &AppState) -> Result<String, jsonwebtoken::errors::Error> {
        let now = Utc::now().timestamp() as usize;
        let exp = (Utc::now() + Duration::hours(self.ttl_hours)).timestamp() as usize;

        let claims = Claims {
            sub: user_id.to_string(),
            iat: now,
            exp,
        };

        *state.last_issued.lock().await = Some(now as i64);

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )
    }
}
