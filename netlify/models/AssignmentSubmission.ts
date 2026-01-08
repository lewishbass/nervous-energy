import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const AssignmentSubmissionSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		immutable: true,
	},
	id: {
		type: String,
		default: uuidv4,
		unique: true,
		immutable: true,
	},
	userId: {
		type: String,
		required: true,
		immutable: true,
	},
	className: {
		type: String,
		required: true,
		immutable: true,
	},
	assignmentName: {
		type: String,
		required: true,
		immutable: true,
	},
	submissionData: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
});

AssignmentSubmissionSchema.index({ username: 1, className: 1, assignmentName: 1 });

AssignmentSubmissionSchema.pre('save', function (next) {
	if (!this.submittedAt) {
		this.submittedAt = new Date();
	}
	next();
});

const AssignmentSubmissionModel = mongoose.models.AssignmentSubmission || mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);

export default AssignmentSubmissionModel;