const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongodb");
const { Modules } = require("./modules");

const CourseSchema = new Schema({
  courseId: { type: Number, required: true },
  name: { type: String, required: true },
  instructorName: { type: String, required: true },
  description: { type: String, required: true },
  modules: { type: [Number], required: true },
  numberRating: { type: Number, required: true },
  averageRating: { type: Number, required: true },

  created_on: { type: Date },
  created_by: { type: Number },
  modified_on: { type: Date },
  modified_by: { type: Number },
  status: { type: Number },
});

const CourseModelClass = model("Course", CourseSchema, "course");

const addDefaults = async () => {
  const defaultCourses = [
    {
      courseId: 101,
      name: "Introduction to JavaScript",
      instructorName: "John Doe",
      description: "A beginner course on JavaScript programming.",
      modules: [1, 2, 3],
      numberRating: 0,
      averageRating: 0.0,
      created_on: new Date(),
      created_by: 1,
      status: 1,
    },
    {
      courseId: 102,
      name: "Advanced Node.js",
      instructorName: "Jane Smith",
      description: "An advanced course on Node.js and backend development.",
      modules: [4, 5, 6],
      numberRating: 0,
      averageRating: 0.0,
      created_on: new Date(),
      created_by: 1,
      status: 1,
    },
  ];

  try {
    // Insert courses only if none exist
    const existingCourses = await CourseModelClass.find();
    if (existingCourses.length === 0) {
      await CourseModelClass.insertMany(defaultCourses);
      console.log("Default courses added.");
    } else {
      console.log("Courses already exist, skipping default insertion.");
    }
  } catch (error) {
    console.error("Error adding default courses:", error);
  }
};

module.exports = { CourseModelClass, addDefaults };
