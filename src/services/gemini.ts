import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from 'fs/promises';

// System instructions for the bot
const SYSTEM_PROMPT = `You are a helpful WhatsApp bot assistant designed to help users with their queries. 

Your responsibilities:
1. Help users with their questions
2. Maintain a professional yet friendly tone
3. Keep responses concise and clear
4. Handle basic troubleshooting
5. Collect user feedback

Guidelines:
- Keep responses under 200 words
- Use emojis sparingly for better engagement
- Always be polite and patient
- If you don't know something, say so
- Never share personal or sensitive information
- Don't make promises about service availability`;

export class GeminiService {
    private model;
    private fileManager;

    constructor() {
        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            throw new Error("GEMINI_API_KEY is not set in environment variables");
        }
        const genAI = new GoogleGenerativeAI(API_KEY);
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.fileManager = new GoogleAIFileManager(API_KEY);
    }

    async processMessage(message: string): Promise<string> {
        try {
            const fullPrompt = `${SYSTEM_PROMPT}\n\nUser message: ${message}\n\nResponse:`;
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error processing message with Gemini:', error);
            return 'I apologize, but I encountered an error processing your message. Please try again.';
        }
    }

    async analyzeImage(imagePath: string, prompt: string): Promise<string> {
        try {
            // Upload the file using File API
            const uploadResult = await this.fileManager.uploadFile(imagePath, {
                mimeType: 'image/jpeg',
                displayName: `analysis_${Date.now()}`
            });

            // Generate content using the uploaded file
            const result = await this.model.generateContent([
                prompt,
                {
                    fileData: {
                        fileUri: uploadResult.file.uri,
                        mimeType: uploadResult.file.mimeType
                    }
                }
            ]);

            // Clean up - delete the uploaded file
            await this.fileManager.deleteFile(uploadResult.file.name);

            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error analyzing image with Gemini:', error);
            return 'I apologize, but I encountered an error analyzing the image. Please try again.';
        }
    }

    async validateAadharCard(imagePath: string): Promise<{ isValid: boolean; message: string }> {
        const prompt = `Analyze this image and determine if it appears to be a valid Indian Aadhar card. 
        Check for:
        1. Standard Aadhar card layout
        2. Presence of UIDAI logo
        3. 12-digit Aadhar number format
        4. Demographic information fields
        
        Respond with a clear yes/no and explanation. DO NOT include any personal information from the card in your response.`;

        try {
            const result = await this.analyzeImage(imagePath, prompt);
            const isValid = result.toLowerCase().includes('yes') || result.toLowerCase().includes('valid');
            return {
                isValid,
                message: result
            };
        } catch (error) {
            console.error('Error validating Aadhar card:', error);
            return {
                isValid: false,
                message: 'Error validating the document. Please try again.'
            };
        }
    }

    // Helper method to list all uploaded files
    async listFiles(): Promise<void> {
        try {
            const response = await this.fileManager.listFiles();
            console.log('Uploaded files:');
            if (response && response.files && Array.isArray(response.files)) {
                for (const file of response.files) {
                    console.log(`- ${file.displayName} (${file.name})`);
                }
            } else {
                console.log('No files found');
            }
        } catch (error) {
            console.error('Error listing files:', error);
        }
    }
} 