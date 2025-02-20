import mongoose from "mongoose";

// Define the Account schema
const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Link to the User model
    required: true,
  },
  accountId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isAccountComplete: { 
    type: Boolean, 
    default: false, // Default value set to false
  },
});

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);