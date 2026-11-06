import { Class } from "./class.model.js";

async function addClassInDB(payload) {
  const result = await Class.create(payload);
  return result;
}

async function getAllClassesFromDB(search) {
  const query = {};

  if (search) {
    query = {
      name: {
        $regex: search.trim(),
        $options: "i",
      },
    };
  }

  const result = await Class.find(query).select("-__v").lean();
  return result;
}

export const ClassService = {
  addClassInDB,
  getAllClassesFromDB,
};
