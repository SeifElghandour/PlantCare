const mongoose = require('mongoose');

const diseaseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // عشان المرض ميتكررش
    },
    symptoms: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
      required: true,
    },
    prevention: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Disease', diseaseSchema);