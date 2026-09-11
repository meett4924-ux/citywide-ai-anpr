import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema(
  {
    severity: { type: String, enum: ['critical', 'warning', 'info'], required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    camera: { type: mongoose.Schema.Types.ObjectId, ref: 'Camera', default: null },
    relatedPlate: { type: String, default: null },
    acknowledged: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('Alert', alertSchema)
