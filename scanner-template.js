/**
 * Scanner Template
 * Use this as a starting point for new scanners.
 * 
 * 1. Copy this file to `scanners/<scanner-name>/index.js`
 * 2. Rename `myScannerName` to your scanner's name
 * 3. Implement your detection logic
 */

// Import ScanMemory for deduplication (adjust path if needed)
const ScanMemory = require('../../scan-memory.js');

async function myScannerName({ request }) {

    // --- 1. MEMORY INITIALIZATION ---
    let memory = null;
    const { scanContext } = request || {};

    // Only initialize memory if context is provided
    if (scanContext && scanContext.scanId && scanContext.applicationId) {
        memory = new ScanMemory({
            scannerName: 'my-scanner-name', // TODO: Change this
            scanId: scanContext.scanId,
            applicationId: scanContext.applicationId
        });
    }

    // --- 2. INPUT COLLECTION ---
    // Example: parsing URLs from response body
    // const content = request.body || ""; 
    const keyToCheck = "example-key-or-url";

    // --- 3. DEDUPLICATION CHECK ---
    if (memory && memory.hasSeen(keyToCheck)) {
        console.log(`[~] Skipping duplicate check: ${keyToCheck}`);
        return [];
    }

    // Mark as processed immediately to lock it for this scan
    if (memory) {
        memory.store(keyToCheck);
    }

    // --- 4. VULNERABILITY DETECTION LOGIC ---
    console.log(`[*] Checking ${keyToCheck}...`);

    const findings = [];

    // ... Implement logic here ...
    const isVulnerable = false;

    if (isVulnerable) {
        findings.push({
            title: "Vulnerability Title",
            description: "Description of what was found...",
            severity: "high",
            type: "vuln-type-slug",
            affectedUrl: keyToCheck,
            // ... other standard fields ...
        });
    }

    return findings;
}

module.exports = { myScannerName };
