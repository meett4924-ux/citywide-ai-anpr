import mongoose from 'mongoose'

const detectionSchema = new mongoose.Schema(
  {
    plate: { type: String, required: true, uppercase: true, trim: true, index: true },
    vehicleType: { type: String, enum: ['Car', 'Two-wheeler', 'Bus', 'Truck', 'Other'], default: 'Other' },
    color: { type: String, trim: true },
    camera: { type: mongoose.Schema.Types.ObjectId, ref: 'Camera' },
    // Populated later by the recognition engine; kept optional for now.
    confidence: { type: Number, min: 0, max: 1, default: null },
    imageUrl: { type: String, default: null },
    flag: { type: String, enum: [null, 'stolen', 'overspeed', 'no-helmet'], default: null },
    detectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model('Detection', detectionSchema)
