import { Newsletter } from "./newsletter.model.js";

async function addNewsletterInDB(payload) {
  const result = await Newsletter.create(payload);
  return result;
}

async function getAllNewsletterFromDB() {
  const result = await Newsletter.find().select("-__v").lean();
  return result;
}

export const NewsletterService = {
  addNewsletterInDB,
  getAllNewsletterFromDB,
};
