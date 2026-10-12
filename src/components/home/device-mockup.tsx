import { mPar } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Desktop browser capture with a phone overlapping one corner; the phone
 * shows the top of the mobile capture, still.
 */
export function DeviceMockup({
  domain,
  desktop,
  mobile,
  mobileSize,
  alt,
  flip = false,
  sizes = "(min-width: 1024px) 56vw, 92vw",
}: {
  domain: string;
  /** Path prefix of the desktop capture: `${desktop}-720.webp` / `-1440.webp`. */
  desktop: string;
  /** Long mobile capture (decorative). */
  mobile: string;
  mobileSize: { width: number; height: number };
  alt: string;
  flip?: boolean;
  sizes?: string;
}) {
  return (
    <div className="relative pb-10 sm:pb-14">
      <div className="border-hairline bg-card overflow-hidden border shadow-[0_30px_80px_-40px_rgb(0_0_0/0.35)]">
        <div className="border-hairline flex items-center gap-3 border-b px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="bg-foreground/15 size-2 rounded-full" />
            ))}
          </div>
          <span className="font-label text-muted-foreground mx-auto truncate text-[11px]">
            {domain}
          </span>
        </div>
        <div className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- responsive capture via srcSet */}
          <img
            src={`${desktop}-1440.webp`}
            srcSet={`${desktop}-720.webp 720w, ${desktop}-1440.webp 1440w`}
            sizes={sizes}
            width={1440}
            height={900}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="block aspect-[16/10] w-full object-cover object-top"
            {...mPar(16, { img: true })}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 w-[30%] max-w-[210px] min-w-[112px]",
          flip ? "-left-2 sm:-left-6" : "-right-2 sm:-right-6",
        )}
        {...mPar(-34)}
      >
        <div className="border-foreground/85 bg-foreground rounded-[1.6rem] border-[5px] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)] sm:rounded-[2rem] sm:border-[6px]">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[1.25rem] bg-black sm:rounded-[1.6rem]">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative long capture */}
            <img
              src={mobile}
              width={mobileSize.width}
              height={mobileSize.height}
              alt=""
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
