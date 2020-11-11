mod bytebuf;
mod utils;
mod woff;

use wasm_bindgen::prelude::{wasm_bindgen,JsValue};

use woff::ttf_to_woff;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn generate_woff(ttf: &[u8]) -> Result<ByteStream, JsValue> {
    utils::set_panic_hook();
    
    let woff = match ttf_to_woff(&ttf) {
        Ok(vec) => vec,
        Err(e) => return Err(JsValue::from_str(e.as_str()))
    };

    return Ok(ByteStream::new(&woff));
}

#[wasm_bindgen]
pub struct ByteStream {
    offset: *const u8,
    size: usize,
}

#[wasm_bindgen]
impl ByteStream {
    fn new(bytes: &[u8]) -> ByteStream {
        return ByteStream {
            offset: bytes.as_ptr(),
            size: bytes.len(),
        };
    }

    pub fn offset(&self) -> *const u8 {
        return self.offset;
    }

    pub fn size(&self) -> usize {
        return self.size;
    }
}
