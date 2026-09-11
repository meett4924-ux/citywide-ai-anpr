import mongoose from 'mongoose'

const cameraSchema = new mongoose.Schema(
  {
    cameraId: { type: String, required: true, unique: true, trim: true }, // e.g. "CAM-014"
    name: { type: String, required: true, trim: true },
    zone: { type: String, trim: true },
    status: { type: String, enum: ['online', 'degraded', 'offline'], default: 'offline' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    // Populated once a real stream is connected; left null in this phase.
    streamUrl: { type: String, default: null },
    lastPingAt: { type: Date, default: null },
  },
  { timestamps: true },
)

export default mongoose.model('Camera', cameraSchema)
