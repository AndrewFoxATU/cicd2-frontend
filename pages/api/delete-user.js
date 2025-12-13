async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  try {
    const response = await fetch(`http://localhost:8003/api/users/${id}`,{
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Upstream error: ${response.statusText}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default handler;
