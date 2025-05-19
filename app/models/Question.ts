import { Schema, model, models } from 'mongoose'

const answerSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
})

const questionSchema = new Schema({
  listingId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'Listing' 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  question: { 
    type: String, 
    required: true 
  },
  answers: [answerSchema],
  isAnswered: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
})

const Question = models.Question || model('Question', questionSchema)

export default Question 