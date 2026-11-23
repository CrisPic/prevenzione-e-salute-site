// Single source of truth for practical info. Change it here, it updates everywhere.
export const site = {
  name: 'Prevenzione e Salute',
  address: 'Via Piacenza 4, 20135 Milano',
  venue: 'presso GetFIT, primo piano',
  venueEn: 'inside GetFIT – first floor',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=GetFIT+Via+Piacenza+4+Milano',
  phone: '',      // TODO
  whatsapp: '',   // TODO, international format without + e.g. 393331234567
  email: '',      // TODO
  // Company that runs the site and the bookings (Registro Imprese visura, 27 Oct 2026).
  legalName: 'Prevenzione e Salute S.r.l.s.',
  registeredOffice: 'Via Delio Tessa 1, 20121 Milano (MI)',
  vat: '14915220967', // P.IVA and codice fiscale are the same number
  rea: 'MI-2814915',
  shareCapital: '€ 1.000 i.v.',
  pec: 'prevenzioneesalutesrls@tutelapec.it',
  hours: '',      // TODO opening hours, e.g. 'Lun–Ven 9–19'; hidden on the site while empty
  certificatePrice: 50,
  medaidBooking: {
    // Enable after the public booking page and the privacy notice have been verified.
    enabled: false,
    url: 'https://medaid.it/professionista/prevenzione-e-salute/prenota/',
  },
  showEnglish: false, // set to true once the English pages exist
  // false = every page gets <meta name="robots" content="noindex">.
  // Flip to true once the domain is live and the placeholders (phone, P.IVA, hours) are filled.
  indexable: false,
};

// Online booking (Prenota page + Worker API in worker/index.js).
// The engine is picked by the Worker variable BOOKING_MODE in wrangler.jsonc:
//   "off"    -> form hidden, WhatsApp/phone fallback shown
//   "mock"   -> demo slots, nothing is saved (a "demo" notice is shown)
//   "calcom" -> real slots/bookings via the Cal.com API (needs secret CALCOM_API_KEY
//               and an eventTypeId for each service below)
export const booking = {
  timeZone: 'Europe/Rome',
  daysAhead: 21,     // how far ahead patients can book
  minNoticeHours: 2, // no slots sooner than this
  services: [
    { id: 'certificato', label: 'Certificato medico per attività sportiva non agonistica', short: 'Certificato non agonistico', price: `€${site.certificatePrice}`, minutes: 10, eventTypeId: 7889004 },
    { id: 'ludico', label: 'Certificato medico per attività ludico-motoria', short: 'Certificato ludico-motorio', price: `€${site.certificatePrice}`, minutes: 10, eventTypeId: 7933000 },
    { id: 'specialistica', label: 'Visita medica specialistica', short: 'Visita specialistica', price: 'Su richiesta', minutes: 10, eventTypeId: 7933007 },
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
    logo: new URL('/favicon.svg', siteUrl).href,
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
