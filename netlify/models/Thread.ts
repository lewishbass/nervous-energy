import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import UserModel from './User';

// Thread schema
// threads contain message info and array of thread children
const ThreadSchema = new mongoose.Schema({
	id: {
		type: String,
		default: uuidv4,
		required: true,
		unique: true,
	},
	creatorId: {
		type: String,
		required: true,
		ref: 'User',
	},
	parentMessageId: {
		type: String,
		required: false,
		ref: 'Thread',
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	lastUpdated: { // when this specific thread was last updated
		type: Date,
		default: Date.now,
	},
	lastDirtied: { // when this thread or any of its children were last updated
		type: Date,
		default: Date.now,
	},
	title: {
		type: String,
		required: false,
		default: '',
	},
	content: {
		type: String,
		required: true,
		default: '',
	},
	children: [{
		type: String,
		ref: 'Thread',
	}],
	upvotes: [{
		type: String,
		ref: 'User',
	}],
	downvotes: [{
		type: String,
		ref: 'User',
	}],
	score:{
		type: Number,
		default: 0,
	},
});

ThreadSchema.index({ id: 1, parentMessageId: 1 });
ThreadSchema.index({ creatorId: 1, id: 1 });

ThreadSchema.pre('save', async function(next) {
	const modifiedPaths = this.modifiedPaths();
	this.score = this.upvotes.length - this.downvotes.length;
	
	// Check if only lastDirtied is modified (or if it's a new document)
	const onlyLastDirtiedModified = this.isModified('lastDirtied') && 
		modifiedPaths.length === 1 && 
		modifiedPaths[0] === 'lastDirtied';
	
	if(onlyLastDirtiedModified) {
		// Dirty parent thread only - consider moving this to a post-save hook
		// or using a separate update method to avoid nested saves
		if (this.parentMessageId) {
			try {
				await (this.constructor as mongoose.Model<any>).findOneAndUpdate(
					{ id: this.parentMessageId }, 
					{ lastDirtied: new Date() }, 
					{ new: true }
				);
			} catch (error) {
				console.error('Error updating parent lastDirtied:', error);
				// Continue anyway - don't fail the save for parent update issues
			}
		}
		return next();
	}
	
	this.lastUpdated = new Date();
	this.lastDirtied = new Date();

	
	// Auto-generate title from content if empty
	//if(!this.title || this.title.trim() === '') {
	//	this.title = this.content.substring(0, 30) + (this.content.length > 30 ? '...' : '');
	//}
	
	next();
});

const ThreadModel = mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);

export { ThreadModel };