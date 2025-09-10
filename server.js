import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/run-troubleshooter', async (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
      // No executablePath required — puppeteer will auto-resolve it
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    const title = await page.title();
    const html = await page.content();

    await browser.close();

    res.json({
      url,
      title,
      preview: html.slice(0, 500)
    });

  } catch (err) {
    console.error('Troubleshooter failed:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(10000, () => {
  console.log('Troubleshooter API running on port 10000');
});