import { whatsappClient } from './config/whatsapp';
import { WhatsAppService } from './services/whatsapp';
import { storage } from './services/storage';
import qrcode from 'qrcode-terminal';

const whatsappService = new WhatsAppService();

async function init() {
    await storage.init();
    
    whatsappClient.on('qr', (qr) => {
        console.clear();
        console.log('\nScan QR Code:\n');
        qrcode.setErrorLevel('L');
        qrcode.generate(qr, { small: true });
    });

    whatsappClient.on('ready', () => {
        console.clear();
        console.log('WhatsApp Client is ready!');
        console.log('Your WhatsApp number:', whatsappClient.info.wid.user);
        console.log('\nSend a message to this number to test the bot.');
    });

    whatsappClient.on('auth_failure', msg => {
        console.error('Authentication failed:', msg);
    });

    whatsappClient.on('disconnected', (reason) => {
        console.log('Client was disconnected:', reason);
    });

    whatsappClient.on('message', async (message) => {
        // Ignore messages from ourselves and status updates
        if (message.fromMe || message.from === 'status@broadcast') return;

        // Log the chat info
        const chat = await message.getChat();
        console.log('Received message:', {
            from: message.from,
            body: message.body,
            hasMedia: message.hasMedia,
            isGroup: chat.isGroup,
            chatName: chat.name
        });
        
        try {
            await whatsappService.handleMessage(message);
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    console.log('Initializing WhatsApp client...');
    await whatsappClient.initialize();
}

init().catch(console.error); 