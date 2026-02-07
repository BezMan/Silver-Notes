# Silver Notes 📝

A premium, Google Keep-inspired note-taking application built with the MERN stack (MongoDB, Express, React, Node.js). It features a modern, dark-mode interface with masonry grid layout and rich interactions.

![Silver Notes Preview](https://via.placeholder.com/800x400?text=Silver+Notes+Preview)

## Features ✨

*   **Masonry Grid Layout**: Responsive note organization that adapts to screen size.
*   **Rich Note Creation**:
    *   **Colors**: Customize note backgrounds with a curated palette.
    *   **Checklists**: Create interactive to-do lists.
    *   **Smart Links**: URLs in content are automatically detected and clickable.
*   **Organization**:
    *   **Archiving**: Move notes out of the main view without deleting.
    *   **Search**: Real-time filtering by title or content.
    *   **Labels**: (Coming Soon) Tag your notes for easy categorization.
*   **Modern UI**: Smooth animations with Framer Motion and a sleek dark mode.

## Tech Stack 🛠️

*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide Icons.
*   **Backend**: Node.js, Express, MongoDB (Mongoose).
*   **Architecture**:
    *   **Client**: Feature-First structure (`src/features/notes`) for scalability.
    *   **Server**: MVC Pattern (`models`, `controllers`, `routes`) for clean separation of concerns.

## Getting Started 🚀

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Optional - the app includes an in-memory database fallback!)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/silver-notes.git
    cd silver-notes
    ```

2.  **Install Dependencies** (root script available soon, for now do manually):
    ```bash
    # Install Server dependencies
    cd server && npm install
    
    # Install Client dependencies
    cd ../client && npm install
    ```

### Running the App

You need two terminal windows:

**Terminal 1 (Server)**:
```bash
cd server
npm start
# Runs on Port 5001
```

**Terminal 2 (Client)**:
```bash
cd client
npm run dev
# Runs on Port 5173
```

Open [http://localhost:5173](http://localhost:5173) to view the app!

## License
MIT
