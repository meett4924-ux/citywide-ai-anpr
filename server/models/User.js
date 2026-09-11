import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export const USER_ROLES = ['Administrator', 'Traffic Officer', 'Police Officer', 'Traffic Analyst', 'Viewer']

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    organization: { type: String, trim: true, default: '' },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'Viewer',
    },
    avatar: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
