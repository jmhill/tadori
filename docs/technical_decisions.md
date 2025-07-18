# Tadori - Technical Decision Document (Revised)

## Overview
This document captures the key technical decisions for implementing the Tadori application, a local-first project management system with event sourcing and sync capabilities.

## Core Technical Decisions

### 1. Frontend Framework

**Decision: Preact + Vite** (Unchanged)

This decision is critical because the PRD emphasizes mobile-first, zero-friction capture with a sub-3-second time-to-capture requirement. Bundle size directly impacts PWA installation size and loading speed on mobile devices, which are often resource-constrained. We chose Preact because it provides the familiar React development model (important for development velocity) while delivering a significantly smaller bundle size (~3KB vs React's ~45KB). This aligns perfectly with our mobile-first philosophy and ensures the app loads instantly, even on slower devices or networks. The compatibility with most React libraries via preact/compat gives us access to the React ecosystem without the performance penalty.

**Options Considered:**
- **React**
  - ✅ Massive ecosystem, especially for PWA tools
  - ✅ Excellent testing ecosystem
  - ❌ Larger bundle size (~45KB)
  - ❌ More boilerplate for simple apps

- **Preact** (Selected)
  - ✅ React-compatible with smaller bundle size (~3KB)
  - ✅ Familiar React patterns
  - ✅ Works with Vite
  - ✅ Most React libraries work with preact/compat
  - ⚠️ Some React libraries may not be compatible
  - ⚠️ Need to test compatibility early

- **Svelte**
  - ✅ Smallest bundle size
  - ✅ Built-in stores align with event sourcing
  - ❌ Smaller ecosystem
  - ❌ Less familiar

### 2. Local Storage Solution

**Decision: Dexie.js**

The local storage solution is the heart of our local-first architecture and directly impacts our ability to implement event sourcing, offline functionality, and reactive UI updates. The PRD requires immediate local saves (<100ms), complex queries across projects and sessions, and a foundation for sync. We chose Dexie because it provides a dramatically smaller bundle size than RxDB (~30KB vs 200KB) while still offering schema versioning, TypeScript support, and extensibility for reactivity via liveQuery. Since we're building custom state projections anyway, we don't need RxDB's advanced features - we need a fast, reliable IndexedDB wrapper that gets out of our way. Dexie's proven track record and simple mental model make it perfect for our event-sourcing architecture.

**Options Considered:**
- **Raw IndexedDB**
  - ✅ Maximum control
  - ✅ No dependencies
  - ❌ Verbose API
  - ❌ Complex error handling

- **Dexie** (Selected)
  - ✅ Tiny bundle (~30KB)
  - ✅ Schema versioning built-in
  - ✅ TypeScript first-class support
  - ✅ LiveQuery for reactivity
  - ✅ Extensible (supports Dexie Cloud)
  - ✅ Battle-tested in production
  - ❌ Need to build state projections

- **IDB**
  - ✅ Extremely small (3KB)
  - ✅ Direct IndexedDB control
  - ❌ No schema versioning
  - ❌ No built-in reactivity
  - ❌ More code to write

- **RxDB** (Original choice)
  - ✅ Built-in sync capabilities
  - ✅ Event sourcing patterns
  - ❌ Massive bundle size (~200KB)
  - ❌ Overkill for our needs

### 3. Backend/Sync Service

**Decision: Dexie Cloud**

This is our most radical simplification. The sync backend choice typically determines our authentication story, real-time capabilities, and long-term operational costs. By choosing Dexie Cloud, we eliminate entire categories of complexity: no auth implementation, no sync protocol design, no conflict resolution code, no backend infrastructure. The PRD requires multi-workspace support and real-time sync, which Dexie Cloud provides out of the box. The email OTP authentication is actually ideal for a productivity tool - no passwords to manage, works across all devices. While we lose some control, the dramatic reduction in complexity (easily 30-40% less development time) allows us to focus entirely on our domain logic. For a personal project that might become a small SaaS, this tradeoff is optimal.

**Options Considered:**
- **Dexie Cloud** (Selected)
  - ✅ Zero sync code required
  - ✅ Built-in auth (email OTP)
  - ✅ Automatic conflict resolution
  - ✅ Real-time sync included
  - ✅ Dramatically simpler architecture
  - ✅ No backend to maintain
  - ❌ Vendor lock-in
  - ❌ Less control over auth flow
  - ❌ Subscription cost at scale

- **Supabase** (Original choice)
  - ✅ More auth options
  - ✅ Custom backend logic possible
  - ❌ Requires sync implementation
  - ❌ Requires auth implementation
  - ❌ Another service to manage

- **Custom Backend**
  - ✅ Full control
  - ❌ Massive implementation effort
  - ❌ Maintenance burden

### 4. Infrastructure/Deployment

**Decision: Cloudflare Pages (Static hosting only)**

With Dexie Cloud handling all backend needs, our infrastructure becomes trivially simple. We only need static hosting for our PWA, and Cloudflare Pages excels at this with global edge deployment, automatic SSL, and git-based deployment. No Workers needed, no API endpoints to manage. This aligns perfectly with our local-first philosophy - the app is just static files that work offline by default. The entire deployment process becomes a single git push.

**Options Considered:**
- **Cloudflare Pages** (Selected)
  - ✅ Excellent edge performance
  - ✅ Simple static hosting
  - ✅ Git-based deployment
  - ✅ No backend needed with Dexie Cloud
  - ✅ Great PWA support

- **Vercel/Netlify**
  - ✅ Also good for static hosting
  - ❌ No particular advantage for our use case

### 5. Authentication Strategy

**Decision: Dexie Cloud Auth (Email OTP)**

Authentication is now a non-decision - Dexie Cloud provides it. This eliminates one of the most complex aspects of our original plan. The email OTP approach is secure, works everywhere, and requires zero implementation effort from us. For a productivity tool, not having passwords is actually a feature. Users get a magic link, click it, and they're authenticated across all devices. No JWT handling, no refresh tokens, no auth context to manage.

**Options Considered:**
- **Dexie Cloud Auth** (Selected)
  - ✅ Zero implementation required
  - ✅ Email OTP is secure and simple
  - ✅ Works across all devices
  - ✅ No passwords to manage
  - ❌ Only email auth (no social login)

- **Build custom auth**
  - ❌ Massive complexity for no benefit
  - ❌ Would require backend

### 6. Event Storage Format

**Decision: Separate Records (append-only events)** (Unchanged)

The event storage format remains foundational to our event-sourcing architecture. We still use append-only events as separate records, but now Dexie Cloud handles syncing them automatically. Each event has a unique ID (timestamp + deviceId + uuid), making conflicts impossible. The simplicity of this approach is even more apparent with Dexie Cloud - we just add events to our local Dexie database, and they sync automatically.

### 7. Sync/CRDT Strategy

**Decision: Dexie Cloud Automatic Sync**

This is where we see the biggest win. Instead of building custom sync logic, implementing CRDTs, handling conflict resolution, and managing sync state, we simply... don't. Dexie Cloud handles all of this automatically. Our events with unique IDs work perfectly with Dexie Cloud's sync model. The single-active-session rule still applies for domain logic, but we don't need to implement any sync infrastructure.

**What we eliminated:**
- Custom sync protocol
- Conflict resolution logic
- Sync status tracking
- Network failure handling
- Real-time subscriptions
- Backend endpoints

### 8. Testing Strategy

**Decision: Vitest + Playwright** (Unchanged, but simpler)

Testing strategy remains the same but becomes simpler. We no longer need to mock Supabase or test complex sync logic. With Dexie Cloud in offline mode for tests, we can focus entirely on our domain logic and UI behavior.

### 9. UI Approach

**Decision: CSS Modules with Mobile-First Design**

We're using CSS Modules for styling, which comes pre-configured with the Preact + Vite setup. This approach provides scoped styling, prevents CSS conflicts, and keeps our bundle size minimal. CSS Modules are perfect for our component-based architecture and don't add any runtime overhead. The mobile-first, responsive design approach remains essential for meeting our sub-3-second capture requirement.

**Why CSS Modules over Tailwind:**
- ✅ Zero runtime overhead
- ✅ Already configured with Preact template
- ✅ Scoped styles prevent conflicts
- ✅ Better performance for PWA
- ✅ Smaller bundle size
- ✅ Full CSS control for complex animations

## Architecture Summary

```
[Preact PWA]
    ↓
[Dexie (local storage)]
    ↓
[Dexie Cloud (auto-sync)]
```

## Key Principles
1. **Event sourcing**: All state changes as immutable events
2. **Local-first**: App works offline, sync is automatic
3. **No conflicts**: Events have unique IDs, append-only
4. **Radical simplicity**: Leverage Dexie Cloud instead of building infrastructure
5. **Mobile-first**: Optimize for mobile capture use case

## Implementation Impact

This architecture reduces our initial development by approximately 40%:
- **Eliminated**: All of Phase 4 (sync implementation)
- **Simplified**: Phase 0 (no auth setup needed)
- **Simplified**: Testing (no backend mocks)
- **Accelerated**: Time to first deployable version

The tradeoff is vendor lock-in with Dexie Cloud, but for a personal project with SaaS potential, shipping 40% faster with a proven sync solution is worth the dependency.
