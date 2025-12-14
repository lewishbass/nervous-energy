import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		immutable: true,
	},
	title: {
		type: String,
		required: true,
	},
	authors: {
		type: [String],
		required: false,
	},
	abstract: {
		type: String,
		required: false,
	},
	arxivId: {
		type: String,
		required: false,
	},
	pdfUrl: {
		type: String,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

ArticleSchema.pre('save', function (next) {
	if (!this.createdAt) {
		this.createdAt = new Date();
	}
	next();
});

const ArticleModel = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

export default ArticleModel;
