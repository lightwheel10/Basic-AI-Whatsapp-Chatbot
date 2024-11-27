import { Message, MessageMedia } from 'whatsapp-web.js';
import { ConversationState, User } from '../models/types';
import { storage } from './storage';
import { v4 as uuidv4 } from 'uuid';

export class WhatsAppService {
    async handleMessage(message: Message) {
        const from = message.from;
        const user = await this.getOrCreateUser(from);
        
        switch (user.conversation_state) {
            case ConversationState.WELCOME:
                return this.handleWelcome(message, user);
            case ConversationState.ASKING_NAME:
                return this.handleName(message, user);
            case ConversationState.ASKING_DISTRICT:
                return this.handleDistrict(message, user);
            case ConversationState.ASKING_CITY:
                return this.handleCity(message, user);
            case ConversationState.ASKING_STATE:
                return this.handleState(message, user);
            case ConversationState.REQUESTING_AADHAR:
                return this.handleAadhar(message, user);
            case ConversationState.COMPLETED:
                return this.handleCompleted(message, user);
            default:
                await message.reply('Sorry, something went wrong. Type "restart" to begin again.');
        }
    }

    private async getOrCreateUser(whatsappNumber: string): Promise<User> {
        const users = await storage.getUsers();
        const user = users.find(u => u.whatsapp_number === whatsappNumber);

        if (user) return user;

        const newUser: User = {
            id: uuidv4(),
            whatsapp_number: whatsappNumber,
            name: '',
            district: '',
            city: '',
            state: '',
            aadhar_document_url: '',
            conversation_state: ConversationState.WELCOME,
            created_at: new Date(),
            updated_at: new Date()
        };

        users.push(newUser);
        await storage.saveUsers(users);
        return newUser;
    }

    private async updateUser(userId: string, updates: Partial<User>) {
        const users = await storage.getUsers();
        const index = users.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            users[index] = {
                ...users[index],
                ...updates,
                updated_at: new Date()
            };
            await storage.saveUsers(users);
        }
    }

    private async handleWelcome(message: Message, user: User) {
        await message.reply('Welcome! Please share your name.');
        await this.updateUser(user.id, { conversation_state: ConversationState.ASKING_NAME });
    }

    private async handleName(message: Message, user: User) {
        await this.updateUser(user.id, {
            name: message.body,
            conversation_state: ConversationState.ASKING_DISTRICT
        });
        await message.reply('Thank you! Please share your district.');
    }

    private async handleDistrict(message: Message, user: User) {
        await this.updateUser(user.id, {
            district: message.body,
            conversation_state: ConversationState.ASKING_CITY
        });
        await message.reply('Thanks! Now, please share your city.');
    }

    private async handleCity(message: Message, user: User) {
        await this.updateUser(user.id, {
            city: message.body,
            conversation_state: ConversationState.ASKING_STATE
        });
        await message.reply('Great! Please share your state.');
    }

    private async handleState(message: Message, user: User) {
        await this.updateUser(user.id, {
            state: message.body,
            conversation_state: ConversationState.REQUESTING_AADHAR
        });
        await message.reply('Perfect! Finally, please share your Aadhar card image.');
    }

    private async handleAadhar(message: Message, user: User) {
        if (!message.hasMedia) {
            await message.reply('Please send an image of your Aadhar card.');
            return;
        }

        try {
            const media = await message.downloadMedia();
            if (!media || !media.mimetype.startsWith('image/')) {
                await message.reply('Please send a valid image file.');
                return;
            }

            const fileName = `aadhar_${user.id}_${Date.now()}.${media.mimetype.split('/')[1]}`;
            const filePath = await storage.saveDocument(fileName, Buffer.from(media.data, 'base64'));

            await this.updateUser(user.id, {
                aadhar_document_url: filePath,
                conversation_state: ConversationState.COMPLETED
            });

            await message.reply('Thank you! Your registration is complete.');
        } catch (error) {
            console.error('Error handling Aadhar upload:', error);
            await message.reply('Sorry, there was an error uploading your Aadhar card. Please try again.');
        }
    }

    private async handleCompleted(message: Message, user: User) {
        if (message.body.toLowerCase() === 'restart') {
            await this.updateUser(user.id, { conversation_state: ConversationState.WELCOME });
            await message.reply('Let\'s start over. Please share your name.');
            return;
        }
        await message.reply('Your registration is already complete. Type "restart" to begin again.');
    }
} 