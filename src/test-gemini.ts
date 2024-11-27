import { GeminiService } from './services/gemini';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

async function testGemini() {
    try {
        const gemini = new GeminiService();

        // Test 1: Basic message processing
        console.log('\n1. Testing basic message processing...');
        const response1 = await gemini.processMessage('Tell me a short story about a robot.');
        console.log('Response:', response1);

        // Test 2: Complex query
        console.log('\n2. Testing complex query...');
        const response2 = await gemini.processMessage('Explain quantum computing in simple terms.');
        console.log('Response:', response2);

        // Test 3: Error handling
        console.log('\n3. Testing error handling...');
        const response3 = await gemini.processMessage('');
        console.log('Response:', response3);

        // Test 4: Image analysis (if test image exists)
        const testImagePath = path.join(__dirname, '../test-data/test-image.jpg');
        if (fs.existsSync(testImagePath)) {
            console.log('\n4. Testing image analysis...');
            try {
                const response4 = await gemini.analyzeImage(
                    testImagePath,
                    'Describe this image in detail. What do you see?'
                );
                console.log('Response:', response4);
            } catch (error) {
                console.error('Image analysis error:', error);
            }
        } else {
            console.log('\n4. Skipping image analysis - no test image found');
            console.log('Add a test image at:', testImagePath);
        }

        // Test 5: Aadhar validation (if test image exists)
        const aadharImagePath = path.join(__dirname, '../test-data/test-aadhar.jpg');
        if (fs.existsSync(aadharImagePath)) {
            console.log('\n5. Testing Aadhar validation...');
            try {
                const response5 = await gemini.validateAadharCard(aadharImagePath);
                console.log('Validation result:', response5);
            } catch (error) {
                console.error('Aadhar validation error:', error);
            }
        } else {
            console.log('\n5. Skipping Aadhar validation - no test image found');
            console.log('Add a test image at:', aadharImagePath);
        }

        // Test 6: List uploaded files
        console.log('\n6. Testing file listing...');
        await gemini.listFiles();

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testGemini(); 