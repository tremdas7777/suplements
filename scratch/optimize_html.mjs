import fs from 'fs';
import path from 'path';

const STORE_DIR = path.join(process.cwd(), 'public', 'store');

// Keywords of heavy/tracking scripts we want to remove to speed up loading
const BAD_DOMAINS = [
    'klaviyo.com',
    'mention-me.com',
    'facebook.net',
    'google-analytics.com',
    'googletagmanager.com',
    'tiktok.com',
    'snapchat.com',
    'hotjar.com',
    'clarity.ms',
    'cloudflareinsights.com'
];

function optimizeFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalLength = content.length;
        
        // Remove <script> tags that load bad domains
        // regex to match <script ... src="...klaviyo..."></script>
        const scriptSrcRegex = /<script\b[^>]*src=["'][^"']*?(?:klaviyo\.com|mention-me\.com|facebook\.net|google-analytics\.com|googletagmanager\.com|tiktok\.com|snapchat\.com|hotjar\.com|clarity\.ms|cloudflareinsights\.com)[^"']*?["'][^>]*>[\s\S]*?<\/script>/gi;
        
        content = content.replace(scriptSrcRegex, '');

        // Remove inline scripts containing bad keywords
        const inlineScriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        content = content.replace(inlineScriptRegex, (match, scriptContent) => {
            for (let domain of BAD_DOMAINS) {
                if (scriptContent.toLowerCase().includes(domain.replace('.com', '').replace('.net', '').replace('.ms', ''))) {
                    return ''; // Remove this script
                }
            }
            // Also remove large inline JSON that might be klaviyo state
            if (scriptContent.includes('klaviyo') && scriptContent.length > 500) {
                return '';
            }
            return match;
        });

        // Optimization: remove huge comment blocks added by Shopify apps
        const commentRegex = /<!--[\s\S]*?-->/g;
        content = content.replace(commentRegex, '');

        if (content.length !== originalLength) {
            fs.writeFileSync(filePath, content, 'utf-8');
            return true;
        }
        return false;
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
        return false;
    }
}

function processDirectory(dir) {
    console.log(`Scanning ${dir} for HTML files...`);
    const files = fs.readdirSync(dir);
    let optimizedCount = 0;
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            optimizedCount += processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            if (optimizeFile(fullPath)) {
                optimizedCount++;
            }
        }
    }
    
    return optimizedCount;
}

console.log('Starting optimization of store HTML files...');
const startTime = Date.now();
const count = processDirectory(STORE_DIR);
const duration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`Optimization complete in ${duration}s. Modified ${count} HTML files.`);
