# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-22

### Added

- Initial public release
- Real-time timeline visualization of blocking events
- Active blockers view with priority sorting
- Search by blocker ID or reason
- Event history with configurable limits
- Pause/resume functionality for event recording
- Keyboard shortcuts (Esc, Space, C)
- Detailed event inspection with duration tracking
- Customizable panel positioning (left/right)
- Automatic middleware registration
- Production safety (disabled by default in production)
- TypeScript support with full type definitions
- Zustand-based state management
- Clean, minimalistic UI
- Zero-config setup

### Features

- **Timeline View**: Visual timeline showing all add/remove/update events
- **Active Blockers**: Real-time view of currently active blockers
- **Filtering**: Search by blocker ID or reason
- **Event Details**: Expandable event cards with full configuration
- **Duration Tracking**: Automatic calculation of blocker lifetimes
- **Scope Indicators**: Visual tags for affected scopes
- **Minimizable Panel**: Collapse to show just active blocker count
- **Color Coding**: Green (add), red (remove), yellow (update)

### Technical

- Built with React and TypeScript
- Uses Zustand for state management
- Tree-shakeable exports
- Supports ESM and CommonJS
- Source maps included
- Comprehensive JSDoc documentation
