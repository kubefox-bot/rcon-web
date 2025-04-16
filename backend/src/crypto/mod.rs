pub mod chacha;

pub trait CryptoStorage: Send + Sync {
    fn decrypt(&self, encrypted: &str) -> Option<String>;
}
