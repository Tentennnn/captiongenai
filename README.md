<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # Caption Generator AI

  <p>
    <a href="https://github.com/Tentennnn/captiongenai/blob/master/LICENSE" target="_blank">
      <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    </a>
    <a href="https://github.com/Tentennnn/captiongenai/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/Tentennnn/captiongenai?color=red" />
    </a>
    <a href="https://github.com/Tentennnn/captiongenai/stargazers">
      <img alt="Stargazers" src="https://img.shields.io/github/stars/Tentennnn/captiongenai?color=blue" />
    </a>
  </p>

  > An AI-powered caption generator that creates engaging captions for your social media posts.

  <br />

  <a href="YOUR_LIVE_DEMO_URL_HERE" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel" />
  </a>
</div>

## 🚀 About The Project

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdownshields.com for these.
*** If you want to customize them, go to https://www.markdownguide.org/extended-syntax/#tables
-->

[![React][React.js]][React-url]
[![Vite][Vite.js]][Vite-url]
[![TypeScript][TypeScript.js]][TypeScript-url]
[![Supabase][Supabase.io]][Supabase-url]
[![Gemini AI][Gemini-url.com]][Gemini-url]

Caption Generator AI is a web application that leverages the power of Google's Gemini AI to generate creative and engaging captions for your images. Simply upload your image, select your desired platform, and let the AI do the rest.

![Project GIF](YOUR_GIF_URL_HERE)

### ✨ Features

-   **🤖 AI-Powered Captions**: Generate high-quality captions in seconds.
-   **📱 Platform Selection**: Tailor your captions for different social media platforms.
-   **🖼️ Image Upload**: Easily upload your images to generate captions for.
-   **💰 Donation Support**: Support the project through a QR code donation.

## 🛠️ Built With

This project is built with a modern tech stack, including:

| Technology | Description |
|---|---|
| **React** | A JavaScript library for building user interfaces. |
| **Vite** | A next-generation front-end tooling for faster and leaner development. |
| **TypeScript** | A typed superset of JavaScript that compiles to plain JavaScript. |
| **Supabase** | An open source Firebase alternative for building secure and scalable backends. |
| **Google Gemini AI** | A family of generative AI models that makes it easy to build generative AI applications. |
| **Tailwind CSS** | A utility-first CSS framework for rapid UI development. |

## 📂 Project Structure

```
.
├── assets
│   └── qr-code.svg
├── components
│   ├── Footer.tsx
│   ├── icons.tsx
│   ├── LandingPage.tsx
│   ├── LoadingAnimation.tsx
│   ├── ParticleBackground.tsx
│   ├── PlatformSelector.tsx
│   └── ResultCard.tsx
├── contexts
│   └── UserContext.tsx
├── pages
│   ├── DonationPage.tsx
│   └── GeneratorPage.tsx
├── services
│   ├── geminiService.ts
│   └── supabaseClient.ts
├── App.tsx
├── index.html
├── index.tsx
├── package.json
├── README.md
└── tailwind.config.js
```

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18.x or later)
-   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/Tentennnn/captiongenai.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY='YOUR_API_KEY'
    ```
4.  Run the app
    ```sh
    npm run dev
    ```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

We encourage you to read our [Contributing Guidelines](CONTRIBUTING.md) and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 💖 Acknowledgments

- [Img Shields](https://shields.io)
- [Font Awesome](https://fontawesome.com)
- [React Icons](https://react-icons.github.io/react-icons)

## 📧 Contact

Project Link: [https://github.com/Tentennnn/captiongenai](https://github.com/Tentennnn/captiongenai)

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[TypeScript.js]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Supabase.io]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.io/
[Gemini-url.com]: https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white
[Gemini-url]: https://gemini.google.com/
