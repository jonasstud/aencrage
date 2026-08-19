"use client";

import { useState } from "react";

type FormState = {
  nom: string;
  npa: string;
  localite: string;
  email: string;
  rue: string;
  tel: string;
  message: string;
};

const empty: FormState = {
  nom: "",
  npa: "",
  localite: "",
  email: "",
  rue: "",
  tel: "",
  message: "",
};

const inputCls =
  "w-full border-b border-encre/25 focus:border-encre focus:outline-none py-2.5 px-0.5 text-[15px] leading-normal text-encre bg-transparent font-body";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Une erreur est survenue.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Impossible d'envoyer le message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-papier text-encre font-body">
      <main className="max-w-340 mx-auto w-full px-14 pt-18 pb-25">
        <div className="grid grid-cols-[0.85fr_1.15fr] gap-18">
          {/* Left column */}
          <div className="sticky top-2.5 self-start">
            <h1 className="font-display font-normal text-encre m-0 mb-10 text-[48px] leading-[1.1]">
              Contact
            </h1>

            <div className="flex flex-col gap-8 max-w-105">
              <div>
                <p className="font-display italic text-secondaire m-0 mb-3 text-[19px]">
                  pour demander à
                </p>
                <ul className="list-none m-0 p-0 flex flex-col gap-2.25">
                  {[
                    "consulter un article",
                    "rechercher des références",
                    "échanger sur une thématique",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5">
                      <span className="font-mono font-medium text-laiton shrink-0 text-[14px]">
                        æ
                      </span>
                      <span className="font-body text-secondaire text-[16px] leading-normal">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-display italic text-secondaire m-0 mb-3 text-[19px]">
                  mais aussi pour
                </p>
                <ul className="list-none m-0 p-0 flex flex-col gap-2.25">
                  {[
                    "déposer un commentaire",
                    "contribuer financièrement ou matériellement",
                  ].map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5">
                      <span className="font-mono font-medium text-laiton shrink-0 text-[14px]">
                        æ
                      </span>
                      <span className="font-body text-secondaire text-[16px] leading-normal">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Adresse postale */}
            <div className="relative border border-encre px-6.5 pt-6 pb-6.5 mt-13 max-w-105">
              <div className="absolute -top-px -left-px -right-px h-0.75 bg-laiton" />
              <p className="font-mono uppercase text-gris m-0 mb-4 text-[11px] tracking-[0.18em]">
                Adresse postale
              </p>
              <address className="not-italic text-secondaire m-0 text-[15px] leading-[1.75]">
                Fondation æncrage
                <br />
                c/o Michel Beytrison
                <br />
                Place de la Tsena 5
                <br />
                1968 Mase
              </address>
              <div className="my-4 border-t border-encre/12" />
              <div className="flex flex-col gap-0.5">
                <a
                  href="https://www.fondationaencrage.ch"
                  className="font-mono text-encre no-underline hover:text-plume transition-colors duration-150 text-[12.5px]"
                >
                  www.fondationaencrage.ch
                </a>
                <a
                  href="mailto:fondationaencrage@gmail.com"
                  className="font-mono text-encre no-underline hover:text-plume transition-colors duration-150 text-[12.5px]"
                >
                  fondationaencrage@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Right column — form or confirmation */}
          <div className="pt-23.25">
            {submitted ? (
              <div className="relative border border-encre px-9 pt-8 pb-9 max-w-140">
                <div className="absolute -top-px -left-px -right-px h-0.75 bg-laiton" />
                <h2 className="font-display font-normal text-encre m-0 mb-4 text-[24px]">
                  Message envoyé
                </h2>
                <p className="font-body text-secondaire m-0 text-[15px] leading-[1.7]">
                  Merci pour votre message. La Fondation æncrage vous répondra
                  dans les meilleurs délais.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-7.5"
              >
                <Field label="Nom et prénom" required>
                  <input
                    type="text"
                    required
                    value={form.nom}
                    onChange={set("nom")}
                    className={inputCls}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-7">
                  <Field label="NPA et localité" required>
                    <div className="grid grid-cols-[80px_1fr] gap-3">
                      <input
                        type="text"
                        required
                        value={form.npa}
                        onChange={set("npa")}
                        className={inputCls}
                      />
                      <input
                        type="text"
                        required
                        value={form.localite}
                        onChange={set("localite")}
                        className={inputCls}
                      />
                    </div>
                  </Field>
                  <Field label="Adresse courriel" required>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-7">
                  <Field label="Rue et numéro" required>
                    <input
                      type="text"
                      required
                      value={form.rue}
                      onChange={set("rue")}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Téléphone (facultatif)">
                    <input
                      type="tel"
                      value={form.tel}
                      onChange={set("tel")}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Message" required>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={set("message")}
                    className="w-full border border-encre/25 focus:border-encre focus:outline-none px-3 py-2.5 text-[15px] leading-[1.6] text-encre bg-transparent resize-y min-h-35 font-body"
                  />
                </Field>

                {error && (
                  <p className="font-body text-[14px] text-red-700 m-0">
                    {error}
                  </p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="font-mono uppercase text-papier bg-encre hover:bg-secondaire transition-colors duration-150 disabled:opacity-60 disabled:cursor-wait cursor-pointer text-[11px] tracking-[0.14em] px-7.5 py-3.75"
                  >
                    {isSubmitting ? "Envoi en cours…" : "Envoyer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono uppercase text-gris text-[11px] tracking-[0.14em]">
        {label}
        {required && <span className="sr-only"> (requis)</span>}
      </label>
      {children}
    </div>
  );
}
