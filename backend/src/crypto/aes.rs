use aes_gcm::aead::{Aead, KeyInit};
use aes_gcm::{Aes256Gcm, Nonce};
use aes_gcm::aead::generic_array::GenericArray;
use base64::{engine::general_purpose, Engine as _};


use super::CryptoStorage;

pub struct CryptoAesGcm {
    key: [u8; 32],
}

impl CryptoAesGcm {
    pub fn new(key: &str) -> Self {
        let mut key_arr = [0u8; 32];
        let key_bytes = key.as_bytes();
        let len = key_bytes.len().min(32);
        key_arr[..len].copy_from_slice(&key_bytes[..len]);
        Self { key: key_arr }
    }
}

impl CryptoStorage for CryptoAesGcm {
    fn decrypt(&self, encrypted: &str) -> Option<String> {
        let decoded = general_purpose::STANDARD.decode(encrypted).ok()?;
        if decoded.len() < 12 {
            tracing::error!("Encrypted input too short");
            return None;
        }

        let (nonce_bytes, ciphertext) = decoded.split_at(12);
        let key = GenericArray::from_slice(&self.key);
        let cipher = Aes256Gcm::new(key);
        let nonce = Nonce::from_slice(nonce_bytes);

        cipher.decrypt(nonce, ciphertext).ok().and_then(|bytes| String::from_utf8(bytes).ok())
    }
}