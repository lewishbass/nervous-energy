import mongoose from 'mongoose';

const SessionEventSchema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true,
		immutable: true,
	},
	eventType: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	data: {
		type: mongoose.Schema.Types.Mixed,
		default: {},
	},
});

// Add indexes for better query performance
SessionEventSchema.index({ timestamp: -1 });

const SessionSchema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true,
		unique: true,
		immutable: true,
	},
	startTime: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
	country: {
		type: String,
		required: false
	},
	city: {
		type: String,
		required: false
	},
	region: {
		type: String,
		required: false
	},
	ip: {
		type: String,
		required: false
	},
	userAgent: {
		type: String,
		required: false
	},
	browser: {
		type: String,
		required: false
	},
	os: {
		type: String,
		required: false
	},
	device: {
		type: String,
		required: false
	},
	screenSize: {
		type: [Number],
		required: false
	},
	viewport: {
		type: [Number],
		required: false
	},
	language: {
		type: String,
		required: false
	},
	timezone: {
		type: String,
		required: false
	},
	source: {
		type: String,
		required: false
	},
	events: {
		type: [SessionEventSchema],
		default: [],
	},
});

SessionSchema.index({ lastUpdated: -1 });

SessionSchema.pre('findOneAndUpdate', function (next) {
	this.set({ lastUpdated: new Date() });
	next();
});

SessionSchema.pre('save', function (next) {
	this.lastUpdated = new Date();
	next();
});

const SessionModel = mongoose.models.Session || mongoose.model('Session', SessionSchema);
const SessionEventModel = mongoose.models.SessionEvent || mongoose.model('SessionEvent', SessionEventSchema);


export { SessionModel, SessionEventModel };