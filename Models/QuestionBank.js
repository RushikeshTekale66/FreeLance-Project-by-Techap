const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongodb");

const QuestionBankSchema = new Schema({
  questionBankId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  questions: { type: [String], required: true }, // Array of questions, which can be strings or another schema if needed

  created_on: { type: Date },
  created_by: { type: Number },
  modified_on: { type: Date },
  modified_by: { type: Number },
  status: { type: Number },
});

const QuestionBankModelClass = model("QuestionBank", QuestionBankSchema, "questionBank");

const addDefaults = async () => {
  const defaultQuestionBanks = [
    {
      questionBankId: 1,
      name: "Basic JavaScript Questions",
      description: "A question bank containing basic JavaScript questions.",
      questions: ["What is a closure?", "Explain hoisting.", "What is 'this' keyword in JavaScript?"],
      created_on: new Date(),
      created_by: 1,
      status: 1,
    },
    {
      questionBankId: 2,
      name: "Node.js Fundamentals",
      description: "A question bank covering basic concepts in Node.js.",
      questions: ["What is Node.js?", "Explain event-driven programming.", "What are streams in Node.js?"],
      created_on: new Date(),
      created_by: 1,
      status: 1,
    },
  ];

  try {
    const existingQuestionBanks = await QuestionBankModelClass.find();
    if (existingQuestionBanks.length === 0) {
      await QuestionBankModelClass.insertMany(defaultQuestionBanks);
      console.log("Default question banks added.");
    } else {
      console.log("Question banks already exist, skipping default insertion.");
    }
  } catch (error) {
    console.error("Error adding default question banks:", error);
  }
};

module.exports = { QuestionBankModelClass, addDefaults };
