# AI Context & Project Instructions

This file contains critical context for AI agents and developers working on the **Web Application Security (WAS) Scanners** project.

## 1. Project Overview
This is a modular, Node.js-based vulnerability scanner platform. It is designed to be:
- **Simple**: Minimal abstractions.
- **Deterministic**: Same input + same db state = same result.
- **Self-Contained**: Uses embedded SQLite (`scanner.db`) for all state. No external databases (Redis/Postgres).

## 2. Core Architecture
- **Entry Point**: `run.js`. It generates a unique `scanId` and `applicationId` and injects them into the scanners.
- **Memory System**: `scan-memory.js` (Class: `ScanMemory`).
  - **Scope**: Memory is **Scan-Scoped**. It is valid *only* for the current scan execution.
  - **Purpose**: Deduplication within a single scan.
  - **Usage**: Scanners must check `hasSeen(key)` before processing and `store(key)` after processing.
  - **Persistence**: Data is stored in SQLite but logically isolated by `scan_id`.
- **Scanners**: Individual files (e.g., `expired-library-scan.js`) exporting a single async function.

## 3. Coding Standards for Scanners
When writing new scanners, adhere to these strict rules:

### A. Lifecycle
1. **Initialize Memory**: Check for `request.scanContext`. If present, instantiate `ScanMemory`.
2. **Deduplicate**: 
   ```javascript
   if (memory && memory.hasSeen(key)) return; // Skip
   ```
3. **Scan**: Perform the actual security check.
4. **Store**:
   ```javascript
   if (memory) memory.store(key);
   ```

### B. Logging Style
Use these specific prefixes for log readability:
- `[!]` : Errors or Vulnerabilities found.
- `[~]` : Successful operations / Progress updates / Cache hits.
- `[*]` : Information / Starting a phase.

### C. Dependencies
- **SQLite**: Use `better-sqlite3` *only* inside core modules (`scan-memory.js`). Scanners should not access the DB directly.
- **Network**: Use native `fetch` or standard node modules (`dns`, `http`).

## 4. File Structure
- `run.js`: Orchestrator (edit this to add new scanners to the run loop).
- `scan-memory.js`: The persistence layer.
- `scanner.db`: The local database (ignored in git).
- `*.js`: Scanner implementations.

## 5. Do Not
- Do not introduce Global state outside of `ScanMemory`.
- Do not use ORMs (Sequelize/TypeORM). Keep SQL raw and simple.
- Do not make scanners depend on each other.

---
*Use this context to ensure consistency when generating new code or refactoring existing logic.*
