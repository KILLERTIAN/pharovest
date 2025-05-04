import Transaction from '../models/Transaction.model.js';
import Project from '../models/Project.model.js';

// Create a new transaction and update project contributions
export const createTransaction = async (req, res) => {
    try {
        const { 
            project, 
            contributor, 
            amount, 
            transactionHash, 
            network, 
            status,
            usdValue 
        } = req.body;
        
        // Validate required fields
        if (!project || !contributor || !amount || !transactionHash || !network || !status) {
            return res.status(400).json({ 
                message: "Missing required fields: project, contributor, amount, transactionHash, network, and status are required" 
            });
        }
        
        // Find the project to update its amountRaised
        const projectDoc = await Project.findOne({ id: project });
        
        if (!projectDoc) {
            return res.status(404).json({ message: `Project with ID ${project} not found` });
        }
        
        // Create the transaction
        const newTransaction = new Transaction({
            project: projectDoc._id, // MongoDB ID reference
            contributor, // Use the blockchain address as is for now
            amount: parseFloat(amount),
            transactionHash,
            network,
            status,
            usdValue: usdValue ? parseFloat(usdValue) : undefined
        });
        
        // Save the transaction
        await newTransaction.save();
        
        // Update project amount raised (convert from "$X" format to a number, add the new amount, and format back)
        let currentAmount = 0;
        if (projectDoc.amountRaised && projectDoc.amountRaised.startsWith('$')) {
            currentAmount = parseFloat(projectDoc.amountRaised.substring(1).replace(/,/g, '')) || 0;
        }
        
        // Add the new USD value
        const newAmount = currentAmount + (parseFloat(usdValue) || 0);
        projectDoc.amountRaised = `$${newAmount.toFixed(2)}`;
        
        // Increment contributors count
        projectDoc.contributors = (projectDoc.contributors || 0) + 1;
        
        // Save the updated project
        await projectDoc.save();
        
        res.status(201).json({ 
            message: "Transaction saved successfully", 
            transaction: newTransaction,
            updatedProject: {
                id: projectDoc.id,
                amountRaised: projectDoc.amountRaised,
                contributors: projectDoc.contributors
            }
        });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get transactions by project ID and optionally by contributor address
export const getTransactions = async (req, res) => {
    try {
        const { project, contributor } = req.query;
        
        if (!project) {
            return res.status(400).json({ message: "Project ID is required" });
        }
        
        // Find the project to get its MongoDB ID
        const projectDoc = await Project.findOne({ id: project });
        
        if (!projectDoc) {
            return res.status(404).json({ message: `Project with ID ${project} not found` });
        }
        
        // Build query based on parameters
        const query = { project: projectDoc._id };
        if (contributor) {
            query.contributor = contributor;
        }
        
        // Try to get real transactions from database
        const dbTransactions = await Transaction.find(query).sort({ createdAt: -1 });
        
        if (dbTransactions && dbTransactions.length > 0) {
            // Format transactions for frontend
            const formattedTransactions = dbTransactions.map(tx => ({
                id: tx._id.toString(),
                projectId: project,
                contributor: tx.contributor,
                amount: tx.amount.toString(),
                network: tx.network,
                timestamp: tx.createdAt.toISOString(),
                txHash: tx.transactionHash,
                status: tx.status,
                usdValue: tx.usdValue ? tx.usdValue.toString() : undefined
            }));
            
            return res.status(200).json(formattedTransactions);
        }
        
        // If no transactions found, return sample data for testing
        const sampleTransactions = [
            {
                id: "sample-tx1",
                projectId: project,
                contributor: contributor || "0x6e6ccc0cfAffE650AB34A911324706cc1Af57b0D",
                amount: "0.05",
                network: "Pharos Devnet",
                timestamp: new Date().toISOString(),
                txHash: "0x7d9c5f8a1ef764faed6eb2856fec570bc892a8102d4c5d77b1c889c3c1d9fca3",
                status: "confirmed"
            }
        ];
        
        return res.status(200).json(sampleTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
