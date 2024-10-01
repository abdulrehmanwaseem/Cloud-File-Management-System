import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a file name"],
    },
    type: {
      type: String,
      enum: ["image", "video", "audio", "doc", "docx", "txt", "raw"],
      required: [true, "Please enter a file type"],
    },
    format: {
      type: String,
      required: [true, "Please enter a file format"],
    },
    size: {
      type: Number,
      required: true,
    },
    filesUrl: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    uploader: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const File = model("File", fileSchema);
