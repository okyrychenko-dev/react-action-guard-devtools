# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-01-25

### Breaking Changes

- ⚠️ **Updated minimum peer dependency versions**:
  - React: `^18.0.0 || ^19.0.0` (removed React 17 support)
- ⬆️ **Updated peer dependency**: `@okyrychenko-dev/react-action-guard` from `^0.6.0` to `^0.7.0`

### Changed

- 🏗️ **Type organization**: Moved `DevtoolsKeyboardAction` and `DevtoolsKeyboardResult` types to `ActionGuardDevtools.types.ts`
- 🔧 **ESLint configuration**: Added `curly: ["error", "all"]` rule
- 📦 **Dependencies**: Updated `@okyrychenko-dev/react-zustand-toolkit` to `^0.2.0`

## [0.1.3] - 2024-12-28

### Documentation

- 📚 **Comprehensive JSDoc documentation** for ActionGuardDevtools component
  - Detailed component description with all features (timeline, filtering, keyboard shortcuts)
  - Props documentation with defaults (position, defaultOpen, maxEvents, showInProduction, store)
  - Performance notes (production behavior, automatic cleanup)
  - 5 usage examples: basic setup, custom position, isolated stores, production override, keyboard shortcuts
- 📝 **devtoolsMiddleware documentation** with integration examples
- 📖 **README improvements** with quick start guide and production safety notes

## [0.1.2] - 2024-12-24

### Changed

- ⬆️ Updated peer dependency: `@okyrychenko-dev/react-action-guard` from `^0.5.0` to `^0.6.0`
  - Support for new middleware events (`clear`, `clear_scope`)
  - Automatically tracks clear operations in timeline
  - Compatible with priority validation and enhanced timeout handling

### Added

- 🧹 Timeline visualization for `clear` and `clear_scope` events
  - Clear events help debug bulk blocker removal operations
  - Scope-specific clears are clearly distinguished with color coding
  - Duration tracking for clear operations
- 🧪 Added 2 new tests for clear event recording

### Removed

- ❌ Removed support for deprecated `cancel` action type

## [0.1.1] - 2024-12-23

### Fixed

- 📚 Documentation improvements
- 🐛 Minor bug fixes

## [0.1.0] - 2024-12-22

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

[Unreleased]: https://github.com/okyrychenko-dev/react-action-guard-devtools/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/okyrychenko-dev/react-action-guard-devtools/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/okyrychenko-dev/react-action-guard-devtools/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/okyrychenko-dev/react-action-guard-devtools/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/okyrychenko-dev/react-action-guard-devtools/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/okyrychenko-dev/react-action-guard-devtools/releases/tag/v0.1.0
