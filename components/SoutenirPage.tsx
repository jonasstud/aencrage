"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const donsPermettent = [
  "la numérisation des documents et des enregistrements",
  "la conservation matérielle des fonds déposés",
  "les publications, expositions et rencontres publiques",
];

export default function SoutenirPage() {
  return (
    <div className="flex flex-col min-h-screen bg-papier text-encre font-body">
      <main className="max-w-340 mx-auto w-full px-4 sm:px-8 lg:px-14 pt-10 sm:pt-14 lg:pt-18 pb-16 sm:pb-20 lg:pb-25">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
        >
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-gris m-0 mb-3.5">
            Soutien
          </p>
          <h1
            className="font-display font-normal text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] max-w-190 m-0"
            style={{ textWrap: "pretty" }}
          >
            Soutenir les activités de la Fondation
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-18 mt-10 lg:mt-14 items-start">
          {/* Left column — texte explicatif */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="max-w-115 flex flex-col gap-8"
          >
            <p
              className="font-body text-[16px] leading-[1.75] text-secondaire m-0"
              style={{ textWrap: "pretty" }}
            >
              La Fondation æncrage ne poursuit aucun but lucratif. Les dons
              qu&rsquo;elle reçoit financent directement la collecte, la
              conservation et la mise en valeur du patrimoine masatte.
            </p>

            <div>
              <p className="font-display italic text-secondaire text-[19px] m-0 mb-3">
                vos dons permettent
              </p>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.25">
                {donsPermettent.map((item) => (
                  <li key={item} className="flex items-baseline gap-2.5">
                    <span className="font-mono font-medium text-laiton text-[14px] shrink-0">
                      æ
                    </span>
                    <span className="font-body text-secondaire text-[16px] leading-normal">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p
              className="pt-6 border-t border-encre/12 font-body text-[15px] leading-[1.7] text-gris m-0"
              style={{ textWrap: "pretty" }}
            >
              Chaque contribution, quel qu&rsquo;en soit le montant, prolonge
              la mémoire écrite et orale de Mase. Pour toute question
              relative à un don, écrivez à{" "}
              <a
                href="mailto:fondationaencrage@gmail.com"
                className="text-secondaire no-underline border-b border-secondaire/35"
              >
                fondationaencrage@gmail.com
              </a>
              .
            </p>
          </motion.div>

          {/* Right column — les deux cartes */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="max-w-140 flex flex-col gap-6"
          >
            {/* Carte Références bancaires */}
            <div className="relative border border-encre px-5 sm:px-7.5 pt-7 pb-7.5">
              <div className="absolute -top-px -left-px -right-px h-0.75 bg-laiton" />
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-gris m-0 mb-4.5">
                Références bancaires
              </p>
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-gris m-0 mb-1.5">
                IBAN
              </p>
              <p className="font-mono text-[19px] tracking-[0.04em] text-encre m-0 mb-5">
                CH78 8080 8005 3215 4606 1
              </p>
              <div className="border-t border-encre/12 pt-4">
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-gris m-0 mb-1.5">
                  Banque
                </p>
                <p className="font-body text-[15px] leading-[1.6] text-secondaire m-0">
                  Raiffeisen Sion Région
                </p>
              </div>
            </div>

            {/* Carte Don par Twint */}
            <div className="relative border border-encre bg-velin px-5 sm:px-7.5 pt-7 pb-7.5">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-gris m-0 mb-5">
                Don par Twint
              </p>
              <div className="flex flex-wrap gap-7 items-start">
                <div className="flex flex-col gap-2.5 items-center">
                  <div className="bg-papier border border-encre/15 p-3 w-43 h-43 flex items-center justify-center">
                    <Image
                      src="/qr-code-twint.svg"
                      alt="QR code Twint de la Fondation æncrage"
                      width={172}
                      height={172}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-gris m-0 text-center">
                    Scannez avec Twint
                  </p>
                </div>
                <div className="flex-1 min-w-55 flex flex-col gap-4.5">
                  <p
                    className="font-body text-[15px] leading-[1.7] text-secondaire m-0"
                    style={{ textWrap: "pretty" }}
                  >
                    Ouvrez l&rsquo;application Twint, scannez le code, puis
                    choisissez librement le montant de votre don.
                  </p>
                  <a
                    href="https://donate.raisenow.io/tcszb"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center gap-3 bg-encre text-papier no-underline font-mono text-[11px] font-medium tracking-[0.16em] uppercase px-5.5 py-3.75 min-h-12 transition-opacity duration-200 hover:opacity-[0.82]"
                  >
                    <Image
                      src="/twint-logo.svg"
                      alt=""
                      width={291}
                      height={332}
                      className="h-5.5 w-auto shrink-0 block"
                    />
                    Faites un don avec Twint
                  </a>
                  <p className="font-body text-[13px] leading-[1.6] text-gris m-0">
                    Depuis un téléphone, le bouton ouvre directement Twint.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
