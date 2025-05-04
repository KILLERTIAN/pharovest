import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Reference to Project model
    contributor: { type: String, required: true }, // Blockchain wallet address as string
    amount: { type: Number, required: true }, // Transaction amount in ETH
    transactionHash: { type: String, required: true }, // Blockchain transaction hash
    network: { 
        type: String, 
        enum: ['Ethereum', 'Sepolia', 'Polygon', 'Binance', 'Pharos', 'Pharos Testnet', 'Pharos Devnet'], 
        required: true 
    }, // Network name including Pharos networks
    status: { type: String, enum: ["pending", "confirmed", "failed"], required: true }, // Transaction status
    usdValue: { type: Number }, // Optional field for USD value of the contribution
    gasFees: { type: Number }, // Optional field for recording gas fees
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
