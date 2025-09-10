import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

app.post("/run-troubleshooter", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    await browser.close();

    res.json({ url, title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Troubleshooter API running on port ${PORT}`)
);
