const { expiredLibraryScan } = require('./expired-library-scan.js');
const crypto = require('crypto');

// Create a unique scan context
const scanContext = {
    scanId: '12345',
    applicationId: 'app_test_001'
};

console.log(`[+] Starting Scan (ID: ${scanContext.scanId})`);

expiredLibraryScan({
    request: {
        scanContext: scanContext
    }
}).then(result => {
    console.log(result);
}).catch(error => {
    console.error(error);
});
