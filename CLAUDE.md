# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with auto-fix
- `npm run prettier` - Run Prettier formatting
- `npm run style` - Run Stylelint for SCSS files
- `npm run tailwindcss` - Generate Tailwind CSS

## Code Architecture

This is a **Vite + React + TypeScript** project with:

- **UI Framework**: Ant Design with Pro Components
- **State Management**: Zustand
- **Styling**: Tailwind CSS + SCSS + PostCSS
- **Internationalization**: i18next
- **Routing**: React Router v6
- **Build Tool**: Vite with extensive plugin ecosystem
- **Code Quality**: ESLint, Prettier, Stylelint, Commitlint

## Key Features

- Micro-frontend architecture with Wujie
- PWA support with Vite PWA plugin
- Auto-imports with unplugin-auto-import
- Component library resolver for Ant Design
- Image optimization with vite-plugin-imagemin
- CDN imports for external libraries
- Code inspector for development

## Project Structure

- `src/` - Main source code
  - `app.tsx` - Root application component
  - `main.tsx` - Application entry point
  - `layout/` - Layout components
  - `component/` - Reusable components
  - `pages/` - Page components
  - `utils/` - Utility functions
  - `hook/` - Custom React hooks
  - `api/` - API layer
  - `locale/` - Internationalization
  - `route/` - Routing configuration

## Development Notes

- Uses environment variables with `VITE_` prefix
- Includes Husky git hooks for pre-commit linting
- Supports SCSS modules and Tailwind CSS
- Has microservice integration capabilities
- Includes PWA functionality for offline support