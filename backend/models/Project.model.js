import mongoose from "mongoose";

// Milestone Schema
const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    completionDate: { type: Date, required: true },
    amountRequired: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
}, { timestamps: true }); 

// Community Feedback Schema
const communityFeedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedback: { type: String, required: true }
}, { timestamps: true });

// Contribution Schema
const contributionSchema = new mongoose.Schema({
    donatedAt: { type: Date, default: Date.now },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    network: { type: String, required: true }, // e.g., Ethereum, Sepolia
    amount: { type: Number, required: true },
    usdValue: { type: Number }
}, { timestamps: true });

// Project Schema
const projectSchema = new mongoose.Schema({
    id: { 
        type: String, 
        unique: true, 
        required: true,
        // Add validation to ensure numeric strings
        validate: {
            validator: function(v) {
                return !isNaN(parseInt(v, 10));
            },
            message: props => `${props.value} is not a valid numeric ID!`
        }
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: String, required: true },  // Changed to String to accept direct creator names
    avatar: String,
    image: String,  // Single image field 
    images: [String],  // Multiple images (optional)
    amountRaised: String,
    contributors: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    minimumDonation: String,
    milestones: [milestoneSchema],
    communityFeedback: [communityFeedbackSchema],
    contributions: [contributionSchema],
    category: String,
    fundingStatus: String,  // Added for search filter
    location: String,  // Added for search filter
    analytics: String,  // Added for detailed analytics
    aiSuggested: { type: Boolean, default: false },  // Added for AI project suggestions
    blockchainHash: { type: String }  // Transaction hash from the blockchain
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;
