import { Client } from 'whatsapp-web.js';

export const whatsappClient = new Client({
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
        headless: true
    },
    qrMaxRetries: 5,
    authTimeoutMs: 60000
}); 