# Writer's Ecosystem

Writer's Ecosystem is a modern, full-featured web application designed to be a one-stop platform for writers. It provides a suite of tools to help writers create, share, and monetize their work, engage with a community, and find writing-related opportunities.

## ✨ Features

- **📝 Rich Text Editor**: A powerful and intuitive Tiptap-based editor for writing articles.
- **👤 User Authentication**: Secure user sign-up and login functionality powered by Supabase Auth.
- **📚 Article Management**: Create, edit, publish, and manage your articles.
- **👥 Social Networking**: Follow other writers and see their latest work in a personalized feed.
- **💼 Job Portal**: A dedicated section for finding and posting writing gigs.
- **🏆 Writing Competitions**: Participate in competitions, submit articles, and climb the leaderboard.
- **📖 Ebook Publishing**: A hub for publishing and showcasing ebooks.
- **🔔 Notifications**: Stay updated with real-time notifications.
- **📱 Responsive Design**: A beautiful and responsive UI built with Tailwind CSS and shadcn/ui.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Linting**: [ESLint](https://eslint.org/)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or newer recommended)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)
- A [Supabase](https://supabase.io/) account to set up the backend.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/writers_ecosystem.git
    cd writers_ecosystem
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Supabase project credentials. You can find these in your Supabase project's dashboard under `Project Settings > API`.

    ```env
    # .env

    VITE_SUPABASE_URL="your-supabase-project-url"
    VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
    ```

### Running the Application

1.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

2.  **Build for production:**
    ```sh
    npm run build
    ```
    This command bundles the application into the `dist/` directory for deployment.

3.  **Lint the project:**
    ```sh
    npm run lint
    ```
    This command runs ESLint to check for code quality and style issues.

## 📁 Project Structure

The project follows a standard React application structure:

```
/src
├── assets/         # Static assets like images and logos
├── components/     # Reusable UI components (shadcn/ui and custom)
├── context/        # React Context providers for global state
├── hooks/          # Custom React hooks
├── lib/            # Core logic, API calls, and Supabase client
├── pages/          # Top-level page components
├── routes/         # Routing configuration and protected routes
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

---

Happy writing!
