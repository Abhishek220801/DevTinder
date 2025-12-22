const shortid = require('shortid');
const URL = require('../models/url')

async function handleGenerateNewShortURL(req, res) {
    try {
        const { url, referenceName } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const shortId = shortid();

        // Save the new URL in the database
        await URL.create({
            shortId,
            redirectUrl: url,
            referenceName: referenceName || "Unknown", // Default value if not provided
            visitHistory: [],
            createdBy: req.user._id,
        });

        // Fetch all URLs from the database
        return res.redirect('/');

    } catch (error) {
        console.error("Error in handleGenerateNewShortURL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleGetAnalytics(req,res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({totalClicks: result.visitHistory.length, analytics: result.visitHistory})
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}