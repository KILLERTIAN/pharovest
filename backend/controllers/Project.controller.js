// controllers/Project.controller.js
import Project from '../models/Project.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
// import { contract } from '../utils/ether.js';

// Create a new project
export const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            amountRaised,
            contributors,
            upvotes,
            minimumDonation,
            milestones,
            communityFeedback,
            contributions,
            category,
            blockchainHash
        } = req.body;

        // Fetch user details from req.user (set by authentication middleware)
        const creator = req.body.creator || req.user?.name || 'Anonymous'; 
        const avatar = req.body.avatar || req.user?.profileImage || 'https://res.cloudinary.com/djoebsejh/image/upload/v1727181418/u6fshzccb1vhxk2bzopn.png';

        let imageUrl = '';
        
        if (req.file) {
            try {
                // Upload image to Cloudinary
                const imageFilePath = req.file.path;
                
                // Check if file exists before uploading
                if (fs.existsSync(imageFilePath)) {
                    const cloudinaryResponse = await uploadOnCloudinary(imageFilePath);
                    imageUrl = cloudinaryResponse ? cloudinaryResponse.secure_url : '';
                    
                    // Clean up the temp file after upload
                    try {
                        fs.unlinkSync(imageFilePath);
                    } catch (cleanupError) {
                        console.error('Error cleaning up temp file:', cleanupError);
                    }
                } else {
                    console.error('Image file does not exist at path:', imageFilePath);
                }
            } catch (imageError) {
                console.error('Error processing image:', imageError);
                // Continue with default image
                imageUrl = 'https://res.cloudinary.com/dl5umecqi/image/upload/v1726407271/dlaxexxjsiedijw8vrk4.png';
            }
        } else {
            // Set a default image if no image was provided
            imageUrl = 'https://res.cloudinary.com/dl5umecqi/image/upload/v1726407271/dlaxexxjsiedijw8vrk4.png';
        }

        // Helper function to safely parse JSON data
        const safeJsonParse = (data) => {
            try {
                return data ? JSON.parse(data) : [];
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return [];
            }
        };

        // Find the last project in the database and set a new ID
        const lastProject = await Project.findOne().sort({ id: -1 });
        
        // If ID is provided in the request body (from blockchain), use it
        // Otherwise, generate a new ID
        let newId;
        if (req.body.id) {
            newId = parseInt(req.body.id, 10);
            // Ensure it's a valid number
            if (isNaN(newId)) {
                return res.status(400).json({ msg: 'Invalid ID format' });
            }
        } else {
            // Auto-generate ID if not provided
            // Ensure the ID is numeric - Start from 23 as requested
            if (!lastProject) {
                newId = 23; // Start from 23 if there are no projects
            } else {
                // Convert the existing ID to a number, even if it's stored as a string
                const lastIdAsNumber = parseInt(lastProject.id, 10);
                newId = !isNaN(lastIdAsNumber) ? lastIdAsNumber + 1 : 23;
            }
        }
        
        // Convert the ID to a string for storage but ensure it's created from a number
        const idAsString = String(newId);

        // Save project details in MongoDB
        const newProject = new Project({
            id: idAsString,
            title,
            description,
            creator,
            avatar, 
            image: imageUrl,
            amountRaised,
            contributors,
            upvotes,
            minimumDonation,
            milestones: safeJsonParse(milestones),
            communityFeedback: safeJsonParse(communityFeedback),
            contributions: safeJsonParse(contributions),
            category,
            blockchainHash // Add the blockchain transaction hash
        });

        // Save the new project in the database
        await newProject.save();

        return res.status(201).json({ msg: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};


// Get all projects
export const getAllProjects = async (req, res) => {
    try {
        // Fetch all projects
        const projects = await Project.find();
        
        // Sort projects by ID numerically (not lexicographically)
        projects.sort((a, b) => {
            const aId = parseInt(a.id, 10);
            const bId = parseInt(b.id, 10);
            return aId - bId;
        });
        
        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
};

// Get a project by ID
export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // Try to find the project directly by ID first
        let project = await Project.findOne({ id: projectId });
        
        // If not found directly, try loading all projects and finding the match
        if (!project) {
            const allProjects = await Project.find();
            // Try exact match first
            project = allProjects.find(p => p.id === projectId);
            
            // If still not found, try numeric matching (in case of number vs string comparison)
            if (!project && !isNaN(parseInt(projectId, 10))) {
                const numericId = parseInt(projectId, 10);
                project = allProjects.find(p => parseInt(p.id, 10) === numericId);
            }
        }
        
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.error('Error retrieving project:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
};

// Update blockchain hash for a project
export const updateBlockchainHash = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { blockchainHash } = req.body;

        if (!blockchainHash) {
            return res.status(400).json({ msg: 'Blockchain hash is required' });
        }

        // Find the project by ID
        const allProjects = await Project.find();
        const project = allProjects.find(p => p.id === String(projectId));

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        // Update the blockchain hash
        project.blockchainHash = blockchainHash;
        await project.save();

        return res.status(200).json({ 
            msg: 'Blockchain hash updated successfully', 
            project 
        });
    } catch (error) {
        console.error('Error updating blockchain hash:', error);
        return res.status(500).json({ msg: 'Server error', error: error.message });
    }
};
