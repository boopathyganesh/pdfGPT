# AI Document Q&A App - Frontend

This is the frontend for the Document Q&A application, built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Zustand**. It communicates with a FastAPI backend over **WebSocket** for real-time chat functionality and document-based question answering.

## Features

- Upload PDF documents
- Ask questions in natural language
- Receive streamed AI answers in real-time via WebSocket
- Markdown rendering of responses
- Typing effect for AI messages

## Technologies Used

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- WebSocket (for real-time communication)
- React Markdown (for rendering rich answers)

## Setup Instructions

```bash
cd frontend
npm install
```

## Run Locally

```bash

npm run dev

```

## Environment Variables

NEXT_PUBLIC_BACKEND_URL=http://localhost:8000


## Frontend Folder Structure
```
frontend/
├── app/
│   ├── page.tsx          # Main chat page
│   └── layout.tsx        # Root layout
├── components/
│   └── Chat.tsx          # Chat UI and logic
├── store/
│   └── ChatStore.ts      # Zustand store for messages and WebSocket
├── styles/
│   └── globals.css       # Global Tailwind and base styles
```
