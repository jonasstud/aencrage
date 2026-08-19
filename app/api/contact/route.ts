import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nom, npa, localite, email, rue, tel, message } = body;

  if (!nom || !npa || !localite || !email || !rue || !message) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
  }

  const { error } = await resend.emails.send({
    from: "Fondation æncrage <contact@fondationaencrage.ch>",
    to,
    replyTo: email,
    subject: `Message de ${nom}`,
    text: [
      `Nom : ${nom}`,
      `Adresse : ${rue}`,
      `NPA / Localité : ${npa} ${localite}`,
      `Courriel : ${email}`,
      tel ? `Téléphone : ${tel}` : null,
      ``,
      message,
    ]
      .filter((l) => l !== null)
      .join("\n"),
  });

  if (error) {
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
