const express = require("express");
require("./DB/connect")

const {CourseModelClass} = require('./Models/courses');
const {ModulesModelClass} = require('./Models/modules');
const {LessonsModelClass} = require('./Models/lessons');
const { QuestionBankModelClass } = require("./Models/QuestionBank");

const app = express();
app.use(express.json());
const port = 5000;


app.get("/", (req, res)=>{
    res.send("Home page");
})


//Insert Question bank
app.post("/add-question-bank", async (req, res) => {
    try {
      const { questionBankId, name, description, questions, created_by, status } = req.body;
  
      // Validate required fields
      if (!questionBankId || !name || !description || !questions) {
        return res.status(400).json({ error: "Required fields are missing." });
      }
  
      // Create a new question bank document
      const newQuestionBank = new QuestionBankModelClass({
        questionBankId,
        name,
        description,
        questions,
        created_on: new Date(),
        created_by,
        status: status || 1, // Default status to 1 if not provided
      });
  
      // Save to database
      const savedQuestionBank = await newQuestionBank.save();
      res.status(201).json({
        message: "Question bank added successfully.",
        data: savedQuestionBank,
      });
    } catch (error) {
      console.error("Error adding question bank:", error);
      res.status(500).json({ error: "Failed to add question bank." });
    }
  });

//Insert in lession
app.post("/add-lesson", async (req, res) => {
    try {
      const { lessonId, name, description, type, videoUrl, questionBankId, created_by, status } = req.body;
  
      // Validate required fields
      if (!lessonId || !name || !description || !type) {
        return res.status(400).json({ error: "Required fields are missing." });
      }
  
      // Create a new lesson document
      const newLesson = new LessonsModelClass({
        lessonId,
        name,
        description,
        type,
        videoUrl,
        questionBankId,
        created_on: new Date(),
        created_by,
        status: status || 1, // Default status to 1 if not provided
      });
  
      // Save to database
      const savedLesson = await newLesson.save();
      res.status(201).json({
        message: "Lesson added successfully.",
        data: savedLesson,
      });
    } catch (error) {
      console.error("Error adding lesson:", error);
      res.status(500).json({ error: "Failed to add lesson." });
    }
  });

  //Insert Module
  app.post("/add-module", async (req, res) => {
    try {
      const { modelId, name, description, lessonIds, created_by, status } = req.body;
  
      // Validate required fields
      if (!modelId || !name || !description || !lessonIds || !Array.isArray(lessonIds)) {
        return res.status(400).json({ error: "Required fields are missing or invalid." });
      }
  
      // Create a new module document
      const newModule = new ModulesModelClass({
        modelId,
        name,
        description,
        lessonIds,
        created_on: new Date(),
        created_by,
        status: status || 1, // Default status to 1 if not provided
      });
  
      // Save to database
      const savedModule = await newModule.save();
      res.status(201).json({
        message: "Module added successfully.",
        data: savedModule,
      });
    } catch (error) {
      console.error("Error adding module:", error);
      res.status(500).json({ error: "Failed to add module." });
    }
  });

  //Insert Course
  app.post("/add-course", async (req, res) => {
    try {
      const { courseId, name, instructorName, description, modules, numberRating, averageRating, created_by, status } = req.body;
  
      // Validate required fields
      if (!courseId || !name || !instructorName || !description || !Array.isArray(modules)) {
        return res.status(400).json({ error: "Required fields are missing or invalid." });
      }
  
      // Create a new course document
      const newCourse = new CourseModelClass({
        courseId,
        name,
        instructorName,
        description,
        modules,
        numberRating: numberRating || 0,
        averageRating: averageRating || 0.0,
        created_on: new Date(),
        created_by,
        status: status || 1, // Default status to 1 if not provided
      });
  
      // Save to database
      const savedCourse = await newCourse.save();
      res.status(201).json({
        message: "Course added successfully.",
        data: savedCourse,
      });
    } catch (error) {
      console.error("Error adding course:", error);
      res.status(500).json({ error: "Failed to add course." });
    }
  });
  
  
  app.get("/course-details/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Step 1: Get the course by courseId
      const course = await CourseModelClass.findOne({ courseId });
  
      if (!course) {
        return res.status(404).json({ error: "Course not found." });
      }
  
      // Step 2: Get the modules for the course
      const modules = await ModulesModelClass.find({ moduleId: { $in: course.modules } });
  
      // Step 3: For each module, get the lessons
      const modulesWithLessons = await Promise.all(modules.map(async (module) => {
        const lessons = await LessonsModelClass.find({ lessonId: { $in: module.lessonIds } });
  
        return {
          moduleId: module.moduleId,
          name: module.name,
          description: module.description,
          lessons: lessons.map((lesson) => ({
            lessonId: lesson.lessonId,
            name: lesson.name,
            description: lesson.description,
            type: lesson.type,
            videoUrl: lesson.videoUrl,
          })),
        };
      }));
  
      // Step 4: Prepare the response structure
      const response = {
        courseId: course.courseId,
        name: course.name,
        instructorName: course.instructorName,
        description: course.description,
        modules: modulesWithLessons,
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching course details:", error);
      res.status(500).json({ error: "Failed to fetch course details." });
    }
  });

app.get('/api/course/:courseId', async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Find the course and populate its modules and lessons
      const course = await Course.findById(courseId)
        .populate({
          path: 'modules',
          populate: {
            path: 'lessons',
            model: 'Lesson'
          }
        });
  
      // Check if the course was found
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Structure the response as required
      const response = {
        courseInfo: {
          title: course.title,
          description: course.description,
        },
        modules: course.modules.map(module => ({
          moduleInfo: {
            title: module.title,
            description: module.description,
          },
          lessons: module.lessons.map(lesson => ({
            lessonInfo: {
              title: lesson.title,
              content: lesson.content,
            }
          }))
        }))
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

app.listen(port, ()=>console.log("Application running on port : ", port)
)