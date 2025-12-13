// /api/tyre.js
// Proxy for creating a new tyre in the backend inventory using POST.

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("http://localhost:8001/api/tyres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Upstream /api/tyres POST error:", response.status, text);
      return res
        .status(response.status)
        .json({ error: `Upstream error: ${response.statusText}` });
    }

    const created = await response.json();
    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating tyre:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
