// Fires automatically when a Netlify Form named "subscribe" receives a submission.
// Requires env var RESEND_API_KEY set in Netlify (Site settings > Environment variables).
// Sending domain mail.thevspotnews.com must be verified in Resend (SPF/DKIM/DMARC).

export default async (req) => {
  const { payload } = await req.json();
  const email = payload?.data?.email;
  if (!email) return new Response("no email", { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set; skipping welcome email for", email);
    return new Response("skipped", { status: 200 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: "Vinny at The V Spot <vinny@mail.thevspotnews.com>",
      to: [email],
      subject: "Welcome to the network",
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1F3C">
          <h1 style="color:#E8272A;font-family:Arial,sans-serif">You're on the network.</h1>
          <p>Thanks for signing up to The V Spot. Here's the deal: ecommerce, retail, and AI coverage with a cross-Atlantic squint. Satirical on the surface, analyst-grade underneath. No spam, no "in today's fast-paced world", and absolutely no synergy.</p>
          <p>Three good places to start:</p>
          <ul>
            <li><a href="https://thevspotnews.com/shows/ostrich-report/" style="color:#E8272A">The Ostrich Report</a>, long-form essays with heads out of the sand</li>
            <li><a href="https://thevspotnews.com/shows/struggle-bus/" style="color:#E8272A">The Struggle Bus</a>, honest operator conversations</li>
            <li><a href="https://www.youtube.com/@thevspotnews" style="color:#E8272A">The YouTube channel</a>, where the neon lives</li>
          </ul>
          <p>Talk soon,<br/>Vinny<br/><span style="color:#A0A0A0;font-size:13px">The V Spot Network · Tralee, Ireland</span></p>
        </div>`
    })
  });

  console.log("Resend response:", res.status);
  return new Response("ok", { status: 200 });
};

export const config = { name: "submission-created" };
