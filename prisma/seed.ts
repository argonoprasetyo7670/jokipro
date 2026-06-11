import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Clean all tables
  await prisma.review.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.message.deleteMany();
  await prisma.order.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.task.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleaned all tables");

  // ==================== USERS ====================
  const passwordHash = await hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin JokiPro",
      email: "admin@jokipro.id",
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
      phone: "+62 811 0000 001",
    },
  });

  const client1 = await prisma.user.create({
    data: {
      name: "Andi Pratama",
      email: "andi@client",
      passwordHash,
      role: "CLIENT",
      emailVerified: new Date(),
      phone: "+62 812 3456 7890",
    },
  });

  const client2 = await prisma.user.create({
    data: {
      name: "Dewi Sartika",
      email: "dewi@client",
      passwordHash,
      role: "CLIENT",
      emailVerified: new Date(),
      phone: "+62 813 2222 3333",
    },
  });

  const worker1 = await prisma.user.create({
    data: {
      name: "Ahmad Fauzi",
      email: "ahmad@worker.id",
      passwordHash,
      role: "WORKER",
      emailVerified: new Date(),
      phone: "+62 857 1111 2222",
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      name: "Siti Nurhaliza",
      email: "siti@worker.id",
      passwordHash,
      role: "WORKER",
      emailVerified: new Date(),
      phone: "+62 858 3333 4444",
    },
  });

  const worker3 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@worker.id",
      passwordHash,
      role: "WORKER",
      emailVerified: new Date(),
      phone: "+62 859 5555 6666",
    },
  });

  const worker4 = await prisma.user.create({
    data: {
      name: "Diana Kusuma",
      email: "diana@worker.id",
      passwordHash,
      role: "WORKER",
      phone: "+62 856 7777 8888",
    },
  });

  const worker5 = await prisma.user.create({
    data: {
      name: "Rizky Putra",
      email: "rizky@worker.id",
      passwordHash,
      role: "WORKER",
      phone: "+62 852 9999 0000",
    },
  });

  console.log("✅ Created 8 users (1 admin, 2 clients, 5 workers)");

  // ==================== WORKER PROFILES ====================
  const wp1 = await prisma.workerProfile.create({
    data: {
      userId: worker1.id,
      bio: "Mahasiswa Teknik Informatika UI semester 8. Berpengalaman dalam competitive programming dan mengerjakan berbagai proyek web development.",
      skills: ["Programming", "Web Development", "Python", "Algoritma", "Data Science"],
      kycStatus: "APPROVED",
      university: "Universitas Indonesia",
      major: "Teknik Informatika",
      educationLevel: "S1",
      graduationYear: 2026,
      cvUrl: "https://drive.google.com/cv-ahmad.pdf",
      portfolioUrl: "https://github.com/ahmadfauzi",
      portfolioFiles: ["https://drive.google.com/portfolio1.pdf"],
      rating: 4.9,
      verifiedAt: new Date("2026-01-15"),
    },
  });

  const wp2 = await prisma.workerProfile.create({
    data: {
      userId: worker2.id,
      bio: "Lulusan Teknik Informatika ITB. Spesialisasi di graph theory, algorithmic problem solving, dan technical writing. Pengalaman 3 tahun sebagai asisten dosen.",
      skills: ["Algoritma", "Matematika", "Technical Writing", "Penulisan Akademik", "Python"],
      kycStatus: "APPROVED",
      university: "Institut Teknologi Bandung",
      major: "Teknik Informatika",
      educationLevel: "S1",
      graduationYear: 2025,
      cvUrl: "https://drive.google.com/cv-siti.pdf",
      portfolioUrl: "https://linkedin.com/in/sitinurhaliza",
      portfolioFiles: [],
      rating: 5.0,
      verifiedAt: new Date("2026-02-01"),
    },
  });

  const wp3 = await prisma.workerProfile.create({
    data: {
      userId: worker3.id,
      bio: "Mahasiswa S2 Ilmu Komputer UGM. Fokus riset di bidang machine learning dan computer vision. Siap membantu tugas programming dan riset.",
      skills: ["Machine Learning", "Data Science", "Python", "Programming", "Penulisan Akademik"],
      kycStatus: "APPROVED",
      university: "Universitas Gadjah Mada",
      major: "Ilmu Komputer",
      educationLevel: "S2",
      cvUrl: "https://drive.google.com/cv-budi.pdf",
      portfolioUrl: "https://github.com/budisantoso",
      portfolioFiles: ["https://drive.google.com/thesis-proposal.pdf"],
      rating: 4.7,
      verifiedAt: new Date("2026-03-10"),
    },
  });

  const wp4 = await prisma.workerProfile.create({
    data: {
      userId: worker4.id,
      bio: "Pengajar programming di Binus. Berpengalaman mengajar mahasiswa dan memberikan solusi dengan pendekatan edukatif.",
      skills: ["Web Development", "UI/UX Design", "React", "Next.js", "Desain Grafis"],
      kycStatus: "PENDING",
      university: "Universitas Bina Nusantara",
      major: "Sistem Informasi",
      educationLevel: "S1",
      graduationYear: 2024,
      cvUrl: "https://drive.google.com/cv-diana.pdf",
      portfolioUrl: "https://dribbble.com/dianakusuma",
      portfolioFiles: ["https://drive.google.com/portfolio-diana.pdf"],
      rating: 0,
    },
  });

  const wp5 = await prisma.workerProfile.create({
    data: {
      userId: worker5.id,
      bio: "Mahasiswa Fisika UNPAD semester 6. Siap membantu tugas fisika, matematika, dan laporan praktikum.",
      skills: ["Fisika", "Matematika", "Microsoft Office", "Data Entry"],
      kycStatus: "REJECTED",
      university: "Universitas Padjadjaran",
      major: "Fisika",
      educationLevel: "S1",
      cvUrl: "https://drive.google.com/cv-rizky.pdf",
      rating: 0,
      rejectionNote: "CV belum lengkap. Mohon upload CV dalam format PDF yang mencantumkan pengalaman dan keahlian secara detail. Juga tambahkan link portfolio.",
    },
  });

  console.log("✅ Created 5 worker profiles (3 APPROVED, 1 PENDING, 1 REJECTED)");

  // ==================== TASKS ====================
  const task1 = await prisma.task.create({
    data: {
      clientId: client1.id,
      title: "Tugas Algoritma & Struktur Data — Implementasi Graph BFS/DFS",
      category: "Programming",
      description: "Butuh bantuan implementasi algoritma BFS dan DFS menggunakan Python.\n\nRequirement:\n- Implementasi BFS dan DFS\n- Bahasa Python 3.x\n- Visualisasi output\n- Laporan PDF min 5 halaman\n- Source code well-documented",
      deadline: new Date("2026-06-20"),
      budget: 200000,
      status: "OPEN",
    },
  });

  const task2 = await prisma.task.create({
    data: {
      clientId: client1.id,
      title: "Makalah Ekonomi Makro — Analisis Kebijakan Fiskal Indonesia 2026",
      category: "Penulisan Akademik",
      description: "Butuh makalah tentang analisis kebijakan fiskal Indonesia tahun 2026.\n\nFormat:\n- Min 15 halaman (tidak termasuk daftar pustaka)\n- APA Style 7th Edition\n- Min 10 referensi jurnal\n- Bahasa Indonesia",
      deadline: new Date("2026-06-15"),
      budget: 150000,
      status: "IN_PROGRESS",
    },
  });

  const task3 = await prisma.task.create({
    data: {
      clientId: client2.id,
      title: "Desain UI/UX E-Commerce App — Figma High Fidelity",
      category: "UI/UX Design",
      description: "Butuh desain UI/UX untuk aplikasi e-commerce fashion.\n\n- 15+ screen (Home, Product, Cart, Checkout, Profile, dll)\n- High fidelity di Figma\n- Design system & component library\n- Dark mode & light mode\n- Prototype interaktif",
      deadline: new Date("2026-06-25"),
      budget: 350000,
      status: "OPEN",
    },
  });

  const task4 = await prisma.task.create({
    data: {
      clientId: client2.id,
      title: "Website Portfolio Personal — Next.js + Tailwind CSS",
      category: "Web Development",
      description: "Butuh website portfolio personal modern.\n\n- Next.js 15 + Tailwind CSS\n- Responsive\n- Animasi smooth (framer-motion)\n- Blog section (MDX)\n- Contact form\n- Dark mode",
      deadline: new Date("2026-06-30"),
      budget: 400000,
      status: "IN_PROGRESS",
    },
  });

  const task5 = await prisma.task.create({
    data: {
      clientId: client1.id,
      title: "Laporan Praktikum Fisika — Gerak Parabola & Analisis Data",
      category: "Sains",
      description: "Butuh bantuan menyelesaikan laporan praktikum fisika tentang gerak parabola.\n\n- Analisis data eksperimen\n- Grafik menggunakan Python (matplotlib)\n- Pembahasan error analysis\n- Format laporan sesuai template kampus",
      deadline: new Date("2026-06-12"),
      budget: 85000,
      status: "IN_REVIEW",
    },
  });

  const task6 = await prisma.task.create({
    data: {
      clientId: client2.id,
      title: "Skripsi Bab 4 & 5 — Analisis Data Kuantitatif SPSS",
      category: "Penulisan Akademik",
      description: "Bantuan penulisan Bab 4 (Hasil) dan Bab 5 (Pembahasan) skripsi.\n\n- Analisis data kuantitatif menggunakan SPSS\n- Uji validitas & reliabilitas\n- Uji hipotesis (regresi linear berganda)\n- Interpretasi hasil\n- Min 30 halaman gabungan",
      deadline: new Date("2026-07-01"),
      budget: 500000,
      status: "COMPLETED",
    },
  });

  const task7 = await prisma.task.create({
    data: {
      clientId: client1.id,
      title: "Presentasi PowerPoint — Manajemen Strategi",
      category: "Presentasi",
      description: "Butuh PPT profesional untuk presentasi mata kuliah Manajemen Strategi.\n\n- 25-30 slide\n- Desain modern & minimalis\n- Infografis & chart\n- Speaker notes\n- Animasi transisi",
      deadline: new Date("2026-06-18"),
      budget: 120000,
      status: "OPEN",
    },
  });

  console.log("✅ Created 7 tasks");

  // ==================== BIDS ====================
  const bid1 = await prisma.bid.create({
    data: {
      taskId: task1.id,
      workerId: worker1.id,
      amount: 180000,
      coverLetter: "Saya berpengalaman di bidang algoritma dan sudah sering mengerjakan tugas sejenis. Saya bisa selesaikan dalam 2 hari dengan kualitas terjamin.",
      estimatedDays: 2,
      status: "PENDING",
    },
  });

  const bid2 = await prisma.bid.create({
    data: {
      taskId: task1.id,
      workerId: worker2.id,
      amount: 200000,
      coverLetter: "Lulusan TI ITB. Spesialisasi di graph theory dan algorithmic problem solving. Bisa express 1 hari.",
      estimatedDays: 1,
      status: "PENDING",
    },
  });

  const bid3 = await prisma.bid.create({
    data: {
      taskId: task1.id,
      workerId: worker3.id,
      amount: 150000,
      coverLetter: "Mahasiswa S2 Ilmu Komputer. Saya siap mengerjakan tugas ini dengan harga lebih terjangkau. Termasuk penjelasan detail di laporan.",
      estimatedDays: 3,
      status: "PENDING",
    },
  });

  // Task 2 — accepted bid
  const bid4 = await prisma.bid.create({
    data: {
      taskId: task2.id,
      workerId: worker2.id,
      amount: 140000,
      coverLetter: "Saya berpengalaman menulis paper akademik dan makalah. Pernah publish di jurnal nasional. Bisa selesai 3 hari.",
      estimatedDays: 3,
      status: "ACCEPTED",
    },
  });

  const bid5 = await prisma.bid.create({
    data: {
      taskId: task2.id,
      workerId: worker1.id,
      amount: 130000,
      coverLetter: "Saya juga bisa menulis makalah. Harga lebih terjangkau.",
      estimatedDays: 4,
      status: "REJECTED",
    },
  });

  // Task 3
  const bid6 = await prisma.bid.create({
    data: {
      taskId: task3.id,
      workerId: worker1.id,
      amount: 300000,
      coverLetter: "Saya menguasai Figma dan UI/UX design. Portfolio saya bisa dilihat di Dribbble.",
      estimatedDays: 5,
      status: "PENDING",
    },
  });

  // Task 4 — accepted bid
  const bid7 = await prisma.bid.create({
    data: {
      taskId: task4.id,
      workerId: worker1.id,
      amount: 380000,
      coverLetter: "Expert di Next.js dan Tailwind. Portfolio web saya sendiri sudah pakai tech stack ini. Bisa selesai 5 hari.",
      estimatedDays: 5,
      status: "ACCEPTED",
    },
  });

  // Task 5 — accepted bid
  const bid8 = await prisma.bid.create({
    data: {
      taskId: task5.id,
      workerId: worker3.id,
      amount: 75000,
      coverLetter: "Background Fisika S2. Analisis data dan matplotlib adalah keahlian saya.",
      estimatedDays: 2,
      status: "ACCEPTED",
    },
  });

  // Task 6 — accepted bid (completed)
  const bid9 = await prisma.bid.create({
    data: {
      taskId: task6.id,
      workerId: worker2.id,
      amount: 480000,
      coverLetter: "Saya bisa bantu analisis SPSS dan penulisan skripsi. Sudah banyak pengalaman bantu mahasiswa S1.",
      estimatedDays: 7,
      status: "ACCEPTED",
    },
  });

  // Task 7
  const bid10 = await prisma.bid.create({
    data: {
      taskId: task7.id,
      workerId: worker3.id,
      amount: 100000,
      coverLetter: "Saya bisa buat PPT profesional dengan desain modern. Sudah sering buat presentasi untuk klien.",
      estimatedDays: 2,
      status: "PENDING",
    },
  });

  console.log("✅ Created 10 bids");

  // ==================== ORDERS ====================
  const order1 = await prisma.order.create({
    data: {
      taskId: task2.id,
      bidId: bid4.id,
      clientId: client1.id,
      workerId: worker2.id,
      amount: 140000,
      platformFee: 14000,
      status: "ESCROW_HOLD",
    },
  });

  const order2 = await prisma.order.create({
    data: {
      taskId: task4.id,
      bidId: bid7.id,
      clientId: client2.id,
      workerId: worker1.id,
      amount: 380000,
      platformFee: 38000,
      status: "ESCROW_HOLD",
    },
  });

  const order3 = await prisma.order.create({
    data: {
      taskId: task5.id,
      bidId: bid8.id,
      clientId: client1.id,
      workerId: worker3.id,
      amount: 75000,
      platformFee: 7500,
      status: "ESCROW_HOLD",
    },
  });

  const order4 = await prisma.order.create({
    data: {
      taskId: task6.id,
      bidId: bid9.id,
      clientId: client2.id,
      workerId: worker2.id,
      amount: 480000,
      platformFee: 48000,
      status: "RELEASED",
    },
  });

  console.log("✅ Created 4 orders");

  // ==================== MESSAGES ====================
  await prisma.message.createMany({
    data: [
      { taskId: task2.id, senderId: client1.id, content: "Halo Siti, bisa mulai kapan ya?" },
      { taskId: task2.id, senderId: worker2.id, content: "Halo Kak Andi! Saya bisa mulai besok pagi. Nanti saya kirim outline dulu ya." },
      { taskId: task2.id, senderId: client1.id, content: "Oke siap, ditunggu outline-nya." },
      { taskId: task2.id, senderId: worker2.id, content: "Ini outline-nya sudah saya buat. Silakan dicek dan kasih feedback ya 🙏", attachment: "https://drive.google.com/outline-makalah.pdf" },
      { taskId: task4.id, senderId: client2.id, content: "Halo Ahmad, ada referensi website yang saya suka: https://brittanychiang.com" },
      { taskId: task4.id, senderId: worker1.id, content: "Noted Kak Dewi! Saya sudah lihat, bagus designnya. Saya pakai sebagai inspirasi ya." },
      { taskId: task4.id, senderId: worker1.id, content: "Progress update: header dan hero section sudah selesai. Besok lanjut ke about dan projects section." },
      { taskId: task5.id, senderId: worker3.id, content: "Kak, data eksperimennya bisa dikirim? Saya butuh raw data-nya untuk analisis." },
      { taskId: task5.id, senderId: client1.id, content: "Ini datanya ya", attachment: "https://drive.google.com/data-fisika.xlsx" },
      { taskId: task5.id, senderId: worker3.id, content: "Sudah selesai, saya submit hasilnya untuk review. Mohon dicek 🙏" },
      { taskId: task6.id, senderId: worker2.id, content: "Bab 4 dan 5 sudah selesai. Semua uji SPSS sudah dijalankan. Silakan review ya Kak!" },
      { taskId: task6.id, senderId: client2.id, content: "Terima kasih Siti! Hasilnya sangat memuaskan. Saya approve ya 🎉" },
    ],
  });

  console.log("✅ Created 12 messages");

  // ==================== REVIEW (for completed task) ====================
  await prisma.review.create({
    data: {
      taskId: task6.id,
      reviewerId: client2.id,
      revieweeId: worker2.id,
      rating: 5,
      comment: "Hasil kerja sangat memuaskan! Analisis SPSS detail dan penulisan rapi. Rekomendasi banget! ⭐⭐⭐⭐⭐",
    },
  });

  console.log("✅ Created 1 review");

  // ==================== DISPUTE (example) ====================
  // Creating a disputed task
  const task8 = await prisma.task.create({
    data: {
      clientId: client1.id,
      title: "Tugas Machine Learning — Klasifikasi Gambar CNN",
      category: "Programming",
      description: "Implementasi CNN untuk klasifikasi gambar menggunakan TensorFlow/Keras.",
      deadline: new Date("2026-06-10"),
      budget: 250000,
      status: "IN_DISPUTE",
    },
  });

  const bid11 = await prisma.bid.create({
    data: {
      taskId: task8.id,
      workerId: worker3.id,
      amount: 230000,
      coverLetter: "ML adalah spesialisasi saya.",
      estimatedDays: 4,
      status: "ACCEPTED",
    },
  });

  const order5 = await prisma.order.create({
    data: {
      taskId: task8.id,
      bidId: bid11.id,
      clientId: client1.id,
      workerId: worker3.id,
      amount: 230000,
      platformFee: 23000,
      status: "ESCROW_HOLD",
    },
  });

  await prisma.dispute.create({
    data: {
      taskId: task8.id,
      reporterId: client1.id,
      reason: "Hasil yang dikirim tidak sesuai dengan requirement. Model CNN hanya mencapai akurasi 40%, padahal di requirement minimal 80%. Source code juga tidak ada komentar.",
      status: "OPEN",
    },
  });

  console.log("✅ Created 1 dispute");

  console.log("\n🎉 Seeding complete! Summary:");
  console.log("   👤 8 users (1 admin, 2 clients, 5 workers)");
  console.log("   📋 5 worker profiles (3 approved, 1 pending, 1 rejected)");
  console.log("   📝 8 tasks");
  console.log("   💰 11 bids");
  console.log("   📦 5 orders");
  console.log("   💬 12 messages");
  console.log("   ⭐ 1 review");
  console.log("   ⚠️  1 dispute");
  console.log("\n📧 Login credentials (all same password: password123):");
  console.log("   Admin:  admin@jokipro.id");
  console.log("   Client: andi@worker.id / dewi@worker.id");
  console.log("   Worker: ahmad@worker.id / siti@worker.id / budi@worker.id");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
