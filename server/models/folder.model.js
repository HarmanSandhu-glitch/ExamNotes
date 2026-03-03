import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: "#7c3aed"
  }
}, { timestamps: true })

const Folder = mongoose.model("Folder", folderSchema)

export default Folder
