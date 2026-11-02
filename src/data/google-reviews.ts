export type Review = {
  author: string;
  rating: number; // 1-5
  date: string;
  text: string;
};

// Google Maps-da biznes profilini aç → Share → linki kopyala və bura yaz
export const GOOGLE_PROFILE_URL = "https://www.google.com/maps/place/Calipro+Painting/@37.9277152,-122.7139223,9z/data=!3m1!4b1!4m6!3m5!1s0x4bbcb126877e3749:0x3929b5908be9700b!8m2!3d37.9295549!4d-122.054518!16s%2Fg%2F11xs_g1wfd?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D";

// Ən təzə və ən yaxşılar yuxarıda olsun
export const REVIEWS: Review[] = [
  { author: "Elshen Mamedov", rating: 5, date: "2025", text: "I recently had my apartment’s interior painted and the whole experience was honestly fantastic. The team showed up on time, worked clean, protected all the furniture, and the attention to detail was on point. The walls look smooth, the lines are sharp, and the colors came out exactly how I wanted. They finished earlier than expected and left everything spotless. Highly recommend if you want quality work without any stress." },
  { author: "Mehmet", rating: 5, date: "Aug 29, 2025", text: "I recommend them, they are very successful in their work." },
  { author: "Larisa D", rating: 5, date: "Aug 27, 2025", text: "Boss Painter Company exceeded my expectations. The team was punctual, respectful, and left the place cleaner than they found it. The paint quality is top-notch. Definitely a 5-star service." },
  { author: "Umut Bagcivan", rating: 5, date: "Aug 27, 2025", text: "I recently hired Boss Painter to paint the exterior of my home, and I’m beyond impressed with the results. From start to finish, their team was professional, on time, and incredibly detail-oriented.\n\nThey did an excellent job with the prep work—covering windows, protecting landscaping, and making sure every surface was ready for a flawless finish. The final result looks amazing. The paint is smooth, the lines are sharp, and the whole house has a fresh, clean look that really stands out.\n\nWhat I appreciated most was their communication and professionalism throughout the project. They listened to what I wanted, gave helpful advice on color choices, and followed through on every promise.\n\nIf you’re looking for reliable, high-quality painters for your home—inside or out—I highly recommend Boss Painter. They take pride in their work, and it shows in every detail." },
  { author: "Elchin Azimov", rating: 5, date: "Aug 27, 2025", text: "Super professional, fast, and detail-oriented. They transformed my house completely and the paint still looks brand new months later. Worth every penny!" },
  { author: "Kamran Hanifayev", rating: 5, date: "Aug 27, 2025", text: "Boss Painter Company is the real deal. From consultation to the final coat, everything was done with precision and care. My home looks brand new again!" },
  { author: "Nurlan Mammadov", rating: 5, date: "Aug 27, 2025", text: "This company is fantastic. Honest pricing, hardworking crew, and the final result looks amazing. They truly take pride in their work, and it shows." },
  { author: "Aziz Imanli", rating: 5, date: "Aug 27, 2025", text: "I had a fantastic experience! The painters were friendly, efficient, and very detail-focused. They even gave me great advice on color choices. My neighbors keep complimenting the new look." },
  { author: "Xatai Asadov", rating: 5, date: "Aug 27, 2025", text: "I am beyond happy with the results! From start to finish, communication was clear and the painters treated my home with great care. The finish looks flawless. I will definitely use Boss Painter Company again" },
  { author: "Ansar Gassanov", rating: 5, date: "Aug 27, 2025", text: "Super easy to work with, fair pricing, and outstanding quality. I’ll definitely hire them again." },
  { author: "Ilkin Babazade", rating: 5, date: "Aug 27, 2025", text: "Best painting company I’ve ever worked with. They truly care about the details." },
  { author: "Kamran Jafarof", rating: 5, date: "Aug 27, 2025", text: "They did a good job. Clean and perfect !!!" },
];