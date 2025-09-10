import express from "express";
import { chromium } from "playwright";

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.post("/run-troubleshooter", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Example: Grab page title
    const title = await page.title();

    await browser.close();
    res.json({
      url,
      title,
      result: "✅ Page loaded successfully with Playwright",
    });
  } catch (error) {
    console.error("Playwright failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Troubleshooter API running on port ${port}`);
});
