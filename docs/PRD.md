# Product Requirements Document: Tadori

## Product Vision
A personal project management system that treats projects as evolving narratives rather than task lists, emphasizing work session documentation and clear separation between project work and simple reminders.

## Core Principles
1. **Projects are journals, not task lists** - Progress is captured through working sessions
2. **Capture friction must be zero** - Any delay in capture is a failure
3. **Local-first, sync-second** - The app works offline by default
4. **Inbox discipline** - Every input must be processed to a project or reminder
5. **Documentation discipline** - All work sessions must be properly closed with summaries

## User Model
- **User**: Individual with authentication credentials
- **Workspace**: Container for projects/reminders (users can belong to multiple)
- **Project**: Long-running effort with history, milestones, and tasks
- **Reminder**: Simple future-dated note without project context
- **Working Session**: Live documentation of project work with three states (started, open, completed)
- **Inbox Item**: Unprocessed capture requiring categorization

## Core User Flows

### 1. Quick Capture (Mobile-First)
**Trigger**: User has thought/link to capture
**Flow**:
1. Single tap to open capture (PWA shortcut/widget)
2. Type/paste content
3. Submit (no categorization required)
4. Item saves locally immediately, syncs when available
5. **Always goes to inbox** (even if session is active)

**Requirements**:
- Time from intent to capture: <3 seconds
- Works fully offline
- No mandatory fields beyond content

### 2. Inbox Processing
**Trigger**: User reviews unprocessed items
**Flow**:
1. View inbox (sorted by capture time)
2. For each item, choose:
   - Convert to new project
   - Add to existing project as task
   - Convert to reminder (with optional date)
   - Delete
3. Item moves out of inbox immediately upon decision

**Requirements**:
- One-tap/click actions for common operations
- Batch operations for multiple items
- Visual indication of inbox count

### 3. Working Session Lifecycle

#### Session Rules
1. **One active session per user** - No parallel sessions
2. **Sessions must be closed** - No abandoned or draft sessions
3. **No pausing** - Sessions run continuously until ended
4. **Forced closure** - Starting a new session requires closing the previous one

#### Session States

**Started State**:
- User selects project
- Optionally selects milestone and initial tasks
- Session timestamp begins
- Check for unclosed sessions (force close if exists)

**Open State**:
- Session appears as "active" in UI
- Running markdown notes field for documentation
- Can mark tasks complete as work progresses
- Can create new tasks discovered during work
- Status indicator shows "Session active since [time]"

**Completed State**:
- User explicitly ends session
- Required fields:
  - Summary (what was accomplished)
  - Next actions (how to resume)
- Optional: blockers or concerns
- Session saves to immutable project history

**State Machine**:
```
[No Session] → Start Session → [Session Active] → End Session → [No Session]
                                                ↗
[Previous Unclosed] → Force Close → [No Session]
```

## Project History View

### Timeline Display
Projects display as a **vertical stream of session cards**, newest first, creating a narrative history of the project's evolution.

### Session Card Contents
Each card shows:
- Session date/time
- Milestone (if applicable)
- Summary (what got done)
- Next actions (how work continued)
- Notes preview (first ~2 lines, expandable)
- Tasks completed (count or list)

### Interaction Model
- Scroll through timeline to see project evolution
- Click card to expand full session details
- No filtering/sorting in v1 - pure chronological stream
- Natural reading flow: "Here's how this project unfolded"

## Data Model

```
Workspace
├── Users (many-to-many)
├── Projects
│   ├── Milestones
│   │   └── Tasks
│   └── Working Sessions
│       ├── Started timestamp
│       ├── Completed timestamp
│       ├── Notes (markdown)
│       ├── Summary
│       ├── Next actions
│       └── Completed tasks (references)
├── Reminders
└── Inbox Items
```

### Key Relationships
- Tasks belong to Milestones (optional) within Projects
- Working Sessions reference completed Tasks
- Inbox Items convert to either Projects, Tasks, or Reminders
- Only one active Working Session per User at any time

## Technical Requirements

### Architecture

**Storage Strategy**:
- **Local-first storage**: All data persists locally (IndexedDB/SQLite)
- **Event sourcing**: Each user action is an immutable event
- **CRDT-based sync**: For conflict-free replication across devices

**Sync Protocol**:
- Event log replication between devices
- CRDT for active session state
- Eventual consistency model
- Background, non-blocking sync

### Event Sourcing + CRDT Approach

**Event Types** (examples):
```typescript
{ type: 'inbox.create', content, timestamp }
{ type: 'project.create', name, description }
{ type: 'session.start', projectId, milestoneId }
{ type: 'session.appendNote', sessionId, text }
{ type: 'session.completeTask', sessionId, taskId }
{ type: 'session.end', sessionId, summary, nextActions }
```

**Markdown Note Handling**:
- **During active session**: Treat notes as append log with debounced saves
- **Character-level CRDT**: Not needed due to single-writer pattern
- **On session close**: Store final markdown as immutable blob
- **Storage optimization**: Compress/archive completed sessions

**Recommended CRDT Implementation**:
1. Use CRDT for active session state (tasks, status)
2. Simple append log for session notes during active state
3. Immutable storage for completed sessions
4. This hybrid balances real-time sync with storage efficiency

### Performance Requirements
- Capture: <100ms to save locally
- Sync: Background, non-blocking
- Session operations: Instant local feedback
- History load: <500ms for 100 sessions

### Platform Strategy
- **Primary**: Progressive Web App (PWA)
- **Installable** on mobile and desktop
- **Offline-capable** with service workers
- **Push notifications** for reminders
- No native apps in v1

## V1 Feature Scope

### Must Have
1. Quick capture to inbox
2. Inbox processing (project/reminder/delete)
3. Project creation with basic metadata
4. Working session lifecycle (start/open/end)
5. Session notes (markdown)
6. Task creation and completion within sessions
7. Project history view (timeline of sessions)
8. Local storage with event sourcing
9. Basic device sync via CRDT
10. Multi-workspace support (switching only)

### Nice to Have
1. Reminder notifications
2. Project templates
3. Milestone management UI
4. Export project history
5. Session templates

### Explicitly Excluded
1. Collaboration features (except basic multi-user workspace membership)
2. Time tracking/metrics
3. Reporting/analytics
4. Calendar integration
5. File attachments
6. Rich text editing (markdown only)
7. Search functionality
8. Session pausing/resuming

## Success Metrics
1. Time from thought to capture: <3 seconds
2. Inbox processing time: <30 seconds per item
3. Daily active use (capturing or logging sessions)
4. Session close rate: >95% (no abandoned sessions)
5. Sync reliability: 99.9% eventual consistency

## Implementation Priorities

### Phase 1: Core Loop
1. Inbox capture (mobile-optimized)
2. Basic project creation
3. Working session start/end flow
4. Local storage with event log

### Phase 2: Sync Foundation
1. CRDT implementation for active state
2. Device sync protocol
3. Conflict resolution

### Phase 3: Polish
1. Project history timeline
2. Workspace switching
3. PWA optimizations
4. Reminder system

## Open Questions
1. Session timeout handling: Should very long sessions (>24h) force close?
2. Offline conflict resolution: How to handle conflicting events when devices sync?
3. Storage limits: When to archive old sessions?
4. Backup strategy: Export format for user data?
