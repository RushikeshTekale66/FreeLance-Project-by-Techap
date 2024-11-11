const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongodb");
const { QuestionBank } = require("./QuestionBank");

const lessonType = {
  VIDEOS: "videos",
  ASSESSMENT: "assessment",
};

const LessonsSchema = new Schema({
  lessonId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  videoUrl: { type: String },
  questionBankId: { type: Number },

  created_on: { type: Date },
  created_by: { type: Number },
  modified_on: { type: Date },
  modified_by: { type: Number },
  status: { type: Number },
});

const LessonsModelClass = model("Lessons", LessonsSchema, "lessons");

const addDefaults = async () => {
  // This function can be used to add default lessons if necessary
};

module.exports = { LessonsModelClass, lessonType, addDefaults };
