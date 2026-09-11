// Development-safe way to create the first admin account.
//
// Usage:
//   ADMIN_NAME="Inspector A. Rao" \
//   ADMIN_EMAIL="admin@cityanpr.gov" \
//   ADMIN_PASSWORD="ChangeMe123!" \
//   ADMIN_ORGANIZATION="City Traffic Police - HQ" \
//   npm run seed:admin
//
// - Reads credentials from environment variables only — nothing is hardcoded.
// - If a user with ADMIN_EMAIL already exists, it is promoted to Administrator
//   (and reactivated) instead of creating a duplicate account.
// - The password is hashed automatically by the User model's pre-save hook —
//   this script never writes a plain-text password to the database.
// - Intended for local/dev/staging bootstrap only. Do not run this against a
//   production database from a shared machine or CI log where env vars might
//   be captured; rotate ADMIN_PASSWORD immediately after first login.

import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

async function run() {
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const organization = process.env.ADMIN_ORGANIZATION || 'City Traffic Command Center'

  if (!name || !email || !password) {
    console.error(
      '[seed:admin] Missing required env vars. Provide ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD ' +
        '(ADMIN_ORGANIZATION is optional). Example:\n' +
        '  ADMIN_NAME="Admin User" ADMIN_EMAIL="admin@cityanpr.gov" ADMIN_PASSWORD="ChangeMe123!" npm run seed:admin',
    )
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('[seed:admin] ADMIN_PASSWORD must be at least 8 characters long.')
    process.exit(1)
  }

  if (!process.env.MONGO_URI) {
    console.error('[seed:admin] MONGO_URI is not set. Add it to server/.env first.')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('[seed:admin] Connected to MongoDB.')

  const existing = await User.findOne({ email: email.toLowerCase() })

  if (existing) {
    existing.role = 'Administrator'
    existing.isActive = true
    existing.name = name
    existing.organization = organization
    await existing.save()
    console.log(`[seed:admin] Existing user "${email}" promoted to Administrator.`)
  } else {
    await User.create({ name, email, password, organization, role: 'Administrator' })
    console.log(`[seed:admin] Administrator account created for "${email}".`)
  }

  console.log('[seed:admin] Done. You can now log in with this email and the password you provided.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('[seed:admin] Failed:', err.message)
  process.exit(1)
})
