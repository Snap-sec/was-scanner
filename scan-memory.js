const Database = require('better-sqlite3');

class ScanMemory {
    /**
     * @param {Object} options
     * @param {string} options.scannerName - Name of the scanner (e.g., 'expired-library')
     * @param {string} options.scanId - Unique ID for this scan context
     * @param {string} options.applicationId - Application ID for this scan
     * @param {string} [options.dbPath='scanner.db'] - Path to SQLite DB
     */
    constructor({ scannerName, scanId, applicationId, dbPath = 'scanner.db' }) {
        if (!scannerName || !scanId || !applicationId) {
            throw new Error('ScanMemory requires scannerName, scanId, and applicationId');
        }

        this.scannerName = scannerName;
        this.scanId = scanId;
        this.applicationId = applicationId;

        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');

        this.initSchema();

        this.stmts = {
            hasSeen: this.db.prepare(`
                SELECT 1 FROM scanner_memory 
                WHERE scanner_name = ? AND scan_id = ? AND application_id = ? AND key = ?
            `),
            get: this.db.prepare(`
                SELECT meta FROM scanner_memory 
                WHERE scanner_name = ? AND scan_id = ? AND application_id = ? AND key = ?
            `),
            store: this.db.prepare(`
                INSERT INTO scanner_memory (
                    scanner_name, scan_id, application_id, scope, key, meta
                ) VALUES (
                    @scanner_name, @scan_id, @application_id, @scope, @key, @meta
                )
            `)
        };
    }

    initSchema() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS scanner_memory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scanner_name TEXT NOT NULL,
                key TEXT NOT NULL,
                scan_id TEXT NOT NULL,
                scope TEXT,
                application_id TEXT NOT NULL,
                meta TEXT,
                UNIQUE(scanner_name, scan_id, application_id, key)
            );
            
            CREATE INDEX IF NOT EXISTS idx_scan_lookup 
            ON scanner_memory(scanner_name, scan_id, application_id);
        `);
    }

    /**
     * Check if a key has been seen in this scan
     * @param {string} key 
     * @returns {boolean}
     */
    hasSeen(key) {
        const result = this.stmts.hasSeen.get(
            this.scannerName,
            this.scanId,
            this.applicationId,
            key
        );
        return !!result;
    }

    /**
     * Get metadata for a key
     * @param {string} key 
     * @returns {Object|null}
     */
    get(key) {
        const row = this.stmts.get.get(
            this.scannerName,
            this.scanId,
            this.applicationId,
            key
        );
        if (row && row.meta) {
            try { return JSON.parse(row.meta); } catch (e) { return {}; }
        }
        return null;
    }

    /**
     * Store a key with optional metadata
     * @param {string} key 
     * @param {Object} meta 
     * @param {string} [scope='global'] 
     */
    store(key, meta = {}, scope = 'global') {
        this.stmts.store.run({
            scanner_name: this.scannerName,
            scan_id: this.scanId,
            application_id: this.applicationId,
            scope,
            key,
            meta: JSON.stringify(meta)
        });
    }
}

module.exports = ScanMemory;
