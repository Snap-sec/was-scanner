async function expiredLibraryScan({ request, response } = {}) {

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
            "Content-Type": "text/html",
            "Cache-Control": "no-cache",
            "Server": "nginx",
            "X-Powered-By": "Express"
        },
        body: {
            content: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logos/blue-mini.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags -->
    <title>Snapsec - Unified AppSec Platform | Comprehensive Security Suite</title>
    <meta name="title" content="Snapsec - Unified AppSec Platform | Comprehensive Security Suite" />
    <meta name="description" content="Enterprise-grade application security platform. Manage vulnerabilities, scan your attack surface, protect APIs, and secure your entire digital infrastructure with AI-powered insights." />
    <meta name="keywords" content="application security, vulnerability management, attack surface management, API security, security scanning, threat management, asset management, appsec, cybersecurity" />
    <meta name="author" content="Snapsec" />
    <meta name="robots" content="index, follow" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://snapsec.co" />

    <!-- Sitemap -->
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://snapsec.co" />
    <meta property="og:title" content="Snapsec - Unified AppSec Platform | Comprehensive Security Suite" />
    <meta property="og:description" content="Enterprise-grade application security platform. Manage vulnerabilities, scan your attack surface, protect APIs, and secure your entire digital infrastructure with AI-powered insights." />
    <meta property="og:image" content="https://snapsec.co/logos/dashbaoard-social-links.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Snapsec - Unified AppSec Platform" />
    <meta property="og:site_name" content="Snapsec" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://snapsec.co" />
    <meta name="twitter:title" content="Snapsec - Unified AppSec Platform | Comprehensive Security Suite" />
    <meta name="twitter:description" content="Enterprise-grade application security platform. Manage vulnerabilities, scan your attack surface, protect APIs, and secure your entire digital infrastructure with AI-powered insights." />
    <meta name="twitter:image" content="https://snapsec.co/logos/square-large.png" />
    <meta name="twitter:image:alt" content="Snapsec - Unified AppSec Platform" />
    <meta name="twitter:site" content="@snapsec" />
    <meta name="twitter:creator" content="@snapsec" />

    <!-- LinkedIn -->
    <meta property="og:image:type" content="image/png" />

    <!-- Additional Meta Tags -->
    <meta name="theme-color" content="#3b82f6" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- Favicon and Apple Touch Icons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/logos/square-medium.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/logos/blue-mini.svg" />
    <link rel="icon" type="image/png" sizes="16x16" href="/logos/blue-mini.svg" />

    <script defer src="https://cloud.xxx.is/script.js" data-website-id="2c4855e0-2333-4eb1-a38f-fd989b9f7755"></script>
    <script type="module" crossorigin src="/assets/index-DzS0FNdW.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-C8m5h8Yc.css">
  <script async src="https://bolt.new/badge.js?s=12534748-8afd-4ba1-ade3-bc7396f2d1d9"></script></head>
  <body>
    <div id="root"></div>
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"version":"2024.11.0","token":"421a95f8f64f457792c65bbafbf3cda7","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}' crossorigin="anonymous"></script>
</body>
</html>
`,
            mode: "raw",
            format: "json"
        },
        size: 1024,
        time: 150 // response time in ms
    };

    // Use provided request/response or defaults
    const req = request || defaultRequest;
    const res = response || defaultResponse;


    let domainStatusArray = [];

    // Initialize ScanMemory if context is provided
    let memory = null;
    const { scanContext } = request || {};

    if (scanContext && scanContext.scanId && scanContext.applicationId) {
        const ScanMemory = require('./scan-memory.js');
        memory = new ScanMemory({
            scannerName: 'expired-library',
            scanId: scanContext.scanId,
            applicationId: scanContext.applicationId
        });
    }

    if (res.headers["Content-Type"]?.includes("text/html")) {
        console.log("[*] Starting expired library scan...");
        const htmlContent = res.body.content;
        const urlPattern = /https?:\/\/[^\s"'<>]+/g;
        const foundUrls = [...new Set(htmlContent.match(urlPattern) || [])];
        console.log(`[~] Extracted ${foundUrls.length} unique URLs to check.`);

        const dns = require('dns').promises;

        domainStatusArray = await Promise.all(foundUrls.map(async (link) => {
            try {
                // Deduplication using ScanMemory
                const domain = new URL(link).hostname;
                if (memory) {
                    if (memory.hasSeen(domain)) {
                        console.log(`[~] Skipping duplicate Domain: ${domain}`);
                        return null;
                    }
                    // Store immediately to prevent race conditions in concurrent processing if any
                    // In this map sequence, it acts as claiming the work.
                    memory.store(domain, { storedAt: Date.now() });
                }


                try {
                    await Promise.any([
                        dns.resolve(domain, 'A'),
                        dns.resolve(domain, 'AAAA')
                    ]);
                    // Domain is live
                    return { link, domain, status: "live" };
                } catch (err) {
                    console.log(`[!] Dead domain detected: ${domain}`);
                    return { link, domain, status: "dead" };
                }
            } catch (err) {
                return null;
            }
        }));
        domainStatusArray = domainStatusArray.filter(item => item !== null);
        console.log("[~] DNS resolution checks completed.");
    }

    const finalReports = [];

    for (const item of domainStatusArray) {
        if (item.status === "dead") {
            finalReports.push({
                title: "Expired Domain / Broken Link Hijacking",
                description: `The application references an external resource at ${item.link}, but the domain ${item.domain} appears to be dead or unreachable. This vulnerability, known as Broken Link Hijacking, allows an attacker to register the expired domain and serve malicious content, potentially leading to full application compromise.`,
                severity: "high",
                type: "broken-link-hijacking",
                cwe: "CWE-494",
                cvssScore: "8.2",
                tags: ["domain-hijacking", "supply-chain", "external-resource"],
                affectedUrl: item.link,
                domain: item.domain,
                stepsToReproduce: `1. Examine the page source for external script or link tags.\n2. Identify the reference to ${item.link}.\n3. Verify that the domain ${item.domain} is no longer active or is available for registration.`,
                mitigation: "1. Remove references to dead or unreachable domains.\n2. Host third-party libraries locally or use trusted CDNs with Subresource Integrity (SRI).\n3. Implement a Content Security Policy (CSP) to restrict script sources.",
                impact: "An attacker who registers the expired domain can execute arbitrary JavaScript in the context of the user's session, leading to session hijacking, data theft, and phishing.",
                remediation: "Audit all external dependencies and remove any links to domains that are no longer operational."
            });
        }
    }

    return finalReports;

}

module.exports = { expiredLibraryScan };