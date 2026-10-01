export interface ProjectItem {
  id: string;
  step: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  href: string;
  external?: boolean;
  aspectRatio: string;
  ctaText: string;
}

export const allProjects: ProjectItem[] = [
  {
    id: "final-stop",
    step: "01",
    badge: "Client Case Study • San Diego, CA",
    title: "Final Stop Barber Shop",
    description:
      "A custom digital experience built to showcase the brand, simplify appointment booking, and turn local visitors into loyal clients on any device, anytime book appointments easily, and stay connected. Built with a seamless booking system.",
    image: "/projects/final-stop.png",
    href: "https://finalstop.org",
    external: true,
    aspectRatio: "aspect-[639/298]",
    ctaText: "Visit site",
  },
  {
    id: "retrouvailles",
    step: "02",
    badge: "Client Project • Event Platform",
    title: "Le Dernier Retrouvailles",
    description:
      "A custom celebration and reunion portal built for the 4ème CONS class. Features interactive attendee registration, dynamic countdown timer, live ticket selection, and seamless mobile check-in.",
    image: "/projects/retrouvailles.png",
    href: "/retrouvailles",
    external: false,
    aspectRatio: "aspect-[639/298]",
    ctaText: "Visit site",
  },
];
