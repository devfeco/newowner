import { Schema, model, models, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import { IUser } from '../lib/types'

interface UserDocument extends Document, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'İsim alanı gereklidir'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email alanı gereklidir'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Lütfen geçerli bir email adresi girin',
      ],
    },
    password: {
      type: String,
      required: [true, 'Şifre alanı gereklidir'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
      select: false,
    },
    userType: {
      type: String,
      enum: ['buyer', 'seller'],
      default: undefined,
    }
  },
  { timestamps: true }
)

// Şifre hash'leme
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password as string, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

const User = models.User || model<UserDocument>('User', userSchema)

export default User 