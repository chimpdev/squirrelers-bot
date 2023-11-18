import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('Drop', new Schema([
  {
    _id: {
      type: String,
      required: true
    },
    channel: {
      type: String,
      required: true
    }
  }
]));