import mongoose from 'mongoose';

const WorkExperienceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: [String],
    projects: [{
        projectName: { type: String, required: true },
        content: { type: String },
        role: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
    }],
    workHistory: [{
        companyName: { type: String, required: true },
        role: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
    }],
});

export default mongoose.model('WorkExperience', WorkExperienceSchema);