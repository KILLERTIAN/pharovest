import { generateProjectContent } from "../generativeProject.js";

/**
 * Controller to handle AI project content generation
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const generateAiProjectContent = async (req, res) => {
    const { promptData } = req.body; // Extract the promptData from the request body

    try {
        // Validate the promptData input: only description is mandatory
        if (!promptData || typeof promptData !== 'object' || !promptData.description || !promptData.description.trim()) {
            return res.status(400).json({ message: "A valid description is required." });
        }

        // Call the function to generate project content using the user-provided description
        const aiResponse = await generateProjectContent(promptData.description);

        // Send the AI-generated content back to the client
        res.status(200).json({ content: aiResponse });
    } catch (error) {
        console.error("Error in generateAiProjectContent controller:", error);
        res.status(500).json({ message: "Failed to generate project content." });
    }
};
