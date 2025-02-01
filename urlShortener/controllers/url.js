const shortener = require("shortid");

const URL = require("../models/url");

const generateShort = async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const shortId = shortener();
  const newUrl = new URL({
    shortId: shortId,
    redirectURL: body.url,
    createdBy: req.user._id,
  });

  try {
    await newUrl.save();
    res.status(201).render("generate", { newUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate short URL" });
  }
};

const handleRedirect = async (req, res) => {
  const { shortId } = req.params;

  try {
    // Find the document first
    const url = await URL.findOne({ shortId: shortId });

    if (!url) {
      return res.status(404).json({ error: "Short ID not found" });
    }

    // Push the new timestamp
    url.visitHistory.push({ timestamp: Date.now() });

    // Save the updated document
    await url.save();

    // Redirect to the original URL
    // res.status(300).json({ redirected: url.redirectURL });
    res.redirect(url.redirectURL);
  } catch (err) {
    console.error("Error during redirection:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAnalytics = async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await URL.findOne({ shortId: shortId });

    if (!url) {
      return res.status(404).json({ error: "Short ID not found" });
    }

    // Send the number of visits as a response
    res.status(200).json({ visits: url.visitHistory.length });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { generateShort, handleRedirect, getAnalytics };
