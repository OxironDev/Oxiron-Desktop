// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;


// Learn more about Tauri commands at https://v1.tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_discord_login(app_handle: tauri::AppHandle, url: String) {
    // If window already exists, just focus it
    if let Some(win) = app_handle.get_window("discord-login") {
        let _ = win.set_focus();
        return;
    }

    let _window = tauri::WindowBuilder::new(
        &app_handle,
        "discord-login",
        tauri::WindowUrl::External(url.parse().unwrap()),
    )
    .title("Discord Login")
    .inner_size(600.0, 800.0)
    .center()
    .resizable(true)
    .always_on_top(true)
    // Use a modern browser user agent to avoid being blocked by Discord/OAuth providers
    .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
    .build()
    .unwrap();
}

#[tauri::command]
fn notify_auth_success(window: tauri::Window, app_handle: tauri::AppHandle, payload: serde_json::Value) {
    let _ = app_handle.emit_all("login-complete", payload);
    let _ = window.close();
}

fn main() {
    tauri::Builder::default()
        /*.on_page_load(|win, payload| {
            let url = payload.url().to_string();
            let label = win.label().to_string();
            
            // If the popup window reaches the console or register page, it means login is done
            if label == "discord-login" && (url.contains("localhost:5173/console") || url.contains("localhost:5173/auth/register")) {
                // Determine payload
                let event_payload = if url.contains("token=") {
                    let parts: Vec<&str> = url.split("token=").collect();
                    let token = parts.get(1).unwrap_or(&"").split("&").next().unwrap_or("");
                    serde_json::json!({ "token": token, "type": "register" })
                } else {
                    serde_json::json!({ "type": "login" })
                };

                // Emit event to all windows
                let _ = win.emit_all("login-complete", event_payload);
                
                // Close the window asynchronously to avoid blocking the current thread/webview
                let win_clone = win.clone();
                tauri::async_runtime::spawn(async move {
                    let _ = win_clone.close();
                });
            }
        })*/
        .setup(|_app| {
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, notify_auth_success, open_discord_login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
