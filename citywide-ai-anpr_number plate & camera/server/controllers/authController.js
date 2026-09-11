import User, { USER_ROLES } from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    organization: user.organization,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
  }
}

export async function signup(req, res) {
  const { name, email, password, confirmPassword, organization, role } = req.body

  if (!name || !email || !password || !organization || !role) {
    return res.status(400).json({ message: 'Name, email, password, organization and role are all required.' })
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and confirm password do not match.' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' })
  }

  if (!USER_ROLES.includes(role)) {
    return res.status(400).json({ message: `Role must be one of: ${USER_ROLES.join(', ')}` })
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists.' })
  }

  const user = await User.create({ name, email, password, organization, role })
  const token = generateToken(user._id)

  res.status(201).json({ token, user: toSafeUser(user) })
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'This account has been deactivated. Contact your administrator.' })
  }

  const token = generateToken(user._id)
  res.status(200).json({ token, user: toSafeUser(user) })
}

export async function getMe(req, res) {
  res.status(200).json(toSafeUser(req.user))
}
