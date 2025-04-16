use chacha20poly1305::{ChaCha20Poly1305, Key, Nonce};
use chacha20poly1305::aead::{Aead, KeyInit};
use base64::{engine::general_purpose, Engine as _};



use super::CryptoStorage;

pub struct CryptoChaCha20 {
    key: [u8; 32],
}

impl CryptoChaCha20 {
    pub fn new(key: &[u8]) -> Self {
        let mut key_arr = [0u8; 32];
        let len = key.len().min(32);
        key_arr[..len].copy_from_slice(&key[..len]);
        Self { key: key_arr }
    }
}

impl CryptoStorage for CryptoChaCha20 {

    fn decrypt(&self, encrypted: &str) -> Option<String> {
        let decoded = general_purpose::STANDARD.decode(encrypted).ok()?;
        if decoded.len() < 12 {
            tracing::error!("ChaCha encrypted input too short");
            return None;
        }

        let (nonce_bytes, ciphertext) = decoded.split_at(12);
        let key = Key::from_slice(&self.key);
        let cipher = ChaCha20Poly1305::new(key);
        let nonce = Nonce::from_slice(nonce_bytes);

        cipher.decrypt(nonce, ciphertext).ok().and_then(|bytes| String::from_utf8(bytes).ok())
    }
}