import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const IMG = (text: string) =>
  `https://placehold.co/400x400/f8f0e8/333?text=${text}`;

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "แชมพู", nameEn: "Shampoo", slug: "shampoo", icon: "🧴" } }),
    prisma.category.create({ data: { name: "ครีมนวด", nameEn: "Conditioner", slug: "conditioner", icon: "💆" } }),
    prisma.category.create({ data: { name: "ทรีทเมนต์", nameEn: "Hair Treatment", slug: "treatment", icon: "✨" } }),
    prisma.category.create({ data: { name: "สีผม", nameEn: "Hair Color", slug: "hair-color", icon: "🎨" } }),
    prisma.category.create({ data: { name: "สไตลิ่ง", nameEn: "Styling", slug: "styling", icon: "💅" } }),
  ]);

  const [shampoo, conditioner, treatment, hairColor, styling] = categories;

  await prisma.product.createMany({
    data: [
      // Shampoo
      {
        name: "แชมพูเคราติน โปรเฟสชั่นแนล",
        slug: "shampoo-keratin-professional",
        description: "แชมพูเคราตินระดับมืออาชีพ เหมาะสำหรับผมทำสีและผ่านความร้อน ช่วยเติมโปรตีนให้ผม แข็งแรงและเงางาม",
        ingredients: "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Keratin Protein, Panthenol, Vitamin E",
        howToUse: "เปียกผม บีบแชมพูประมาณ 10-15 มล. นวดเบาๆ บนหนังศีรษะ 2-3 นาที แล้วล้างออกด้วยน้ำสะอาด",
        price: 290,
        originalPrice: 350,
        stock: 200,
        sold: 1240,
        images: [IMG("Keratin+Shampoo")],
        badge: "BESTSELLER",
        rating: 4.8,
        reviewCount: 324,
        size: "500ml",
        categoryId: shampoo.id,
      },
      {
        name: "แชมพูลดผมร่วง เฮิร์บ พลัส",
        slug: "shampoo-hair-loss-herb-plus",
        description: "สูตรสมุนไพรไทยเข้มข้น ช่วยลดผมร่วง กระตุ้นการงอกใหม่ ผสมสารสกัดจากโสม ขิง และว่านหางจระเข้",
        ingredients: "Water, Ginseng Extract, Ginger Root Extract, Aloe Vera, Biotin, Niacinamide",
        howToUse: "ใช้วันละ 1-2 ครั้ง เปียกผมและหนังศีรษะ บีบแชมพูนวดอย่างทั่วถึง ทิ้งไว้ 3 นาที ล้างออกให้สะอาด",
        price: 220,
        originalPrice: 280,
        stock: 150,
        sold: 890,
        images: [IMG("Herb+Shampoo")],
        badge: "HOT",
        rating: 4.6,
        reviewCount: 215,
        size: "300ml",
        categoryId: shampoo.id,
      },
      {
        name: "แชมพูผมแห้งเสีย Argan Oil",
        slug: "shampoo-dry-damaged-argan-oil",
        description: "แชมพูอาร์แกนออยล์จากโมร็อกโก บำรุงผมแห้งเสียอย่างล้ำลึก ให้ผมนุ่มลื่น เป็นเงา และจัดทรงง่าย",
        ingredients: "Water, Argan Oil, Shea Butter, Hydrolyzed Silk, Vitamin B5",
        howToUse: "โฟมขึ้นบนผม นวดเบาๆ ล้างออกด้วยน้ำอุ่น ใช้คู่กับครีมนวดสูตร Argan Oil เพื่อผลลัพธ์ที่ดีที่สุด",
        price: 310,
        originalPrice: null,
        stock: 80,
        sold: 340,
        images: [IMG("Argan+Shampoo")],
        badge: "NEW",
        rating: 4.5,
        reviewCount: 87,
        size: "500ml",
        categoryId: shampoo.id,
      },
      {
        name: "แชมพูผมมันควบคุมน้ำมัน",
        slug: "shampoo-oily-hair-control",
        description: "สูตรพิเศษสำหรับหนังศีรษะมัน ควบคุมความมันส่วนเกิน ผมสะอาดสดชื่นนานถึง 24 ชั่วโมง",
        ingredients: "Water, Zinc Pyrithione, Salicylic Acid, Tea Tree Oil, Menthol",
        howToUse: "นวดบนหนังศีรษะที่เปียกชุ่ม 2 นาที ล้างออกให้สะอาด แนะนำให้ใช้ทุกวัน",
        price: 199,
        originalPrice: 250,
        stock: 120,
        sold: 445,
        images: [IMG("Oil+Control+Shampoo")],
        badge: "SALE",
        rating: 4.4,
        reviewCount: 132,
        size: "400ml",
        categoryId: shampoo.id,
      },

      // Conditioner
      {
        name: "ครีมนวด Keratin Smooth",
        slug: "conditioner-keratin-smooth",
        description: "ครีมนวดเคราตินสูตรเข้มข้น ทำให้ผมนุ่มเรียบลื่นตลอดวัน ลดผมฟูและเส้นผมไม่เป็นระเบียบ",
        ingredients: "Water, Cetearyl Alcohol, Keratin, Dimethicone, Fragrance",
        howToUse: "หลังสระผม บีบครีมนวดทาผ่านกลางผมถึงปลาย ทิ้งไว้ 3-5 นาที ล้างออก",
        price: 280,
        originalPrice: 320,
        stock: 90,
        sold: 560,
        images: [IMG("Keratin+Conditioner")],
        badge: "HOT",
        rating: 4.7,
        reviewCount: 178,
        size: "500ml",
        categoryId: conditioner.id,
      },
      {
        name: "ครีมนวดอาร์แกนออยล์ เนื้อบางเบา",
        slug: "conditioner-argan-oil-light",
        description: "ครีมนวดเนื้อบางเบาสำหรับผมบางและเส้นเล็ก ให้ความชุ่มชื้นโดยไม่ทำให้ผมหนักหรือแบน",
        ingredients: "Water, Argan Oil, Cyclomethicone, Glycerin, Panthenol",
        howToUse: "ใช้หลังสระผม ทาเฉพาะส่วนกลางและปลายผม หลีกเลี่ยงโคนผม ล้างออกหลังจาก 2 นาที",
        price: 250,
        originalPrice: null,
        stock: 65,
        sold: 289,
        images: [IMG("Argan+Conditioner")],
        badge: "NEW",
        rating: 4.5,
        reviewCount: 94,
        size: "300ml",
        categoryId: conditioner.id,
      },

      // Treatment
      {
        name: "ทรีทเมนต์ Keratin Repair",
        slug: "treatment-keratin-repair",
        description: "ทรีทเมนต์เคราตินซ่อมแซมผมเสียเชิงลึก ฟื้นฟูโครงสร้างผมที่เสียหายจากการทำสีและเปอร์ม ให้ผมแข็งแรง เป็นเงา",
        ingredients: "Water, Hydrolyzed Keratin, Amino Acids, Argan Oil, Panthenol, Glycerin",
        howToUse: "หลังสระผม บีบทรีทเมนต์ทาให้ทั่วผม นวดเบาๆ ทิ้งไว้ 10-15 นาที หรือคลุมด้วยหมวกอุ่น ล้างออกด้วยน้ำเย็น",
        price: 450,
        originalPrice: 550,
        stock: 45,
        sold: 670,
        images: [IMG("Keratin+Treatment")],
        badge: "SALE",
        rating: 4.9,
        reviewCount: 201,
        size: "500ml",
        categoryId: treatment.id,
      },
      {
        name: "มาส์กผมเข้มข้น Collagen",
        slug: "mask-collagen-intensive",
        description: "มาส์กคอลลาเจนเข้มข้น เติมความชุ่มชื้นและยืดหยุ่นให้ผม ลดการขาดหักของเส้นผม ทำให้ผมดูหนาและแข็งแรง",
        ingredients: "Water, Hydrolyzed Collagen, Shea Butter, Vitamin E, Biotin, Silk Protein",
        howToUse: "ทาให้ทั่วผมหลังสระ ใส่ถุงพลาสติกหรือหมวกอุ่นทิ้งไว้ 20 นาที ล้างออกด้วยน้ำเย็น ใช้สัปดาห์ละ 1-2 ครั้ง",
        price: 380,
        originalPrice: null,
        stock: 55,
        sold: 512,
        images: [IMG("Collagen+Mask")],
        badge: "HOT",
        rating: 4.8,
        reviewCount: 156,
        size: "250ml",
        categoryId: treatment.id,
      },
      {
        name: "เซรั่มผม Olaplex-Style Bond Repair",
        slug: "serum-bond-repair",
        description: "เซรั่มซ่อมพันธะผม เทคโนโลยีเดียวกับแซลอนระดับสูง ซ่อมแซมพันธะที่ขาดภายในเส้นผม เหมาะก่อนและหลังทำสี",
        ingredients: "Water, Bis-Aminopropyl Diglycol Dimaleate, Sodium Cocoyl Isethionate",
        howToUse: "ผสมกับครีมสีผม หรือทาบนผมสะอาดก่อนสระ ทิ้งไว้ 10 นาที",
        price: 520,
        originalPrice: 620,
        stock: 30,
        sold: 287,
        images: [IMG("Bond+Repair+Serum")],
        badge: "BESTSELLER",
        rating: 4.9,
        reviewCount: 98,
        size: "100ml",
        categoryId: treatment.id,
      },

      // Hair Color
      {
        name: "ครีมสีผม Professional Ash Brown",
        slug: "hair-color-ash-brown",
        description: "สีผมโทนน้ำตาลเทา ติดทนนาน 8 สัปดาห์ ปิดผมขาว 100% สีสม่ำเสมอทุกเส้น ไม่ระคายเคือง",
        ingredients: "Cream Base, P-Phenylenediamine, Resorcinol, Hydrogen Peroxide 6%",
        howToUse: "ผสมครีมสี 1:1 กับออกซิไดเซอร์ ทาจากโคนผมถึงปลาย ทิ้งไว้ 30-35 นาที ล้างออกและใช้ครีมนวด",
        price: 320,
        originalPrice: 380,
        stock: 100,
        sold: 423,
        images: [IMG("Ash+Brown+Color")],
        badge: "HOT",
        rating: 4.6,
        reviewCount: 145,
        size: "100ml+100ml",
        categoryId: hairColor.id,
      },
      {
        name: "ครีมสีผม Natural Black Shine",
        slug: "hair-color-natural-black",
        description: "สีดำธรรมชาติ เงางามเป็นพิเศษ ปิดผมขาวได้ดีเยี่ยม เหมาะสำหรับซาลอนและการใช้ที่บ้าน",
        ingredients: "Cream Base, P-Phenylenediamine, Hydrogen Peroxide, Conditioning Agents",
        howToUse: "ผสม 1:1 กับออกซิไดเซอร์ ทิ้งไว้ 25-30 นาที สำหรับปิดผมขาว ทิ้งไว้ 35 นาที",
        price: 280,
        originalPrice: null,
        stock: 85,
        sold: 678,
        images: [IMG("Natural+Black+Color")],
        badge: "BESTSELLER",
        rating: 4.7,
        reviewCount: 203,
        size: "100ml+100ml",
        categoryId: hairColor.id,
      },
      {
        name: "ออกซิไดเซอร์ 6% / 9% / 12%",
        slug: "oxidizer-developer",
        description: "ออกซิไดเซอร์คุณภาพสูงสำหรับใช้คู่กับครีมสีผมทุกยี่ห้อ มี 3 ระดับความเข้มข้น สูตรบำรุงผมไม่ทำลาย",
        ingredients: "Hydrogen Peroxide, Conditioning Agents, Stabilizers",
        howToUse: "ผสมกับครีมสีในอัตรา 1:1 ตามที่ระบุในครีมสี",
        price: 180,
        originalPrice: 220,
        stock: 200,
        sold: 912,
        images: [IMG("Oxidizer")],
        badge: "SALE",
        rating: 4.5,
        reviewCount: 267,
        size: "1000ml",
        categoryId: hairColor.id,
      },

      // Styling
      {
        name: "วักซ์จัดแต่งทรงผม Matte Clay",
        slug: "styling-wax-matte-clay",
        description: "วักซ์ดินเหนียวเนื้อแมท จัดทรงได้แน่น เงาน้อย ทรงทนนานตลอดวัน สำหรับผมสั้นถึงกลาง",
        ingredients: "Beeswax, Kaolin Clay, Lanolin, Fragrance",
        howToUse: "ตักเท่าเม็ดถั่ว ถูฝ่ามือให้อุ่น ทาผ่านผมแห้งหรือผมชื้น จัดทรงตามต้องการ",
        price: 250,
        originalPrice: 290,
        stock: 70,
        sold: 389,
        images: [IMG("Matte+Clay+Wax")],
        badge: "HOT",
        rating: 4.6,
        reviewCount: 112,
        size: "100ml",
        categoryId: styling.id,
      },
      {
        name: "สเปรย์พ่นผม Hold & Shine",
        slug: "styling-spray-hold-shine",
        description: "สเปรย์จัดทรงพร้อมเพิ่มความเงา ล็อคทรงได้นาน ไม่ทำให้ผมแข็งกระด้าง ล้างออกง่าย",
        ingredients: "Water, PVP, Polyquaternium, Panthenol, Fragrance",
        howToUse: "พ่นห่างผมประมาณ 25-30 ซม. หลังจัดทรงเสร็จแล้ว",
        price: 190,
        originalPrice: null,
        stock: 110,
        sold: 534,
        images: [IMG("Hold+Shine+Spray")],
        badge: "NEW",
        rating: 4.4,
        reviewCount: 89,
        size: "300ml",
        categoryId: styling.id,
      },
      {
        name: "ครีมกันฝืดกันชื้น Anti-Frizz",
        slug: "styling-anti-frizz-cream",
        description: "ครีมควบคุมผมฟูในวันที่อากาศชื้น ลดผมฟูได้ 95% ปกป้องผมจากความชื้นนาน 48 ชั่วโมง",
        ingredients: "Water, Dimethicone, Cyclopentasiloxane, Glycerin, Argan Oil",
        howToUse: "ทาบนผมชื้นก่อนเป่าผม หรือทาบนผมแห้งเพื่อจัดการผมฟู",
        price: 320,
        originalPrice: 370,
        stock: 40,
        sold: 298,
        images: [IMG("Anti-Frizz+Cream")],
        badge: "BESTSELLER",
        rating: 4.8,
        reviewCount: 134,
        size: "150ml",
        categoryId: styling.id,
      },
    ],
  });

  await prisma.adminUser.create({
    data: { username: "admin", password: "admin1234" },
  });

  const count = await prisma.product.count();
  console.log(`✅ Seeded ${count} products across ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
