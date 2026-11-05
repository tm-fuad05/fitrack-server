import { ClassService } from "./class.service.js";

// Post a Class
async function addClass(req, res) {
  try {
    const classInfo = req.body;

    if (!classInfo || Object.keys(classInfo).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Class data is required" });
    }

    const result = await ClassService.addClassInDB(classInfo);

    if (result.insertedId) {
      return res.status(201).json({ success: true, message: "Class posted" });
    }
    return res.status(500).json({ success: false, message: "Failed to post." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

// Get Classes
async function getAllClasses(req, res) {
  try {
    const { search } = req.query;

    const result = await ClassService.getAllClassesFromDB(search);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const ClassController = {
  getAllClasses,
  addClass,
};
