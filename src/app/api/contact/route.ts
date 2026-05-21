import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";

// ==============================
// INIT
// ==============================
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummykey_for_build");

// ==============================
// RATE LIMIT (in-memory)
// ==============================
const rateLimit = new Map<string, number[]>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 min
  const limit = 5;

  const timestamps = rateLimit.get(ip) || [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= limit) return false;

  valid.push(now);
  rateLimit.set(ip, valid);
  return true;
}

// ==============================
// EMAIL VALIDATION
// ==============================
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==============================
// API HANDLER
// ==============================
export async function POST(req: NextRequest) {
  try {
    // ==============================
    // GET REAL IP (FIXED)
    // ==============================
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // 🚨 Rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, message, company } = body;

    // ==============================
    // HONEYPOT (ANTI-SPAM)
    // ==============================
    if (company) {
      return NextResponse.json({ success: true });
    }

    // ==============================
    // VALIDATION
    // ==============================
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // ==============================
    // SANITIZATION
    // ==============================
    const cleanName = sanitizeHtml(name);
    const cleanEmail = sanitizeHtml(email);
    const cleanMessage = sanitizeHtml(message);

    // ==============================
    // SEND EMAIL TO YOU
    // ==============================
    const { error: sendError } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // change after domain verify
      to: process.env.TO_EMAIL!, // your email
      replyTo: cleanEmail,
      subject: `🚀 New message from ${cleanName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #0e0e0e; color: #fff; border-radius: 12px;">
          <h2 style="color:#a78bfa;">New Contact Message</h2>

          <p><strong>Name:</strong> ${cleanName}</p>
          <p><strong>Email:</strong> ${cleanEmail}</p>
          <p><strong>Message:</strong></p>
          <p style="line-height:1.6;">
            ${cleanMessage.replace(/\n/g, "<br/>")}
          </p>

          <hr style="margin:24px 0;border-color:#222"/>
          <p style="font-size:12px;color:#777;">Sent from your portfolio</p>
        </div>
      `,
    });

    if (sendError) {
      throw new Error(sendError.message);
    }

    // // ==============================
    // // AUTO REPLY
    // // ==============================
    // const { error: replyError } = await resend.emails.send({
    //   from: "Kartikeya <onboarding@resend.dev>",
    //   to: cleanEmail,
    //   subject: "Got your message ",
    //   html: `
    //     <div style="font-family:sans-serif;padding:24px;">
    //       <h2>Hey ${cleanName}, </h2>
    //       <p>Thanks for reaching out! I’ve received your message and will reply soon.</p>
    //       <p style="margin-top:20px;">— Kartikeya</p>
    //     </div>
    //   `,
    // });

    // if (replyError) {
    //   throw new Error(replyError.message);
    // }

    // ==============================
    // SUCCESS
    // ==============================
    return NextResponse.json({
      success: true,
      message: "Message sent successfully ",
    });

  } catch (err) {
    console.error("Contact form error:", err);

    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}