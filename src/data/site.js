// Single source of truth for practical info. Change it here, it updates everywhere.
export const site = {
  name: 'Prevenzione e Salute',
  address: 'Via Piacenza 4, 20135 Milano',
  venue: 'c/o GetFIT – primo piano',
  venueEn: 'inside GetFIT – first floor',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=GetFIT+Via+Piacenza+4+Milano',
  phone: '',      // TODO
  whatsapp: '',   // TODO, international format without + e.g. 393331234567
  email: '',      // TODO
  vat: '[P.IVA]', // TODO
  pec: '[PEC]',   // TODO
  certificatePrice: 50,
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
    { id: 'certificato', label: 'Certificato medico sportivo non agonistico', short: 'Certificato sportivo', price: `€${site.certificatePrice}`, minutes: 30, eventTypeId: null },
    { id: 'pressione', label: 'Misurazione della pressione arteriosa', short: 'Pressione arteriosa', price: 'Su richiesta', minutes: 15, eventTypeId: null },
    { id: 'controllo', label: 'Controlli di salute di base e prescrizioni', short: 'Controllo di salute', price: 'Su richiesta', minutes: 30, eventTypeId: null },
  ],
  // Demo engine only: opening hours used to generate fake slots (0 = Sunday)
  mockHours: { days: [1, 2, 3, 4, 5, 6], ranges: [['09:00', '13:00'], ['15:00', '19:00']] },
};

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
    description: 'Studio medico presso GetFIT a Milano: certificato medico sportivo non agonistico, misurazione della pressione arteriosa, controlli di salute di base.',
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
    makesOffer: {
      '@type': 'Offer',
      name: 'Certificato medico sportivo non agonistico',
      price: site.certificatePrice,
      priceCurrency: 'EUR',
    },
  };
  if (site.phone) data.telephone = site.phone;
  if (site.email) data.email = site.email;
  return data;
};
