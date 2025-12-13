// /api/fetchTyres.js

async function handler(req, res) {
  try {
    const response = await fetch('http://localhost:8003/api/tyres', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Upstream error: ${response.statusText}` });
    }

    const tyres = await response.json();
    return res.status(200).json(tyres);
  } catch (error) {
    console.error('Error fetching tyres:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
export default handler;
