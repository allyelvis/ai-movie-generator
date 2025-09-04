# aenzbi - AI Movie Portfolio Generator

An AI-powered application by aenzbi that generates a portfolio of fictional movies based on user-provided themes, styled with a high-tech, NVIDIA-inspired aesthetic. Enter a theme, genre, or concept, and let AI create a unique movie collection for you.

## Features

-   **AI-Powered Movie Generation:** Leverages the Google Gemini API to generate a curated list of fictional movies, complete with titles, release years, and compelling synopses.
-   **Dynamic Portfolio:** Enter any theme (e.g., "cyberpunk noir," "steampunk fantasy," "underwater westerns") to get a unique set of 6 movies.
-   **Wallet Integration:** Connect your Ethereum wallet (e.g., MetaMask) to the application for a more immersive, Web3-inspired experience.
-   **Interactive UI:** Browse the generated movie cards and "watch" a placeholder trailer for each film.
-   **Responsive Design:** A sleek, modern interface that works seamlessly across desktop and mobile devices.
-   **High-Tech Aesthetic:** Inspired by NVIDIA's design language, featuring glowing green accents, futuristic fonts, and a dark, immersive theme.

## Tech Stack

-   **Frontend:** React, TypeScript
-   **AI Model:** Google Gemini (`gemini-2.5-flash`) via the `@google/genai` SDK
-   **Styling:** Tailwind CSS
-   **Fonts:** Orbitron, Share Tech Mono (from Google Fonts)
-   **Web3:** Interacts with browser wallet extensions via `window.ethereum`.

## Getting Started

### Prerequisites

-   A modern web browser with a wallet extension like MetaMask.
-   A valid Google Gemini API key.

### Running the Application

1.  **Set up the API Key:** This application requires a Google Gemini API key to be available as an environment variable named `API_KEY`. Ensure this is configured in your deployment environment.

2.  **Serve the files:** Serve the project's root directory using a simple local web server. For example, using Python:

    ```bash
    python -m http.server
    ```

    Or using Node.js with `serve`:

    ```bash
    npx serve .
    ```

3.  **Open in browser:** Navigate to the local server's address (e.g., `http://localhost:8000` or `http://localhost:3000`) in your web browser.

## Project Structure

```
.
├── components/           # React components
│   ├── icons/            # SVG icon components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   ├── MoviePlayerModal.tsx
│   ├── SearchBar.tsx
│   ├── WalletConnectButton.tsx
│   └── WelcomeMessage.tsx
├── services/             # Services for external APIs
│   └── geminiService.ts  # Logic for interacting with the Gemini API
├── App.tsx               # Main application component
├── index.html            # Entry point HTML
├── index.tsx             # React root renderer
├── metadata.json         # Application metadata
└── types.ts              # TypeScript type definitions
```