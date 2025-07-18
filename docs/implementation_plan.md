# Tadori - Implementation Plan (Revised)

## Phase 0: Foundation Setup (Simplified)

### Development Environment
- [ ] Initialize Vite project with Preact template
- [ ] Configure TypeScript with strict mode
- [ ] Set up ESLint and Prettier
- [ ] Configure Vite for PWA development (vite-plugin-pwa)
- [ ] Set up Tailwind CSS
- [ ] Create basic folder structure (features, components, lib)

### Testing Infrastructure
- [ ] Install and configure Vitest
- [ ] Set up Playwright for E2E tests
- [ ] Create test utilities for event sourcing
- [ ] Set up coverage reporting

### CI/CD Pipeline
- [ ] Create GitHub repository
- [ ] Set up Cloudflare Pages deployment
- [ ] Configure automatic deployments on main branch
- [ ] Add build and test checks to CI

### Dexie Cloud Setup
- [ ] Create Dexie Cloud account
- [ ] Get database URL
- [ ] Store credentials in environment variables
- [ ] Configure local development environment

## Phase 1: Walking Skeleton with Sync

### Local Storage Layer with Dexie
- [ ] Install Dexie and dexie-cloud-addon
- [ ] Create event schema with required fields (id, eventId, timestamp, deviceId, type, data)
- [ ] Configure Dexie Cloud connection
- [ ] Implement device ID generation and storage
- [ ] Create event store repository
- [ ] Write unit tests for event storage

### Basic Capture with Auth
- [ ] Implement Dexie Cloud login (email OTP)
- [ ] Create minimal auth UI (email input, OTP verification)
- [ ] Create capture input component (mobile-optimized)
- [ ] Implement event creation (type: 'inbox.create')
- [ ] Store events in Dexie (auto-syncs via Cloud)
- [ ] Create basic event list view
- [ ] Add PWA manifest and icons

### E2E Tests
- [ ] Test PWA installation flow
- [ ] Test auth flow (email OTP)
- [ ] Test capture and storage
- [ ] Test offline functionality
- [ ] Verify sync works across two browser tabs

### Deploy v0.1
- [ ] Deploy to Cloudflare Pages
- [ ] Test on real mobile device
- [ ] Verify PWA installation works
- [ ] Test cross-device sync with real devices

## Phase 2: Inbox + Projects

### Event Types
- [ ] Define project.create event schema
- [ ] Define inbox.process event schema
- [ ] Define reminder.create event schema
- [ ] Implement event validation

### State Projection
- [ ] Create state projection system (events → current state)
- [ ] Implement inbox state projection
- [ ] Implement projects list projection
- [ ] Add reactive queries with Dexie liveQuery
- [ ] Create useObservable hook for Preact
- [ ] Write comprehensive tests for projections

### Inbox UI
- [ ] Create inbox view component
- [ ] Implement inbox item component
- [ ] Add swipe actions (mobile)
- [ ] Create "process to project" flow
- [ ] Create "convert to reminder" flow
- [ ] Add delete functionality

### Projects UI
- [ ] Create projects list view
- [ ] Create project detail view (empty for now)
- [ ] Implement project creation from inbox
- [ ] Add project selection UI

### Testing
- [ ] Unit test all projections
- [ ] E2E test inbox processing flow
- [ ] Test data persistence across app restarts
- [ ] Verify sync works for all new event types

## Phase 3: Working Sessions

### Session Events
- [ ] Define session.start event
- [ ] Define session.updateNotes event
- [ ] Define session.completeTask event
- [ ] Define session.end event
- [ ] Implement session validation rules

### Session State Management
- [ ] Create active session projection
- [ ] Implement single-session enforcement
- [ ] Add session conflict resolution (last-write-wins via event timestamps)
- [ ] Create session recovery for crashes

### Session UI
- [ ] Create session start modal
- [ ] Build active session view
  - [ ] Running timer
  - [ ] Markdown notes editor (with debounced saves)
  - [ ] Task list with completion
  - [ ] End session button
- [ ] Create session end modal
  - [ ] Summary field (required)
  - [ ] Next actions field (required)
  - [ ] Save functionality

### Project History
- [ ] Create session history projection
- [ ] Build timeline view component
- [ ] Implement session card component
- [ ] Add expand/collapse for session details

### Testing
- [ ] Test session lifecycle
- [ ] Test forced session closure
- [ ] Test session conflict handling across devices
- [ ] E2E test complete session flow

## Phase 4: Polish & Optimization

### Performance
- [ ] Implement virtual scrolling for long lists
- [ ] Optimize bundle size analysis
- [ ] Add service worker caching strategies
- [ ] Implement lazy loading for routes

### UX Improvements
- [ ] Add loading states
- [ ] Implement optimistic updates (already supported by Dexie)
- [ ] Add haptic feedback (mobile)
- [ ] Improve error messages
- [ ] Add keyboard shortcuts
- [ ] Create onboarding flow

### Workspace Support
- [ ] Implement workspace switching using Dexie Cloud databases
- [ ] Add workspace creation UI
- [ ] Handle workspace invitations (if supported by Dexie Cloud)

### Additional Features
- [ ] Implement reminder notifications
- [ ] Add basic search functionality
- [ ] Create data export feature
- [ ] Add offline indicator
- [ ] Implement session templates

### Production Readiness
- [ ] Add error tracking (Sentry or similar)
- [ ] Implement privacy-friendly analytics
- [ ] Create user documentation
- [ ] Add feedback mechanism
- [ ] Set up monitoring for Dexie Cloud usage

## Phase 5: Advanced Features (Post-MVP)

### Enhanced Project Management
- [ ] Milestone management
- [ ] Task dependencies
- [ ] Project templates
- [ ] Bulk operations

### Rich Content
- [ ] File attachments (using Dexie Cloud blobs if available)
- [ ] Rich text editing
- [ ] Code syntax highlighting in notes
- [ ] Image paste support

### Analytics & Insights
- [ ] Time tracking
- [ ] Project analytics
- [ ] Personal productivity insights
- [ ] Export reports

## Future Considerations

### Platform Expansion
- [ ] Evaluate need for native apps
- [ ] Consider desktop app (Electron/Tauri) if needed
- [ ] Browser extension for quick capture
- [ ] API for integrations (would require backend)

### Migration Path
- [ ] Document Dexie Cloud data export process
- [ ] Plan for potential migration if scaling beyond Dexie Cloud limits
- [ ] Keep sync logic abstracted enough to swap providers if needed

## Key Differences from Original Plan

### What We Eliminated
- ❌ All Supabase setup and configuration
- ❌ Custom authentication implementation
- ❌ Sync protocol design and implementation
- ❌ Conflict resolution code
- ❌ Real-time subscription setup
- ❌ Backend API development
- ❌ Complex deployment infrastructure

### What We Gained
- ✅ Auth works out of the box (Phase 1 instead of Phase 0)
- ✅ Sync works immediately (Phase 1 instead of Phase 4)
- ✅ Can focus entirely on domain logic
- ✅ Faster iteration cycles
- ✅ Simpler mental model
- ✅ ~40% reduction in development time

### Development Time Estimates
- **Original estimate**: 10-12 weeks to production
- **Revised estimate**: 6-7 weeks to production
- **Time saved**: 4-5 weeks (primarily from eliminating custom sync)
