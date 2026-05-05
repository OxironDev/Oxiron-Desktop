# Oxiron Desktop - API Console Wrapper

Oxiron Desktop is a high-performance, native desktop application for managing your Oxiron API instances. Built with **Tauri** and **Rust**, it provides a secure and lightweight environment to interact with the Oxiron ecosystem.

## ✨ Features

- **Native Performance**: Extremely low memory footprint thanks to Rust and system-native webview.
- **Discord Auth Integration**: Seamless login flow optimized for desktop environments.
- **Secure Communication**: Implements advanced CSRF protection and origin-based security checks.
- **Multi-Platform**: Supports Windows (MSI/EXE) and Linux (Debian/AppImage).
- **Glassmorphic UI**: A modern, dark-themed interface designed for developers.

## 🛠 Prerequisites

To build this application from source, you need:
- [Node.js](https://nodejs.org/) (v16+)
- [Rust](https://www.rust-lang.org/tools/install)
- Windows: [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (Usually pre-installed on Win10/11)

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nuekkis/Oxiron-Desktop.git
   cd Oxiron-Desktop
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Development Mode**:
   ```bash
   npm run tauri dev
   ```

4. **Build Production Bundles**:
   ```bash
   npm run tauri build
   ```
   *The installers will be located in `src-tauri/target/release/bundle/`.*

## 📄 Configuration

The application is configured via `src-tauri/tauri.conf.json`. Ensure that the `oxirondev.com` domain is whitelisted in the CSP settings for production use.

## 🤝 Open Source

This repository contains the source code for the Oxiron Desktop wrapper. The internal API logic and server-side components are part of the Oxiron core and are not included in this open-source release.

## ⚖️ License

MIT License - feel free to use and contribute!
