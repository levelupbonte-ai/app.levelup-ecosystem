import { mPar } from "@/lib/motion";
import { cn } from "@/lib/utils";

const BLOBS = [
  {
    c: "var(--a1)",
    className: "-top-[30%] -left-[15%] h-[85vmax] w-[85vmax]",
    anim: "lu-drift-a 26s",
  },
  {
    c: "var(--a3)",
    className: "-top-[35%] right-[-25%] h-[80vmax] w-[80vmax]",
    anim: "lu-drift-b 31s",
  },
  {
    c: "var(--a2)",
    // Phones keep two blobs: half the layers to composite while scrolling.
    className: "top-[20%] left-[25%] hidden h-[60vmax] w-[60vmax] md:block",
    anim: "lu-drift-c 23s",
  },
  {
    c: "var(--a4)",
    className:
      "bottom-[-45%] left-[-10%] hidden h-[70vmax] w-[70vmax] md:block",
    anim: "lu-drift-b 37s",
  },
];

/**
 * Airy aurora: four large, soft radial blobs in LevelUp lavender / violet and
 * a cool blue, drifting slowly (transform only, paused off screen through a
 * parent data-live, still under reduced motion), with a faint grid that fades
 * toward the edges.
 */
export function Aurora({
  className,
  grid = true,
}: {
  className?: string;
  grid?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "lu-aurora pointer-events-none absolute inset-0 -z-20 overflow-hidden",
        className,
      )}
    >
      {/* Two depths that drift against the scroll (docs/motion.md). */}
      <div className="absolute inset-0" {...mPar(70)}>
        {BLOBS.map((blob, i) => (
          <span
            key={i}
            className={cn("lu-blob lu-loop", blob.className)}
            style={{
              ["--c" as string]: blob.c,
              animation: `${blob.anim} ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>
      {grid ? (
        <div className="absolute inset-0" {...mPar(-26)}>
          <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)] opacity-80" />
        </div>
      ) : null}
    </div>
  );
}
