use pulldown_cmark::{Parser, Options, html};
use wasm_bindgen::prelude::*;

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}

#[wasm_bindgen]
pub fn md_to_html(md: &str) -> Result<String, JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    let parser = Parser::new_ext(md, Options::ENABLE_STRIKETHROUGH);
    
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    Ok(html_output)
}
