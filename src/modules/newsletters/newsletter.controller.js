import { NewsletterService } from "./newsletter.service.js";

// Post Newsletter
async function addNewsletter(req, res) {
  try {
    const newsletterInfo = req.body;
    if (!newsletterInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Newsletter not found." });
    }
    const result = await NewsletterService.addNewsletterInDB(newsletterInfo);

    if (result.insertedId) {
      return res.status(200).json({ success: true });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
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
