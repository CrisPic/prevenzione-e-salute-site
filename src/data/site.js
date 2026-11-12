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
  bookingUrl: '', // TODO: Cal.com / Calendly link
  vat: '[P.IVA]', // TODO
  pec: '[PEC]',   // TODO
  certificatePrice: 50,
  showEnglish: false, // set to true once the English pages exist
  // false = every page gets <meta name="robots" content="noindex">.
  // Flip to true once the domain is live and the placeholders (phone, P.IVA, hours) are filled.
  indexable: false,
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
