import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { urlForImage } from "@/lib/sanity/image";

type PortableTextContentProps = {
  value: unknown;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display font-normal text-[30px] leading-[1.2] mb-5 text-encre">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-normal text-[22px] leading-[1.25] mb-4 text-encre">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="font-body text-[17px] leading-[1.75] text-secondaire mb-8">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-encre font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#";
      const isInternal = href.startsWith("/") || href.startsWith("#");
      const rel = isInternal ? undefined : "noopener noreferrer";
      const target = isInternal ? undefined : "_blank";
      return (
        <a
          href={href}
          rel={rel}
          target={target}
          className="text-plume no-underline hover:opacity-70 transition-opacity duration-200"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 mb-8 font-body text-[17px] leading-[1.75] text-secondaire">
        {children}
      </ul>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlForImage(value).width(1400).fit("max").auto("format").url();
      return (
        <figure className="mb-9">
          <div className="relative bg-placeholder" style={{ aspectRatio: "3 / 2" }}>
            <Image
              src={imageUrl}
              alt={value.alt ?? ""}
              fill
              className="object-cover"
            />
          </div>
          {value.alt && (
            <figcaption className="font-body text-[14px] text-gris mt-2.5">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
    citation: ({ value }) => {
      if (!value?.texte) return null;
      return (
        <div className="mb-8">
          <p className="font-display italic text-[22px] leading-[1.55] text-encre max-w-150 mb-3.5">
            « {value.texte} »
          </p>
          {value.attribution && (
            <p className="font-mono text-[11px] tracking-widest uppercase text-gris">
              — {value.attribution}
            </p>
          )}
        </div>
      );
    },
  },
};

export function PortableTextContent({ value }: PortableTextContentProps) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
