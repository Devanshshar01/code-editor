# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Essential Commands

### Development
```bash
npm run dev              # Start Vite dev server on port 5173
npm run build            # Type-check and build for production
npm run preview          # Preview production build locally
```

### Code Quality
```bash
npm run type-check       # Run TypeScript type checking (no emit)
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Testing
```bash
npm run test             # Run unit tests with Vitest
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Run tests with coverage report
npm run test:e2e         # Run E2E tests with Playwright
```

## Architecture Overview

### Project Type
Production-grade real-time collaborative code editor (VS Code clone) built with React 19, TypeScript, and Monaco Editor. Currently frontend-only with planned backend integration.

### Tech Stack
- **Build Tool**: Vite (using rolldown-vite@7.1.14)
- **UI Framework**: React 19.1 with TypeScript strict mode
- **Editor**: Monaco Editor (VS Code engine)
- **Styling**: TailwindCSS 4.x with PostCSS
- **State Management**: Zustand (global state) + React Query (server state)
- **Real-Time**: Socket.io-client (WebSocket) + Yjs (CRDT for conflict resolution)
- **Testing**: Vitest (unit) + Playwright (E2E) + Testing Library
- **Code Quality**: ESLint 9 + Prettier + TypeScript strict

### Architecture Pattern: Feature-Based + Atomic Design

The codebase follows **domain-driven design** with features organized by domain:

```
src/
├── features/              # Domain-driven feature modules
│   ├── auth/             # Authentication (Login, JWT tokens)
│   ├── editor/           # Code Editor with Monaco integration
│   ├── collaboration/    # Real-time features (cursors, presence)
│   └── files/            # File management & explorer
└── shared/
    ├── components/       # Atomic design hierarchy
    │   ├── atoms/       # Button, Input, Spinner, Badge
    │   ├── molecules/   # FormField, SearchBar, UserCard
    │   └── organisms/   # Header, FileExplorer, TabBar, StatusBar
    ├── hooks/           # Custom React hooks (useDebounce, useThrottle, useAutoSave)
    ├── services/        # API & WebSocket services
    ├── stores/          # Zustand stores (Auth, Editor, Collaboration)
    ├── types/           # TypeScript interfaces
    └── utils/           # Helper functions
```

### Key Design Patterns
- **Atomic Design**: Components organized as atoms → molecules → organisms → templates → pages
- **Feature Slices**: Each feature is self-contained with its own components, hooks, services, types
- **Service Layer**: Centralized API service with Axios interceptors (token refresh, retry logic)
- **Observer Pattern**: WebSocket event system for real-time collaboration
- **CRDT**: Yjs for conflict-free collaborative editing

### State Management Strategy

**Global State (Zustand)**
- `AuthStore`: User authentication, JWT tokens, profile data
- `EditorStore`: Current file, open tabs, editor settings, UI state
- `CollaborationStore`: Active session, connected users, cursor positions

**Server State (React Query)**
- API data fetching with caching (staleTime configuration)
- Automatic background refetching
- Optimistic updates

**Local State (useState/useReducer)**
- Component-specific UI state and form inputs

### Real-Time Collaboration Flow

1. User types → Editor onChange (debounced 100ms)
2. WebSocket emit → CONTENT_CHANGE event
3. Server broadcasts to other clients
4. Clients receive → Yjs CRDT merge
5. Monaco Editor updates (no "last write wins" conflicts)

Cursor positions sync via throttled events (100ms) with similar flow.

## File Persistence & Data Storage

**Current Implementation**: localStorage for browser-based persistence
**Planned**: PostgreSQL database with REST API + WebSocket server

## Performance Optimizations

- **Auto-save**: 3-second debounce to reduce writes
- **Cursor Updates**: 100ms throttle to reduce WebSocket traffic
- **Code Splitting**: Lazy loading setup ready for large features
- **Monaco Virtualization**: Built-in for large files
- **React.memo**: Used for expensive components to prevent re-renders

## Security Architecture

- **Authentication**: JWT access tokens (15 min) + refresh tokens (7 days)
- **Token Storage**: httpOnly cookies pattern (not localStorage for production)
- **Input Validation**: Client-side for UX, server-side for security
- **TypeScript Strict Mode**: No `any` types allowed
- **CSRF Protection**: Tokens for state-changing requests

## Testing Strategy

- **Unit Tests (Vitest)**: All utilities, hooks, store actions, component logic
- **Integration Tests**: Form submissions, API mocking with MSW, state flows
- **E2E Tests (Playwright)**: Auth flow, file operations, real-time collaboration, keyboard shortcuts
- **Coverage Target**: 80%+ code coverage

## Deployment Configuration

- **Base Path**: `/code-editor/` (configured in vite.config.ts)
- **Target**: GitHub Pages with automatic deployment via GitHub Actions
- **Workflow**: `.github/workflows/jekyll-gh-pages.yml`
- **Live URL**: https://devanshshar01.github.io/code-editor/

**Alternative Platforms**:
- Vercel: Framework preset "Vite", build command `npm run build`, output dir `dist`
- Netlify: Same configuration with redirects for SPA routing

## Development Workflow

1. **Feature Development**:
   - Create feature branch: `feature/your-feature-name`
   - Place code in appropriate `features/` or `shared/` directory
   - Follow atomic design for components
   - Add TypeScript types (no `any` allowed)

2. **Before Committing**:
   - Run `npm run type-check` (must pass with 0 errors)
   - Run `npm run lint` (0 warnings target)
   - Run `npm run test` (maintain 80%+ coverage)
   - Run `npm run format` to auto-format

3. **Commit Convention**:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `refactor:` - Code refactoring
   - `test:` - Tests

## Important Context

### No Backend Yet
The application is currently **frontend-only**. Features requiring backend:
- Real user authentication (JWT generation)
- File persistence in database
- Real-time collaboration (WebSocket server)
- OAuth providers (Google, GitHub)

Use localStorage bypass for development (see QUICK_START.md).

### Monaco Editor Integration
- Monaco is the same editor engine as VS Code
- Supports 17+ programming languages with syntax highlighting
- Has built-in IntelliSense, minimap, and keyboard shortcuts
- Language detection based on file extensions

### Accessibility (WCAG 2.1 AA)
- All components use semantic HTML
- ARIA attributes for screen readers
- Keyboard navigation support (Tab, Enter, Esc)
- 2px solid focus indicators
- 4.5:1 color contrast ratio

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:5173 | xargs kill -9
# Or use different port:
npm run dev -- --port 3000
```

### TypeScript Errors After Pull
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Cache Issues
```bash
rm -rf dist .vite
npm run build
```

## Key Files Reference

- **Main Entry**: `index.html` → loads `/src/main.tsx`
- **Architecture Docs**: `ARCHITECTURE.md` (500+ lines with diagrams)
- **Contributing Guide**: `CONTRIBUTING.md` (code style, PR process)
- **Deployment Guide**: `DEPLOYMENT.md` (Vercel, Netlify, GitHub Pages)
- **Quick Start**: `QUICK_START.md` (5-minute setup guide)

## Dependencies Notes

- **Vite Override**: Using `rolldown-vite@7.1.14` (specified in overrides)
- **React 19**: Using latest stable version with concurrent features
- **TailwindCSS 4.x**: Using PostCSS-based version (not JIT v3)
- **Zustand**: Lightweight state management (simpler than Redux)
- **Yjs**: CRDT library for real-time collaboration without conflicts
