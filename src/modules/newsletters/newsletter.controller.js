import { NewsletterService } from "./newsletter.service.js";

// Post Newsletter
async function addNewsletter(req, res) {
  try {
    const newsletterInfo = req.body;

    const result = await NewsletterService.addNewsletterInDB(newsletterInfo);

    if (result) {
      return res
        .status(200)
        .json({ success: true, message: "Nesletter posted", data: result });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

// Get Newsletter
async function getAllNewsletter(req, res) {
  try {
    const result = await NewsletterService.getAllNewsletterFromDB();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export const NewsletterController = {
  getAllNewsletter,
  addNewsletter,
};
