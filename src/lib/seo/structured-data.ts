// JSON-LD structured data generators for SEO

export function generateOrganizationSchema(
  clubName: string,
  url: string,
  logoUrl: string,
  phone: string,
  email: string,
  address: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: clubName,
    url,
    logo: logoUrl,
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
    },
    sport: 'Sailing',
    sameAs: [],
  }
}

export function generateWebSiteSchema(clubName: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: clubName,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/fr/actualites?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateArticleSchema(
  title: string,
  description: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  authorName: string,
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: authorName,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

export function generateCourseSchema(
  title: string,
  description: string,
  price: number,
  currency: string,
  startDate: string,
  endDate: string,
  provider: string,
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    provider: {
      '@type': 'SportsOrganization',
      name: provider,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      startDate,
      endDate,
    },
  }
}

export function generateEventSchema(
  name: string,
  startDate: string,
  endDate: string,
  location: string,
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name,
    startDate,
    endDate,
    location: {
      '@type': 'Place',
      name: location,
    },
    url,
    sport: 'Sailing',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  }
}

export function generateLocalBusinessSchema(
  name: string,
  address: string,
  phone: string,
  email: string,
  lat: number,
  lng: number,
  url: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
    },
    telephone: phone,
    email,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    url,
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
