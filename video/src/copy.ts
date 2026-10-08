export type Lang = 'fr' | 'en';

/** On-screen words and the voice-over line of each scene (voice generated with ElevenLabs). */
export const COPY = {
  fr: {
    hook: ['Votre', 'business', 'mérite', 'un', 'vrai', 'site.'],
    describe: 'Décrivez votre projet.',
    prompt: 'Un site pour mon salon de coiffure à Lyon, avec réservation en ligne.',
    build: 'Le studio le conçoit, page par page.',
    showcase: 'Des sites qui marquent.',
    features: ['Réservation 24/7', 'Trouvé sur Google', 'Sécurisé'],
    toasts: ['Nouveau rendez-vous · 14:30', 'Nouvel avis ★★★★★', 'Demande de devis reçue'],
    manage: 'Et vous gérez tout, au même endroit.',
    cta: 'Créez votre aperçu gratuit',
    url: 'levelup-ecosystem.com',
    voice: [
      'Votre business mérite un vrai site.',
      'Décrivez votre projet en une phrase.',
      'Notre studio le conçoit pour vous, page par page.',
      'Des sites qui marquent, comme ceux de nos clients.',
      'Réservations, Google, sécurité : vous gérez tout au même endroit.',
      'LevelUp Ecosystem. Créez votre aperçu gratuit.'
    ]
  },
  en: {
    hook: ['Your', 'business', 'deserves', 'a', 'real', 'website.'],
    describe: 'Describe your project.',
    prompt: 'A website for my hair salon in Lyon, with online booking.',
    build: 'The studio designs it, page by page.',
    showcase: 'Websites people remember.',
    features: ['Booking 24/7', 'Found on Google', 'Secure'],
    toasts: ['New booking · 2:30 PM', 'New review ★★★★★', 'Quote request received'],
    manage: 'And you run everything in one place.',
    cta: 'Get your free preview',
    url: 'levelup-ecosystem.com',
    voice: [
      'Your business deserves a real website.',
      'Describe your project in one sentence.',
      'Our studio designs it for you, page by page.',
      'Websites people remember, like our clients’.',
      'Bookings, Google, security: you run everything in one place.',
      'LevelUp Ecosystem. Get your free preview.'
    ]
  }
} as const;
