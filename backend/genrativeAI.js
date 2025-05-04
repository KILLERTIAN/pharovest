import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import dotenv from 'dotenv'; // Use `import` for dotenv

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const systemInstruction = fs.readFileSync('./systemInstructions.txt', 'utf-8');

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction,
});

const generationConfig = {
    temperature: 0.4,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2000,
};

/**
 * Function to generate content based on user input
 * @param {string} prompt - The user-provided prompt
 * @returns {string} - The generated response from the AI
 */
export async function generateContent(prompt) {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [
                {
                    role: "user",
                    parts: [
                        { text: "genrate me some content related to completion of the table purchase for the office" },
                    ],
                },
                {
                    role: "model",
                    parts: [
                        { text: "##  🎉  New Office Table - Let's Get Productive! 🎉\n\nIt's official! We've finally completed the purchase of our new office table. Let's give a round of applause to [mention team member(s) who spearheaded the purchase] for their hard work! \n\nThis new table will provide us with a [mention specific benefits, e.g., spacious and collaborative work area, ergonomic setup, etc.]  We're excited to see how this will [mention positive impacts, e.g., boost productivity, enhance team collaboration, improve workflow, etc.].\n\n**Here are a few things to look forward to:**\n\n* **[Mention specific features of the table, e.g., adjustable height, cable management system, etc.]**\n* **[Mention any plans for the table, e.g., team lunch, celebratory gathering, etc.]**\n* **[Mention any actions needed for setup, e.g.,  unpacking, assembly, etc.]**\n\nWe can't wait to get settled in and start working in our new, improved space! \n\n**Let's make the most of our new office table and continue to [mention company goal or value, e.g., grow together, achieve our goals, etc.]!**\n" },
                    ],
                },
                {
                    role: "user",
                    parts: [
                        { text: "i have created the software which is able to detect emotions and it will finally be out in 3 days. Make the post in 50 words and make it user-interactive." },
                    ],
                },
                {
                    role: "model",
                    parts: [
                        { text: "Get ready to connect on a deeper level! 🤯 Our emotion detection software launches in 3 days!  \n\nAre you excited to understand emotions better? \nTell us what you're most looking forward to using it for! 👇 \n#EmotionAI #TechLaunch #3DaysToGo \n" },
                    ],
                },
                {
                    role: "user",
                    parts: [
                        { text: "Our team completed milestone 1 and here is the progress: The food supply to last the orphanage 1 year is done and all the kids are happy and their tummies are full. Post in 60 words." },
                    ],
                },
                {
                    role: "model",
                    parts: [
                        { text: "🎉 Milestone 1 achieved! 🎉  We've successfully secured a year's worth of food for the orphanage!  Seeing the happy faces and full tummies of these amazing kids makes it all worthwhile.  ❤️  Thank you to everyone who contributed to this incredible achievement! #MakingADifference #OrphanageSupport #MilestoneReached \n" },
                    ],
                },
            ],
        });

        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content");
    }
}
