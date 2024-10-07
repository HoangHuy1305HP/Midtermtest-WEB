import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    birthplace: { type: String },
    nationality: { type: String },
    education: { type: String },
    hobbies: [String],
    goals: [String],
});

export default mongoose.model('Profile', ProfileSchema);