use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use serde::{Serialize, Deserialize};
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
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

    pub fn with_ttl(mut self, hours: i64) -> Self {
        self.ttl_hours = hours;
        self
    }

    pub fn encode(&self, user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
        let exp = (Utc::now() + Duration::hours(self.ttl_hours)).timestamp() as usize;
        let claims = Claims {
            sub: user_id.to_string(),
            exp,
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
}
