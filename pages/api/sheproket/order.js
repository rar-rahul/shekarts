export default async function handler(req, res) {
  try {
    const authRes = await fetch(`${process.env.NEXT_PUBLIC_SHEPROKET_AUTH_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHEPROKET_API_USER_EMAIL,
        password: "$qUu3GmE8Z@Hm1$@",
      }),
    });
    const { token } = await authRes.json();

    const orderRes = await fetch(`${process.env.NEXT_PUBLIC_SHEPROKET_ORDER_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });
    const result = await orderRes.json();
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Shiprocket order failed" });
  }
}
