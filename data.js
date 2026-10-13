/* ============================================================
   Esen Sofrası — Menü Verisi
   Görseller: Kendi fotoğraflarınızı "images" dizisine ekleyin.
   Örn: "images/adana-kebap-1.jpg"
   ============================================================ */

const RESTAURANT = {
  name: "Esen Sofrası",
  phone: "+905325253162", // Aranacak numara (tıkla-ara)
  phoneDisplay: "0532 525 31 62",
  whatsapp: "905325253162", // WhatsApp: ülke koduyla, boşluksuz
  whatsappMessage: "Merhabalar, dijital menüden ulaşıyorum.",
  instagram: "https://www.instagram.com/esensofrasi/",
  facebook: "https://www.facebook.com/esensofras/",
  location:
    "https://www.google.com/maps/search/?api=1&query=Esen%20Sofras%C4%B1%20Necip%20Faz%C4%B1l%20Bulvar%C4%B1%20Sincan%20Ankara",
};

const PLACEHOLDER = (text, bg = "7a1f1f", fg = "ffffff") =>
  `https://placehold.co/600x450/${bg}/${fg}?text=${encodeURIComponent(text)}`;

const MENU = [
  {
    id: "kebaplar",
    name: "Kebaplar",
    description: "Köz ateşinde pişen, usta ellerden geleneksel kebaplar",
    icon: '<svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    color: "#e66102",
    items: [
      {
        id: "adana-kebap",
        name: "Adana Kebap",
        featured: true,
        description:
          "El kıyması dana eti, kuyruk yağı ve pul biberle yoğrulup şişte közde pişirilir. Yanında közlenmiş domates, biber ve lavaş ile servis edilir.",
        price: 260,
        tags: ["Acılı", "Izgara"],
        ingredients: ["Dana kıyma", "Kuyruk yağı", "Pul biber", "Lavaş"],
        images: [
          "images/adana-kebap-1.jpg",
          PLACEHOLDER("Adana+Kebap+2", "a3432b"),
          PLACEHOLDER("Adana+Kebap+3", "4d1313"),
        ],
      },
      {
        id: "urfa-kebap",
        name: "Urfa Kebap",
        description:
          "Acısız, yalnızca tuz ve baharatla yoğrulan kıymadan hazırlanan klasik Şanlıurfa lezzeti. Sumaklı soğan ve lavaş ile.",
        price: 250,
        tags: ["Acısız", "Izgara"],
        ingredients: ["Dana kıyma", "Kuyruk yağı", "Tuz", "Lavaş"],
        images: [
          "images/urfa-kebap-1.jpg",
          PLACEHOLDER("Urfa+Kebap+2", "a3432b"),
        ],
      },
      {
        id: "beyti-kebap",
        name: "Beyti Kebap",
        description:
          "Lavaşa sarılmış közlenmiş kebap, üzeri domates sosu ve tereyağı ile kaplanır. Yanında yoğurt ile servis edilir.",
        price: 290,
        tags: ["Yoğurtlu", "Soslu"],
        ingredients: ["Dana kıyma", "Lavaş", "Domates sosu", "Tereyağı"],
        images: [
          PLACEHOLDER("Beyti+Kebap"),
          PLACEHOLDER("Beyti+Kebap+2", "a3432b"),
        ],
      },
      {
        id: "sis-kebap",
        name: "Şiş Kebap",
        description:
          "Kuşbaşı doğranmış dana eti, soğan ve baharatla marine edilip şişte közlenir. Lavaş ve közlenmiş sebzelerle.",
        price: 280,
        tags: ["Izgara"],
        ingredients: ["Kuşbaşı dana", "Soğan", "Karabiber", "Lavaş"],
        images: [
          "images/sis-kebap-1.jpg",
          PLACEHOLDER("Sis+Kebap+2", "4d1313"),
        ],
      },
      {
        id: "iskender-kebap",
        name: "İskender Kebap",
        featured: true,
        description:
          "Pide üzerine doğranmış döner eti, üzeri sıcak domates sosu ve tereyağı. Yanında yoğurt ile Bursa klasiği.",
        price: 300,
        tags: ["Tereyağlı", "Yoğurtlu"],
        ingredients: ["Döner", "Pide", "Domates sosu", "Tereyağı", "Yoğurt"],
        images: [
          PLACEHOLDER("Iskender+Kebap"),
          PLACEHOLDER("Iskender+Kebap+2", "a3432b"),
          PLACEHOLDER("Iskender+Kebap+3", "4d1313"),
        ],
      },
      {
        id: "karisik-izgara",
        name: "Karışık Izgara",
        featured: true,
        description:
          "Adana, Urfa, şiş ve pirzoladan oluşan kalabalıklara özel karışık tabak. Lavaş ve közlenmiş sebzelerle.",
        price: 550,
        tags: ["Karışık", "2-3 Kişilik"],
        ingredients: ["Adana", "Urfa", "Şiş", "Pirzola", "Lavaş"],
        images: [
          PLACEHOLDER("Karisik+Izgara"),
          PLACEHOLDER("Karisik+Izgara+2", "a3432b"),
        ],
      },
    ],
  },
  {
    id: "pideler",
    name: "Pideler",
    description: "Taş fırında çıtır hamur, bol malzemeli pideler",
    icon: '<svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/></svg>',
    color: "#f5821f",
    items: [
      {
        id: "kasarli-pide",
        name: "Kaşarlı Pide",
        featured: true,
        description:
          "Taş fırında çıtır hamur üzerine bol kaşar peyniri. Klasik ve sade lezzet.",
        price: 120,
        tags: ["Vejetaryen"],
        ingredients: ["Hamur", "Kaşar peyniri", "Tereyağı"],
        images: [
          PLACEHOLDER("Kasarlı+Pide"),
          PLACEHOLDER("Kasarlı+Pide+2", "4d1313"),
        ],
      },
      {
        id: "kiymali-pide",
        name: "Kıymalı Pide",
        description:
          "Taş fırında, kıymalı harç ve bol yeşillikle hazırlanan geleneksel pide.",
        price: 150,
        tags: ["Kıymalı"],
        ingredients: ["Kıyma", "Soğan", "Domates", "Maydanoz"],
        images: [
          PLACEHOLDER("Kıymalı+Pide"),
          PLACEHOLDER("Kıymalı+Pide+2", "a3432b"),
        ],
      },
      {
        id: "kusbasili-pide",
        name: "Kuşbaşılı Pide",
        description:
          "Kuşbaşı et, kaşar peyniri ve biberle hazırlanan doyurucu pide.",
        price: 170,
        tags: ["Etli"],
        ingredients: ["Kuşbaşı et", "Kaşar", "Biber", "Domates"],
        images: [
          PLACEHOLDER("Kusbasılı+Pide"),
          PLACEHOLDER("Kusbasılı+Pide+2", "4d1313"),
        ],
      },
      {
        id: "karisik-pide",
        name: "Karışık Pide",
        description:
          "Kıyma, kuşbaşı, sucuk ve kaşarın bir araya geldiği zengin karışık pide.",
        price: 200,
        tags: ["Karışık"],
        ingredients: ["Kıyma", "Kuşbaşı", "Sucuk", "Kaşar"],
        images: [
          PLACEHOLDER("Karisik+Pide"),
          PLACEHOLDER("Karisik+Pide+2", "a3432b"),
        ],
      },
      {
        id: "pastirmali-pide",
        name: "Pastırmalı Pide",
        description:
          "Kaşar peyniri ve çemenli pastırma ile hazırlanan, yumurtalı özel pide.",
        price: 210,
        tags: ["Pastırmalı"],
        ingredients: ["Pastırma", "Kaşar", "Yumurta"],
        images: [
          PLACEHOLDER("Pastırmalı+Pide"),
          PLACEHOLDER("Pastırmalı+Pide+2", "4d1313"),
        ],
      },
    ],
  },
  {
    id: "tatlilar",
    name: "Tatlılar",
    description: "Şerbetli ve sütlü tatlılar",
    icon: '<svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>',
    color: "#c24e00",
    items: [
      {
        id: "kunefe",
        name: "Künefe",
        featured: true,
        description:
          "Tel kadayıf arasında Antep peyniri, sıcak şerbet ve antep fıstığı ile taş fırından.",
        price: 140,
        tags: ["Sıcak", "Fıstıklı"],
        ingredients: ["Kadayıf", "Peynir", "Şerbet", "Antep fıstığı"],
        images: [
          PLACEHOLDER("Kunefe"),
          PLACEHOLDER("Kunefe+2", "a3432b"),
        ],
      },
      {
        id: "baklava",
        name: "Baklava",
        description:
          "İnce yufkalar arasında bol Antep fıstığı, tereyağı ve şerbet ile klasik tatlı.",
        price: 130,
        tags: ["Fıstıklı"],
        ingredients: ["Yufka", "Antep fıstığı", "Tereyağı", "Şerbet"],
        images: [
          PLACEHOLDER("Baklava"),
          PLACEHOLDER("Baklava+2", "4d1313"),
        ],
      },
      {
        id: "sutlac",
        name: "Sütlaç",
        description:
          "Fırında hafif karamelize edilmiş, pirinçli klasik sütlü tatlı.",
        price: 90,
        tags: ["Sütlü"],
        ingredients: ["Süt", "Pirinç", "Şeker"],
        images: [
          PLACEHOLDER("Sutlac"),
          PLACEHOLDER("Sutlac+2", "a3432b"),
        ],
      },
      {
        id: "kazandibi",
        name: "Kazandibi",
        description:
          "Hafif karamelize alt kısmıyla klasik Osmanlı sütlü tatlısı.",
        price: 90,
        tags: ["Sütlü"],
        ingredients: ["Süt", "Un", "Şeker"],
        images: [
          PLACEHOLDER("Kazandibi"),
          PLACEHOLDER("Kazandibi+2", "4d1313"),
        ],
      },
      {
        id: "fistikli-kadayif",
        name: "Fıstıklı Kadayıf",
        description:
          "Çıtır kadayıf, bol Antep fıstığı ve şerbetle hazırlanan geleneksel tatlı.",
        price: 130,
        tags: ["Fıstıklı"],
        ingredients: ["Kadayıf", "Antep fıstığı", "Şerbet"],
        images: [
          PLACEHOLDER("Fıstıklı+Kadayıf"),
          PLACEHOLDER("Fıstıklı+Kadayıf+2", "a3432b"),
        ],
      },
    ],
  },
  {
    id: "icecekler",
    name: "İçecekler",
    description: "Soğuk ve sıcak içecekler",
    icon: '<svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/></svg>',
    color: "#ff9b4d",
    items: [
      {
        id: "ayran",
        name: "Ayran",
        description: "Köpürtülmüş taze ev yapımı ayran.",
        price: 35,
        tags: ["Soğuk"],
        ingredients: ["Yoğurt", "Su", "Tuz"],
        images: [PLACEHOLDER("Ayran")],
      },
      {
        id: "kola",
        name: "Kola",
        description: "330 ml soğuk şişe kola.",
        price: 50,
        tags: ["Soğuk"],
        ingredients: [],
        images: [PLACEHOLDER("Kola")],
      },
      {
        id: "gazoz",
        name: "Gazoz",
        description: "330 ml meyveli gazoz.",
        price: 45,
        tags: ["Soğuk"],
        ingredients: [],
        images: [PLACEHOLDER("Gazoz")],
      },
      {
        id: "cay",
        name: "Çay",
        description: "Demlik taze çay.",
        price: 20,
        tags: ["Sıcak"],
        ingredients: [],
        images: [PLACEHOLDER("Cay")],
      },
      {
        id: "turk-kahvesi",
        name: "Türk Kahvesi",
        description: "Odun ateşinde pişirilmiş Türk kahvesi, lokum ile.",
        price: 60,
        tags: ["Sıcak"],
        ingredients: [],
        images: [PLACEHOLDER("Turk+Kahvesi")],
      },
      {
        id: "su",
        name: "Su",
        description: "500 ml şişe su.",
        price: 15,
        tags: ["Soğuk"],
        ingredients: [],
        images: [PLACEHOLDER("Su")],
      },
    ],
  },
  {
    id: "ikramlar",
    name: "İkramlar",
    description: "Yemek öncesi taze ve közlenmiş mezeler",
    icon: '<svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/><path d="m13 12 4-4"/><path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/></svg>',
    color: "#e66102",
    items: [
      {
        id: "cig-kofte",
        name: "Çiğ Köfte",
        description:
          "İnce bulgur, isot, domates salçası ve baharatla yoğrulan geleneksel lezzet. Marul, limon ve lavaş ile servis edilir.",
        price: 90,
        tags: ["Acılı", "Vejetaryen"],
        ingredients: ["İnce bulgur", "İsot", "Domates salçası", "Nar ekşisi"],
        images: [
          PLACEHOLDER("Cig+Kofte"),
          PLACEHOLDER("Cig+Kofte+2", "e66102"),
        ],
      },
      {
        id: "mevsim-salatasi",
        name: "Mevsim Salatası",
        description:
          "Taze mevsim yeşillikleri, domates, salatalık ve nar ekşisi–zeytinyağı sos ile.",
        price: 70,
        tags: ["Taze", "Vejetaryen"],
        ingredients: ["Mevsim yeşillikleri", "Domates", "Salatalık", "Zeytinyağı"],
        images: [
          PLACEHOLDER("Mevsim+Salatasi", "e66102"),
        ],
      },
      {
        id: "acili-ezme",
        name: "Acılı Ezme",
        description:
          "İnce doğranmış domates, biber, sarımsak ve nar ekşisiyle hazırlanan meze.",
        price: 60,
        tags: ["Acılı", "Vejetaryen"],
        ingredients: ["Domates", "Biber", "Sarımsak", "Nar ekşisi"],
        images: [
          PLACEHOLDER("Acili+Ezme", "e66102"),
        ],
      },
      {
        id: "yogurtlu-patlican",
        name: "Yoğurtlu Patlıcan",
        description:
          "Közlenmiş patlıcan üzerine sarımsaklı süzme yoğurt ve tereyağlı kırmızı sos.",
        price: 100,
        tags: ["Meze", "Vejetaryen"],
        ingredients: ["Patlıcan", "Süzme yoğurt", "Sarımsak", "Tereyağı"],
        images: [
          PLACEHOLDER("Yogurtlu+Patlican", "e66102"),
          PLACEHOLDER("Yogurtlu+Patlican+2", "e66102"),
        ],
      },
    ],
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
