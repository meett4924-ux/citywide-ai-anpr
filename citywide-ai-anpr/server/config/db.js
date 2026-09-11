import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.warn('[db] MONGO_URI is not set — the API will start without a database connection.')
    return
  }

  try {
    await mongoose.connect(uri)
    console.log('[db] MongoDB connected')
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message)
    // In this early phase we don't want a missing DB to crash the whole API,
    // since the frontend shell should still be reachable for UI review.
  }
}
