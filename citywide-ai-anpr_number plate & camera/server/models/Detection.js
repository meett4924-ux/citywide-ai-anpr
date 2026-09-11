import mongoose from 'mongoose'

// This model represents a single ANPR (Automatic Number Plate Recognition) result:
// one detected vehicle + plate, produced by the ANPR pipeline (server/services/anpr/*)
// for either a demo/mock provider (current phase) or a real AI provider (future phase).
//
// NOTE: This was originally a minimal Part-1 placeholder ("Detection" model with just
// plate/vehicleType/color/confidence). It has been EXTENDED here for Part 3 rather than
// replaced with a new model, so nothing that referenced `Detection` needs to change.
const detectionSchema = new mongoose.Schema(
  {
    plateNumber: { type: String, required: true, uppercase: true, trim: true },
    vehicleType: {
      type: String,
      enum: ['Car', 'Two-wheeler', 'Bus', 'Truck', 'Other'],
      default: 'Other',
    },
    vehicleColor: { type: String, trim: true, default: null },

    vehicleConfidence: { type: Number, min: 0, max: 1, default: null },
    plateConfidence: { type: Number, min: 0, max: 1, default: null },
    ocrConfidence: { type: Number, min: 0, max: 1, default: null },

    // Optional link to a registered camera — populated once live camera sources
    // (Part 4) feed into this same pipeline. Left null for uploaded media.
    camera: { type: mongoose.Schema.Types.ObjectId, ref: 'Camera', default: null },

    sourceType: { type: String, enum: ['image', 'video', 'camera'], default: 'image' },
    sourceName: { type: String, trim: true, default: null }, // e.g. uploaded filename or camera name

    location: {
      lat: { type: Number },
      lng: { type: Number },
    },

    imageUrl: { type: String, default: null }, // relative URL, e.g. /uploads/anpr/<file>
    plateImageUrl: { type: String, default: null }, // cropped plate image, once real cropping exists

    processingStatus: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'completed',
    },
    processingMode: { type: String, enum: ['demo', 'real'], default: 'demo' },

    // Carried over from Part 1's mock data shape — reused here so future alert
    // rules (Part 8) can flag a saved detection without a schema change.
    flag: { type: String, enum: [null, 'stolen', 'overspeed', 'no-helmet'], default: null },

    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

detectionSchema.index({ plateNumber: 1 })
detectionSchema.index({ timestamp: -1 })
detectionSchema.index({ sourceName: 1 })
detectionSchema.index({ processingStatus: 1 })

export default mongoose.model('Detection', detectionSchema)
