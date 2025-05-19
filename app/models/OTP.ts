import { Schema, model, models } from 'mongoose'

const otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index, belge expiresAt süresinde otomatik silinir
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 dakika sonra otomatik silinir (saniye cinsinden)
  }
})

const OTP = models.OTP || model('OTP', otpSchema)

export default OTP 