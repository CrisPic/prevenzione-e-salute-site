// Opening hours. Feeds both the text on the site and the structured data for Google.
// days use schema.org names (Monday..Sunday); label is what visitors read.
const openingHours = [
  { label: 'Lun–Ven', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '11:00', closes: '18:30' },
  { label: 'Sab', days: ['Saturday'], opens: '11:00', closes: '14:00' },
];

// Single source of truth for practical info. Change it here, it updates everywhere.
export const site = {
  name: 'Prevenzione e Salute',
  address: 'Via Piacenza 4, 20135 Milano',
  venue: 'presso GetFIT, primo piano',
  venueEn: 'inside GetFIT – first floor',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=GetFIT+Via+Piacenza+4+Milano',
  // Contact channels: leave empty until they really work. An empty field is hidden on the
  // site and left out of the structured data; filling it in shows it everywhere at once.
  phone: '',      // TODO once the number is bought, e.g. '+39 02 1234 5678'
  whatsapp: '',   // TODO, international format without + e.g. 393331234567
  email: 'info@prevenzioneesalute.it',
  // The doctor who runs the studio and provides the visits. He is the data controller for
  // patients and bookings; the company below only runs the site for him (art. 28 GDPR).
  // Shown only on Note legali and Privacy (both noindex), as art. 7 D.Lgs. 70/2003 requires.
  // Keep it out of Home, titles and structured data: the doctor wants a low profile.
  doctor: {
    name: 'Dott. Gesuele Catalfamo',
    title: 'Medico chirurgo, specialista in Anestesia e Rianimazione',
    titleCountry: 'Italia', // TODO confirm with the doctor (art. 7 lett. f n. 2)
    order: "Ordine dei Medici Chirurghi e degli Odontoiatri della provincia di Reggio Calabria",
    registration: '4978',
    vat: '11130000968',
    pec: '', // TODO doctor's own PEC; until then requests go to info@ and the company PEC
  },
  // Company that builds and runs the site and the bookings for the doctor
  // (Registro Imprese visura, 27 Oct 2026).
  legalName: 'Prevenzione e Salute S.r.l.s.',
  registeredOffice: 'Via Delio Tessa 1, 20121 Milano (MI)',
  vat: '14915220967', // P.IVA and codice fiscale are the same number
  rea: 'MI-2814915',
  shareCapital: '€ 1.000 i.v.',
  pec: 'prevenzioneesalutesrls@tutelapec.it',
  openingHours,
  hours: openingHours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(' · '),
  certificatePrice: 50,
  medaidBooking: {
    enabled: true,
    url: 'https://medaid.it/professionista/prevenzione-e-salute/prenota/',
  },
  showEnglish: false, // set to true once the English pages exist
  // true = search engines may index the site (pages marked noindex stay out).
  // Cloudflare Workers Builds sets WORKERS_CI_BRANCH at build time: branch previews
  // get noindex everywhere, so only the production build (main) is indexable.
  indexable: [undefined, 'main'].includes(globalThis.process?.env?.WORKERS_CI_BRANCH),
};

// Site's own booking form (worker/index.js). Production uses Medaid (site.medaidBooking),
// so this form only appears on branch previews, where BOOKING_MODE in wrangler.jsonc is:
//   "off"  -> form hidden, contact fallback shown
//   "mock" -> demo slots, nothing is saved (a "demo" notice is shown)
export const booking = {
  timeZone: 'Europe/Rome',
  daysAhead: 21,     // how far ahead patients can book
  minNoticeHours: 2, // no slots sooner than this
  services: [
    { id: 'certificato', label: 'Certificato medico per attività sportiva non agonistica', short: 'Certificato non agonistico', price: `€${site.certificatePrice}`, minutes: 10 },
    { id: 'ludico', label: 'Certificato medico per attività ludico-motoria', short: 'Certificato ludico-motorio', price: `€${site.certificatePrice}`, minutes: 10 },
    { id: 'specialistica', label: 'Visita medica specialistica', short: 'Visita specialistica', price: 'Su richiesta', minutes: 10 },
  ],
  // Demo engine only: opening hours used to generate fake slots (0 = Sunday)
  mockHours: { days: [1, 2, 3, 4, 5, 6], ranges: [['09:00', '13:00'], ['15:00', '19:00']] },
};

// Contact channels that exist (empty fields are left out), shared by Footer and Contatti
export const contactChannels = () => [
  site.phone && { label: 'Telefono', value: site.phone, href: `tel:${site.phone}` },
  site.whatsapp && { label: 'WhatsApp', value: `+${site.whatsapp}`, href: `https://wa.me/${site.whatsapp}` },
  site.email && { label: 'Email', value: site.email, href: `mailto:${site.email}` },
].filter(Boolean);

// Approved service copy (doctor review DR-01..03), shared by Home and Servizi.
// summary = one line for the Home price table; details = full text on Servizi.
export const serviceInfo = [
  {
    id: 'certificato', title: 'Certificato medico per attività sportiva non agonistica', price: `€${site.certificatePrice}`, validity: '12 mesi',
    summary: 'Per lo sport praticato con società e associazioni sportive affiliate al CONI e per le attività parascolastiche.',
    details: "Necessario per l'attività sportiva non agonistica praticata con società e associazioni sportive affiliate al CONI e per le attività sportive parascolastiche. La visita dura circa 10 minuti e comprende anamnesi, esame obiettivo e misurazione della pressione arteriosa. Il certificato viene rilasciato al termine della visita, se il medico conferma l'idoneità. Il certificato è valido 12 mesi dalla data di rilascio.",
  },
  {
    id: 'ludico', title: 'Certificato medico per attività ludico-motoria', price: `€${site.certificatePrice}`, validity: '12 mesi',
    summary: 'Per attività fisica amatoriale e ricreativa, in palestra o nei corsi fitness.',
    details: "Per l'attività fisica amatoriale e ricreativa svolta al di fuori di società e associazioni sportive, ad esempio in palestra o nei corsi fitness, quando la struttura lo richiede. La visita dura circa 10 minuti. Il certificato viene rilasciato al termine della visita, se il medico conferma l'idoneità. Il certificato è valido 12 mesi dalla data di rilascio.",
  },
  {
    id: 'specialistica', title: 'Visite mediche specialistiche', price: 'Su richiesta',
    summary: 'Visite con medici specialisti presso lo studio, prenotabili online.',
    details: 'Visite con medici specialisti presso lo studio. Si prenotano online scegliendo «Visita medica specialistica» nella pagina Prenota.',
  },
];

// Schema.org data for the studio (JSON-LD). Empty fields are left out.
export const clinicSchema = (siteUrl) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': new URL('/#studio', siteUrl).href,
    name: site.name,
    url: new URL('/', siteUrl).href,
    image: new URL('/og-image.png', siteUrl).href,
    logo: new URL('/logo.png', siteUrl).href, // Google needs a raster logo, not SVG
    description: 'Studio medico presso GetFIT a Milano: certificato medico per attività sportiva non agonistica, certificato per attività ludico-motoria, visite mediche specialistiche.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Piacenza 4, primo piano (c/o GetFIT)',
      postalCode: '20135',
      addressLocality: 'Milano',
      addressRegion: 'MI',
      addressCountry: 'IT',
    },
    hasMap: site.mapsUrl,
    openingHoursSpecification: site.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    priceRange: `€${site.certificatePrice}`,
    makesOffer: [
      { '@type': 'Offer', name: 'Certificato medico per attività sportiva non agonistica', price: site.certificatePrice, priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Certificato medico per attività ludico-motoria', price: site.certificatePrice, priceCurrency: 'EUR' },
    ],
  };
  if (site.phone) data.telephone = site.phone;
  if (site.email) data.email = site.email;
  return data;
};
