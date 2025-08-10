# Evolve-Learn-Core

Evolve-Learn-Core is a modern, AI-powered e-learning platform designed to provide a personalized and interactive learning experience. It features a robust backend built with Python and FastAPI, and a sleek, responsive frontend using React and Shadcn UI.

## Features

*   **AI-Powered Learning:** Leverages various AI services (OpenAI, Anthropic, Google Generative AI) to provide intelligent tutoring, personalized learning paths, and content generation.
*   **Interactive Study Rooms:** Real-time collaborative study rooms using WebSockets for interactive learning.
*   **Graph-Based Knowledge Representation:** Uses Neo4j to model complex relationships between learning concepts, enabling advanced personalization.
*   **Text-to-Speech and Speech-to-Text:** Integrated with ElevenLabs and AssemblyAI for audio-based learning and interaction.
*   **Modern Frontend:** A beautiful and responsive user interface built with React, Shadcn UI, and Tailwind CSS.
*   **Comprehensive User Roles:** Supports different user roles such as students, teachers, and parents with dedicated dashboards and features.
*   **Quiz Engine:** A powerful quiz engine to create and manage assessments.

## Technologies Used

**Frontend:**

*   **Framework:** React with Vite
*   **UI:** Shadcn UI & Tailwind CSS
*   **Routing:** React Router DOM
*   **State Management:** React Query
*   **Forms:** React Hook Form & Zod
*   **Linting:** ESLint

**Backend:**

*   **Framework:** FastAPI
*   **Database:** PostgreSQL, Neo4j, Redis
*   **AI Services:** OpenAI, Anthropic, Google Generative AI, Cohere, Hugging Face
*   **Authentication:** JWT with `python-jose` and `passlib`
*   **Real-time Communication:** WebSockets & Socket.IO
*   **Text-to-Speech:** ElevenLabs
*   **Speech-to-Text:** AssemblyAI

## Getting Started

### Prerequisites

*   Node.js and npm
*   Python 3.11+ and pip
*   PostgreSQL
*   Neo4j
*   Redis

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/evolve-learn-core.git
    cd evolve-learn-core
    ```

2.  **Frontend Setup:**
    ```bash
    npm install
    ```

3.  **Backend Setup:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

4.  **Environment Variables:**
    Create a `.env` file in the `backend` directory by copying the `env.example` file. Populate it with your database credentials, AI service API keys, and other configuration.

### Running the Application

1.  **Backend:**
    ```bash
    cd backend
    uvicorn main:app --reload
    ```

2.  **Frontend:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:8080`.

## Project Structure

```
evolve-learn-core/
├── backend/            # FastAPI backend
│   ├── app/            # Application modules
│   ├── main.py         # FastAPI app entrypoint
│   └── requirements.txt # Python dependencies
├── src/                # React frontend
│   ├── app/            # Next.js style app directory
│   ├── components/     # Shared UI components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Library functions
│   ├── pages/          # Application pages
│   └── types/          # TypeScript types
├── docs/               # Project documentation
├── package.json        # Frontend dependencies
└── README.md           # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request