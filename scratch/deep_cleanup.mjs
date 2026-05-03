import fs from 'fs';
import path from 'path';

const storeDir = './public/store';
const files = fs.readdirSync(storeDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(storeDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Aggressively remove ANY script tag that contains "sys-"
    const lines = content.split('\\n');
    let inScriptToRemove = false;
    let newContent = [];
    
    // We'll use a simpler approach: remove anything that looks like our injected scripts
    content = content.replace(/<script[^>]*sys-[^>]*>[\\s\\S]*?<\\/script>/g, '');
    content = content.replace(/<script id=\"sys-[^>]*\">[\\s\\S]*?<\\/script>/g, '');
    content = content.replace(/<script data-sys-[^>]*>[\\s\\S]*?<\\/script>/g, '');
    
    fs.writeFileSync(filePath, content);
});
console.log('Deep cleanup of all sys-related scripts completed.');
