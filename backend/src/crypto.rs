use aes_gcm::aead::generic_array::GenericArray;
use aes_gcm::aead::{Aead, KeyInit};
use aes_gcm::{Aes256Gcm, Nonce};
use base64::{Engine as _, engine::general_purpose};

pub struct Crypto {
    key: [u8; 32],
}

impl Crypto {
    pub fn new(key: &str) -> Self {
        let bytes = key.as_bytes();
        let mut key_arr = [0u8; 32];
        key_arr.copy_from_slice(bytes);
        Self { key: key_arr }
    }

    pub fn decrypt_if_needed(&self, input: &str) -> String {
        const PREFIX: &str = "enc:";

        if let Some(without_prefix) = input.strip_prefix(PREFIX) {
            match self.decrypt(without_prefix) {
                Some(decrypted) => decrypted,
                None => {
                    tracing::warn!("Failed to decrypt input with prefix, fallback to original");
                    input.to_string()
                }
            }
        } else {
            input.to_string()
        }
    }

    pub fn decrypt(&self, encrypted: &str) -> Option<String> {
        let decoded = general_purpose::STANDARD.decode(encrypted).ok()?;
        if decoded.len() < 13 {
            tracing::error!("Encrypted input too short");
            return None;
        }

        let (iv, ciphertext) = decoded.split_at(12);
        let key = GenericArray::from_slice(&self.key);
        let cipher = Aes256Gcm::new(key);
        let nonce = Nonce::from_slice(iv);

        cipher
            .decrypt(nonce, ciphertext)
            .ok()
            .and_then(|bytes| String::from_utf8(bytes).ok())
    }
}
