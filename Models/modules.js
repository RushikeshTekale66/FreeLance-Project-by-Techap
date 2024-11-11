const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongodb");
const { Lessons } = require("./lessons");

const ModulesSchema = new Schema({
  moduleId: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  lessonIds: { type: [Number], required: true },

  created_on: { type: Date },
  created_by: { type: Number },
  modified_on: { type: Date },
  modified_by: { type: Number },
  status: { type: Number },
});

const ModulesModelClass = model("Modules", ModulesSchema, "modules");

const addDefaults = async () => {
  // This function can be used to add default modules if necessary
};

module.exports = { ModulesModelClass, addDefaults };
