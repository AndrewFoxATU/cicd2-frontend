async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const payload = req.body;

  try {
    const response = await fetch(`http://tyres_service:8000/api/tyres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      let upstreamBody;
      try {
        upstreamBody = JSON.parse(text);
      } catch {
        upstreamBody = text;
      }

      return res.status(response.status).json({
        error: "Upstream error",
        upstream_status: response.status,
        upstream_statusText: response.statusText,
        upstream_body: upstreamBody,
      });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating tyre:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
