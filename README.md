# Web Application Security Scanners

Welcome! This is a simple tool to scan websites for security issues using Node.js.

## Fast Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Scanner**:
   ```bash
   node run.js
   ```

---

## Developer Guide: How to Build a New Scanner

This guide is written for developers of all levels. We made it easy to add new security checks.

### 1. The Basics
Each scanner is just a **function**.
- It takes a **Request** (what to scan).
- It returns a list of **Findings** (vulnerabilities found).

### 2. Using "Memory" (Stop Duplicate Work)
We have a built-in memory system. This is very important! It makes sure we **don't scan the same URL twice** in the same run.

You use it like this:
1. **Check**: "Have I seen this before?" (`hasSeen`)
2. **Store**: "Okay, I'm scanning it now, remember it." (`store`)

### 3. Scanner Template (Copy & Paste)

Create a new file (e.g., `my-new-scan.js`) and use this code:

```javascript
/**
 * Scanner Template (scanners/<scanner-name>/index.js)
 */

const ScanMemory = require('../../scan-memory.js');

async function myScannerName({ request, response }) {

    // Default Request Object (based on RawRequest model)
    const defaultRequest = {
        method: "GET",
        url: "https://example.com/api/v1/users",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer token123",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        params: {
            "id": "123",
            "include": "profile"
        },
        body: null,
        mode: "raw",
        body_format: "json",
        rawHttp: "GET /api/v1/users?id=123&include=profile HTTP/1.1\r\nHost: example.com\r\nContent-Type: application/json\r\nAuthorization: Bearer token123\r\n\r\n",
        source: "crawler",
        orgId: "org_123",
        projectIds: ["project_456"]
    };

    // Default Response Object
    const defaultResponse = {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Server": "nginx",
            "X-Powered-By": "Express"
        },
        body: {
            content: JSON.stringify({
                status: "success",
                data: {
                    id: 123,
                    username: "testuser",
                    email: "test@example.com"
                }
            }),
            mode: "raw",
            format: "json"
        },
        size: 1024,
        time: 150 // response time in ms
    };

    // Use provided request/response or defaults
    const req = request || defaultRequest;
    const res = response || defaultResponse;

    // --- MEMORY IMPLEMENTATION ---
    let memory = null;
    const { scanContext } = request || {};
    
    // Initialize memory if context is present
    if (scanContext && scanContext.scanId && scanContext.applicationId) {
        memory = new ScanMemory({
            scannerName: 'my-scanner-name',
            scanId: scanContext.scanId,
            applicationId: scanContext.applicationId
        });
    }

    // Deduplicate on unique key (e.g. req.url)
    if (memory && memory.hasSeen(req.url)) {
        console.log(`[~] Skipping duplicate: ${req.url}`);
        return null; 
    }
    if (memory) {
        memory.store(req.url);
    }
    // ----------------------------

    // do your scanning logic here
    
    const vuln = {
        title: "Example Vulnerability",
        severity: "high",
        description: "..."
    };

    return vuln;
}

module.exports = { myScannerName };
```

### 4. Add to Run Loop
Open `run.js` and import your new file to run it.

```javascript
const { myNewScan } = require('./my-new-scan.js');

// ... inside the execution block ...
await myNewScan({ request: ... });
```

## Project Files Explained
### Project Structure

- `scanners/`
  - `expired-library/index.js`: Default scanner for broken link hijacking.
- `scanner-template.js`: Template for creating new scanners.
- `scan-memory.js`: deduplication module.
- `run.js`: Entry point script.
- `scanner.db`: Local database.
