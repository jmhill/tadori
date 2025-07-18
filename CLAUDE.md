# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tadori is a personal project management system that treats projects as "evolving narratives" rather than task lists. It's a local-first, mobile-first PWA with a focus on capturing work sessions and thoughts with <3 second capture time.

## Key Technical Decisions

### Frontend Stack
- **Framework**: Preact + Vite (chosen for small bundle size ~3KB)
- **Styling**: CSS Modules (pre-configured with Preact template)
- **State Management**: Event sourcing pattern with state projections
- **Local Storage**: Dexie.js (IndexedDB wrapper)
- **Sync**: Dexie Cloud (zero-config sync solution)

### Deployment & Infrastructure
- **Hosting**: Cloudflare Pages
- **Build Tool**: Nx monorepo
- **Development Environment**: Devbox with Node.js v24

## Common Development Commands

```bash
# Install dependencies
npm install

# Run Nx commands (once set up)
npx nx <command> <project>

# Access Nx documentation via MCP
# The project has Nx MCP server configured for AI assistance
```

## Architecture & Code Structure

### Monorepo Structure
- `apps/` - Application code (not yet created)
- `packages/` - Shared libraries (not yet created)
- `docs/` - Comprehensive project documentation

### Event Sourcing Architecture
The application uses event sourcing as its core pattern:
1. All state changes are captured as immutable events
2. Events have structure: `{id, eventId, timestamp, deviceId, type, data}`
3. Current state is derived from projecting events
4. Dexie Cloud handles sync automatically

### Key Implementation Files (once created)
- Event store repository will handle local storage
- State projections will derive current app state from events
- Reactive UI will use Dexie's liveQuery for real-time updates

## Current Project Status

The project is in **Phase 0: Foundation Setup** with most core infrastructure complete:

### ✅ Completed
- Preact app with Vite created using Nx
- TypeScript with strict mode configured
- Vitest unit testing setup
- Playwright e2e testing setup  
- ESLint and Prettier configured
- CSS Modules ready for use
- Comprehensive .gitignore for Nx monorepos

### 🔄 Next Steps
1. Configure Vite for PWA development (vite-plugin-pwa)
2. Create basic folder structure (features, components, lib)
3. Set up Dexie Cloud account and credentials
4. Begin Phase 1: Walking Skeleton with Sync

## Important Context from Documentation

### Product Requirements (from PRD.md)
- **Core Philosophy**: Projects as evolving narratives, not task lists
- **Mobile-First**: Sub-3-second capture time requirement
- **Local-First**: All data stored locally, sync is optional
- **Event Types**: inbox items, projects, work sessions, reflections

### Technical Constraints
- Bundle size is critical for mobile performance
- PWA must work fully offline
- All operations must feel instant (<100ms local save)
- Sync should be transparent and conflict-free

### Testing Approach
- Test-Driven Development philosophy
- Vitest for unit tests
- Playwright for E2E tests
- Focus on testing event sourcing logic and state projections

## Development Workflow

When implementing features:
1. Start with failing tests (TDD approach)
2. Create event types first
3. Implement state projections
4. Build UI components last
5. Ensure all state changes go through events

## Nx Integration

The project uses Nx for monorepo management. The Nx MCP server is configured for AI assistance. Use the nx_* tools to:
- Understand project structure
- Run generators for new code
- Check build/test status
- Debug CI failures

## Next Steps

To continue development, start with Phase 0 from the implementation plan:
```bash
# Initialize the Preact app
npm create vite@latest tadori-app -- --template preact-ts
```

Then follow the implementation plan in `docs/implementation_plan.md` systematically.