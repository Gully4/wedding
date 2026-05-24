import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ROAD_RESPONSES: Record<string, string[]> = {
  tol: [
    "Berdasarkan info terkini, Tol Jagorawi arah Bogor terpantau padat merayap di KM 10-15 akibat volume kendaraan tinggi.",
    "Tol Jakarta-Cikampek mengalami kepadatan di ruas dalam kota arah Bekasi. Estimasi delay 20-30 menit.",
    "Kondisi Tol Dalam Kota umumnya lancar pagi ini. Puncak kemacetan biasanya pukul 07.00-09.00 WIB.",
  ],
  macet: [
    "Kemacetan terparah hari ini terpantau di Jl. Sudirman-Thamrin (Jakarta), Jl. Gatot Subroto, dan akses tol dalam kota.",
    "Kemacetan di area CBD Jakarta cukup padat. Disarankan menghindari Jl. HR Rasuna Said antara pukul 07.00-09.00.",
    "Titik macet utama: Semanggi, Slipi, dan Grogol. Pertimbangkan rute alternatif melalui Jl. Kyai Tapa.",
  ],
  alternatif: [
    "Rute alternatif yang disarankan: Gunakan Jl. Casablanca – MT Haryono untuk menghindari kemacetan Sudirman.",
    "Untuk menghindari Tol Jagorawi: bisa lewat Jl. Raya Bogor via Cibubur, estimasi waktu lebih lama 15 menit tapi lebih lancar.",
    "Alternatif Tol dalam Kota: Jl. Pramuka – Jl. Ahmad Yani – Jl. DI Panjaitan bisa jadi pilihan yang lebih lancar.",
  ],
  hujan: [
    "Cuaca hujan dapat mempengaruhi kondisi jalan. Harap waspada genangan di Jl. Gunung Sahari dan kawasan Pluit.",
    "Saat hujan deras, beberapa titik rawan banjir: Underpass Kemayoran, Jl. RE Martadinata, dan kawasan Kelapa Gading.",
    "Hati-hati berkendara saat hujan. Jarak pengereman meningkat, kurangi kecepatan dan nyalakan lampu kendaraan.",
  ],
  jakarta: [
    "Kondisi lalu lintas Jakarta hari ini: Jl. Sudirman-Thamrin padat, akses tol dalam kota normal, jalan arteri lancar.",
    "Jakarta saat ini mengalami kepadatan di ring road dan jalan utama. Volume kendaraan lebih tinggi dari biasanya.",
    "Info Jakarta: sistem ganjil-genap berlaku di beberapa ruas utama. Pastikan nomor kendaraan Anda sesuai hari ini.",
  ],
  parkir: [
    "Informasi parkir: Pusat kota Jakarta umumnya penuh pada jam kerja. Disarankan menggunakan transportasi umum.",
    "Area parkir tersedia di berbagai mall dan gedung perkantoran. Tarif bervariasi Rp 5.000-15.000 per jam.",
    "Untuk parkir di pusat kota, pertimbangkan Park & Ride di stasiun MRT atau TransJakarta.",
  ],
  default: [
    "Terima kasih atas pertanyaan Anda tentang lalu lintas! Saya dapat membantu informasi tentang: kondisi jalan, kemacetan, rute alternatif, dan cuaca di jalan.",
    "Maaf, saya tidak memiliki info spesifik untuk pertanyaan itu. Coba tanyakan tentang kondisi tol, kemacetan Jakarta, atau rute alternatif!",
    "Untuk informasi lalu lintas real-time yang lebih akurat, Anda juga bisa cek aplikasi Waze atau Google Maps.",
  ],
};

function getBotReply(message: string): string {
  const lower = message.toLowerCase();
  let category = "default";

  if (lower.includes("tol") || lower.includes("toll") || lower.includes("highway")) {
    category = "tol";
  } else if (
    lower.includes("macet") || lower.includes("kemacetan") ||
    lower.includes("padat") || lower.includes("stop") || lower.includes("stuck")
  ) {
    category = "macet";
  } else if (
    lower.includes("alternatif") || lower.includes("rute") ||
    lower.includes("jalan lain") || lower.includes("bypass")
  ) {
    category = "alternatif";
  } else if (
    lower.includes("hujan") || lower.includes("banjir") ||
    lower.includes("genang") || lower.includes("cuaca")
  ) {
    category = "hujan";
  } else if (
    lower.includes("jakarta") || lower.includes("jkt") ||
    lower.includes("ganjil") || lower.includes("genap")
  ) {
    category = "jakarta";
  } else if (
    lower.includes("parkir") || lower.includes("park") ||
    (lower.includes("tempat") && lower.includes("mobil"))
  ) {
    category = "parkir";
  }

  const responses = ROAD_RESPONSES[category];
  return responses[Math.floor(Math.random() * responses.length)];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));

    const reply = getBotReply(message);

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal server error", reply: "Maaf, terjadi kesalahan. Silakan coba lagi." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
