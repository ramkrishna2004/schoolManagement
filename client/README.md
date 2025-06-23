# Student Management System - Frontend

This is the frontend application for the Student Management System, built with React and Tailwind CSS.

## Features

- User authentication (login/register)
- Role-based access control (admin, teacher, student)
- Test management
- Score tracking
- Class management
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── contexts/       # React contexts
  ├── pages/         # Page components
  │   ├── teacher/   # Teacher-specific pages
  │   └── student/   # Student-specific pages
  ├── App.js         # Main application component
  └── index.js       # Application entry point
```

## Technologies Used

- React
- React Router
- Tailwind CSS
- Axios
- ESLint
- PostCSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 