import { NextResponse } from "next/server";

export default async function apiHandler(req, res)  {
    if (req.method === "POST") {
    try {
      const { phone,detail } = req.body;

      const apiKey = process.env.TWO_FACTOR_API_KEY;
      const otpRes = await fetch(
        `https://2factor.in/API/V1/99835995-7d26-11ed-9158-0200cd936042/SMS/VERIFY/${detail}/${phone}`
      );
      const data = await otpRes.json();

      res.status(200).json(data);
    } catch (err) {
      console.error("OTP API error:", err);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
