import Bookings from '../../api/bookings/bookings';
import Products from '../../api/products/products';
import Services from '../../api/services/services';

// TODO: remove sample data
if (Bookings.find().count() === 0) {
  Bookings.insert({
    title: 'wedding makeup artist needed',
    location: 'South Yarra, VIC',
    summary:
      'Exercitationem quos repudiandae. Voluptatem sit sed minus quia non aut hic. Consequuntur commodi et voluptatem ratione cum sunt iusto ut. Architecto quidem facilis voluptatum.',
  });

  Bookings.insert({
    title: 'hair stylist needed - URGENT!',
    location: 'Gold Coast, QLD',
    summary:
      'Officia sunt perferendis sunt doloremque non. Totam enim nemo vitae nisi exercitationem nihil fugit ratione. Similique aut voluptas qui rerum mollitia asperiores. Eius maiores quia beatae earum blanditiis libero dolores minus.',
  });

  Bookings.insert({
    title: 'makeup artist needed',
    location: 'Doncaster, VIC',
    summary: 'Distinctio nemo facere voluptatem. Qui architecto non qui molestias. Id impedit at.',
  });

  Bookings.insert({
    title: 'I need my hair done ASAP',
    location: 'Perth, WA',
    summary:
      'Eligendi et dignissimos perspiciatis doloremque asperiores iste exercitationem et amet. Aliquid consequatur sed numquam temporibus libero quas. Ut dolore nostrum adipisci rerum temporibus rerum.',
  });

  Bookings.insert({
    title: 'makeup needed',
    location: 'Chatswood, NSW',
    summary:
      'Labore est quo quaerat numquam voluptatum. Libero est aut voluptate. Quae earum numquam. Quam tempora eum vel. Id excepturi rem autem tempore sint voluptas qui est. Beatae similique nihil ratione corporis in ut dolorum.',
  });
}

// seed Products data
if (Products.find().count() === 0) {
  const brands = [
    "L'Oréal",
    'Pantene',
    'Nivea',
    'Lancôme',
    'Avon',
    'Dove',
    'Olay',
    'Estée Lauder',
    'Head & Shoulders',
    'Christian Dior',
    'Chanel',
    'Aveeno',
    'Garnier',
    'Schwarzkopf',
    'Maybelline',
    'Clarins',
    'Shiseido',
    'Clean & Clear',
    'Neutrogena',
    'Natura',
    "L'Occitane",
    "Johnson's",
    'Lux',
    'M.A.C.',
    'Kérastase',
    'Redken',
    'Rexona',
    'Biotherm',
    'Vichy',
    'Oriflame',
    'Matrix',
    'Clearasil',
    'Rimmel',
    'Yves Saint Laurent',
    'The Body Shop',
    'Pola Orbis',
    'Sunsilk',
    'Clinique',
    'Softsoap',
    'Biore',
    'Irish Spring',
    'Coty',
    'Revlon',
    'Elizabeth Arden',
    'Eucerin',
    'RoC',
    'La Roche-Posay',
    'KOSÉ',
    "Kiehl's",
    'Speed Stick',
  ];
  brands.forEach((brand) => {
    Products.insert({
      name: brand,
      system: true,
    });
  });
}

// seed Services data
if (Services.find().count() === 0) {
  const services = [
    'Make-Up',
    'Hair',
    'Wedding',
    'Nails',
    'Eyebrow',
    'Eyelash',
    'Massage & Spa',
    'Tanning',
    'Waxing',
    'Skincare treatment',
    'Facial',
  ];

  services.forEach((service) => {
    Services.insert({
      name: service,
      system: true,
      published: true,
    });
  });
}
