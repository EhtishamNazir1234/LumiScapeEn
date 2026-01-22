import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  content: {
    type: String
  },
  category: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const troubleshootingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subheading: {
    type: String
  },
  steps: [{
    type: String
  }],
  category: {
    type: String
  }
}, {
  timestamps: true
});

const FAQ = mongoose.model('FAQ', faqSchema);
const Article = mongoose.model('Article', articleSchema);
const TroubleshootingGuide = mongoose.model('TroubleshootingGuide', troubleshootingSchema);

export { FAQ, Article, TroubleshootingGuide };
