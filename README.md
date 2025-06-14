# Bug Tracker

A simple bug tracking web application built with React.js, Vite, and Tailwind CSS.

## Features
- User authentication (role-based: developer, manager)
- Dashboard for viewing and managing tasks/bugs
- Task creation, editing, and filtering
- Trend visualization with charts (Recharts)
- Responsive and modern UI using Tailwind CSS

## Technology Stack
- **Frontend:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API (for authentication and user state)
- **Charts:** Recharts

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd Bug_Tracker
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Project Locally
1. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```
2. Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).

### Building for Production
```sh
npm run build
# or
yarn build
```

### Preview Production Build
```sh
npm run preview
# or
yarn preview
```

## Assumptions
- Authentication is handled in-memory (no backend integration).
- Dummy data is used for tasks/bugs; no persistent storage.
- Roles are limited to 'developer' and 'manager'.

## Highlights & Areas to Note
- Uses React Context for simple state management (authentication/user info).
- Tailwind CSS is used for rapid, utility-first styling.
- The dashboard includes a chart for visualizing bug trends.
- The codebase is modular, with components for forms, lists, and pages.

## Customization
- To connect to a real backend, update the authentication and task service logic.
- You can extend the UI and add more features as needed.

