import fetch from 'node-fetch';

export default async function handler(req, res) {
  const feed = req.query.feed;
  const username = 'sergaybass'; // Ваш Adafruit IO username
  const key = process.env.ADAFRUIT_IO_KEY;

  if (!feed) {
    return res.status(400).json({ error: 'Feed parameter is required' });
  }
  if (!key) {
    return res.status(500).json({ error: 'Missing ADAFRUIT_IO_KEY environment variable' });
  }

  const url = `https://io.adafruit.com/api/v2/${username}/feeds/${feed}/data/last`;

  try {
    const response = await fetch(url, {
      headers: { 'X-AIO-Key': key }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `Adafruit IO error: ${response.status} - ${text}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from Adafruit IO:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
