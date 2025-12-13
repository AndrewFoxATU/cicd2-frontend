async function handler(req, res) {
  try {
    const response = await fetch('http://localhost:8003/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Upstream error: ${response.statusText}` });
    }

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;
