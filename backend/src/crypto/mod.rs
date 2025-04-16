pub mod aes;
pub mod chacha;

pub trait CryptoStorage: Send + Sync {
    fn decrypt(&self, encrypted: &str) -> Option<String>;

    fn decrypt_if_needed(&self, input: &str) -> String {
        const PREFIX: &str = "enc:";
        if let Some(data) = input.strip_prefix(PREFIX) {
            self.decrypt(data).unwrap_or_else(|| {
                tracing::warn!("Failed to decrypt value with prefix, returning original");
                input.to_string()
            })
        } else {
            input.to_string()
        }
    }
}