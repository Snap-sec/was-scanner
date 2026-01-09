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
// 1. Import the Memory Helper
const ScanMemory = require('./scan-memory.js');

async function myNewScan({ request }) {
    
    // 2. Setup Memory (Copy this exact block)
    let memory = null;
    const { scanContext } = request || {};
    if (scanContext && scanContext.scanId) {
        memory = new ScanMemory({
            scannerName: 'my-new-scan', // CHANGE THIS NAME
            scanId: scanContext.scanId,
            applicationId: scanContext.applicationId
        });
    }

    // 3. Your Scanner Logic
    const urlToCheck = "https://example.com"; // Get this from your request/response actually

    // CHECK MEMORY: logic to skip duplicates
    if (memory && memory.hasSeen(urlToCheck)) {
        console.log(`Skipping ${urlToCheck}, already scanned.`);
        return []; // Skip
    }

    // SAVE TO MEMORY: mark as seen
    if (memory) {
        memory.store(urlToCheck);
    }

    // 4. Do Your Security Check Here
    // ... code to check for vulnerabilities ...
    const isVulnerable = false; // logic result

    // 5. Return Findings
    if (isVulnerable) {
        return [{
            title: "My New Vulnerability",
            severity: "high",
            description: "Found a problem..."
        }];
    }

    return []; // Return empty array if nothing found
}

module.exports = { myNewScan };
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
