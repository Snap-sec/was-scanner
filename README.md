# Web Application Security Scanners

A Node.js-based web application security scanner platform designed for modularity, performance, and deterministic scanning.

## Features

- **Modular Scanners**: Easily extensible architecture for adding new security checks.
- **Scan-Scoped Memory**: SQLite-based persistent memory ensuring efficient deduplication within a single scan context.
- **Expired Library / Domain Scanner**: Detects "Broken Link Hijacking" vulnerabilities by identifying dead domains referenced in external scripts.
- **Minimal Dependencies**: Built with performance in mind, using `better-sqlite3` for fast, embedded storage.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd was-scanners
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running a Scan

To run the scanners with the default test configuration:

```bash
node run.js
```

This will:
1. Initialize a new scan context with a unique ID.
2. Execute the `expired-library-scan.js` against the configured target.
3. Log any findings and deduplication events.

### Project Structure

- `expired-library-scan.js`: Implementation of the broken link hijacking scanner.
- `scan-memory.js`: SQLite-based memory module for deduplicating resources within a scan.
- `run.js`: Entry point script to orchestrate scans and inject scan contexts.
- `scanner.db`: Local SQLite database (created automatically) for storing scan state.

## Development

### Adding a New Scanner

1. Create a new scanner file (e.g., `my-new-scan.js`).
2. Accept a `request` object containing `scanContext`.
3. Initialize `ScanMemory` if needed for deduplication.
4. Export the scanner function.
5. Update `run.js` to include your new scanner.

## License

ISC
