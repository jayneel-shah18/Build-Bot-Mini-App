# Build-Bot Mini App

A modern, responsive AI chatbot application built with React and TypeScript. Build-Bot provides an intuitive interface for interacting with multiple AI models, featuring real-time chat, conversation logging, and seamless integration.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.15-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple)

## Features

### Multi-Model AI Support

* GPT Models: GPT-3.5 Turbo, GPT-4, GPT-4o (Mock responses for demo)
* Mistral 7B: Real AI responses via OpenRouter API (Free tier available)
* Intelligent Fallback: Graceful degradation to mock responses on API failures

### Advanced Chat Interface

* Real-time Messaging: Instant message exchange with typing indicators
* Conversation Context: Maintains chat history for contextual responses
* Message Formatting: Supports multi-line messages with proper formatting
* Auto-scroll: Automatically scrolls to new messages
* Visual Differentiation: Distinct styling for user vs bot messages

### Configurable Bot Personality

* Custom Bot Names: Personalize your AI assistant
* Persona Configuration: Define bot behavior and response style
* Model Selection: Switch between different AI models on the fly
* Real-time Updates: Configuration changes apply immediately

### Activity Logging

* Conversation Tracking: Automatic logging of all interactions
* Timestamp Formatting: Human-readable timestamps (e.g., "10:24AM")
* Smart Truncation: Condensed view of questions and answers
* Recent History: Shows last 5 conversations with full details
* Collapsible Panel: Space-efficient expandable log viewer

## Getting Started

### Prerequisites

* Node.js (v16.0.0 or higher)
* npm or yarn package manager

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd buildbot-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Environment Configuration (Optional)

   For real Mistral 7B responses, create a `.env` file in the root directory:

   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

   Get your free API key: [https://openrouter.ai/keys](https://openrouter.ai/keys)

   Note: Mistral-7B via OpenRouter has rate limits on the free tier. For more reliability, you may upgrade your plan.

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open your browser

   Navigate to `http://localhost:5173/` (default Vite port)

## Tech Stack

### Frontend Framework

* React 18.3.1
* TypeScript 5.6.2
* Vite 6.0.1

### Styling & UI

* Tailwind CSS 3.4.15
* Custom Components
* Responsive Grid Layout

### State Management

* React Hooks
* Context API Ready

### API Integration

* OpenRouter API
* Axios/Fetch-based Service Layer

### Utilities

* dayjs – Lightweight date formatting
* Custom Helpers – Text truncation and formatting utilities

## Usage Guide

### Getting Started

1. Configure Your Bot: Set the bot's name, personality, and model in the left panel.
2. Start Chatting: Type messages into the chat input field and hit Send.
3. View Logs: Check the log panel for the most recent 5 interactions.

### Model Selection

* GPT Models: GPT-3.5, GPT-4, and GPT-4o return simulated responses.
* Mistral 7B: Returns real responses using OpenRouter's public API.

### Chat Features

* Send Messages: Press Enter or click the Send button
* Multi-line Input: Use Shift+Enter for line breaks
* Message Limits: Messages are limited to 1000 characters

### Configuration Management

* Bot Name: Customize your assistant's identity
* Persona: Define the assistant’s tone and style (e.g., “friendly science tutor”)
* Model: Dynamically switch between supported models
* Auto-save: Config changes apply immediately without refresh

## Future Improvements

* Persist chat logs using localStorage or IndexedDB
* Add Markdown rendering for richer responses
* Support downloading full conversation history
* Enhanced mobile responsiveness
* Add streaming responses using Server-Sent Events (SSE) or WebSockets

### Attributions

Favicon: [Chatbot icons](https://www.flaticon.com/free-icons/chatbot) created by Freepik — [Flaticon](https://www.flaticon.com)