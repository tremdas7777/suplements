import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const files = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('products_') && f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');

    const selectCheapestScript = `
<script id="sys-select-cheapest">
(function() {
    function selectCheapest() {
        // Find all radio inputs for variant selection
        const radios = document.querySelectorAll('input[type="radio"][name="id"], input[type="radio"][name="Size"], input[type="radio"][name="Größe"]');
        if (radios.length === 0) return;

        // Try to find the cheapest one from the JSON data if available
        // or just pick the first one which is usually the smallest/cheapest.
        
        // However, some themes have a specific order.
        // Let's look for the labels and find the one that mentions "30g" or "sample".
        let cheapest = radios[0];
        radios.forEach(r => {
            const label = document.querySelector('label[for="' + r.id + '"]');
            if (label && (label.innerText.toLowerCase().includes('30g') || label.innerText.toLowerCase().includes('probe'))) {
                cheapest = r;
            }
        });

        if (cheapest && !cheapest.checked) {
            cheapest.click();
            console.log('Selected cheapest variant to match collection price.');
        }
    }
    
    // Run after a short delay to allow theme JS to initialize
    setTimeout(selectCheapest, 1000);
    setTimeout(selectCheapest, 3000); // Second attempt
})();
</script>`;

    if (html.includes('id="sys-select-cheapest"')) {
        html = html.replace(/<script id="sys-select-cheapest">[\s\S]*?<\/script>/, selectCheapestScript);
    } else {
        html = html.replace('</body>', selectCheapestScript + '</body>');
    }

    fs.writeFileSync(filePath, html);
});
