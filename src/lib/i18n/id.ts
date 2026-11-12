export const id = {
  actions: {
    addToQueue: "Tambahkan ke antrean",
    addToPlaylist: "Tambahkan ke playlist",
    retry: "Coba lagi",
    showError: "Tampilkan error",
    startListening: "Mulai dengar",
  },
  design: {
    eyebrow: "Onyxify design system",
    title: "Komponen dasar",
    description:
      "Katalog token, primitive, dan state reusable untuk pengalaman streaming musik.",
    buttons: "Buttons",
    forms: "Input & slider",
    cards: "Cards",
    tracks: "Track rows",
    loading: "Loading",
    empty: "Empty",
    error: "Error",
    searchPlaceholder: "Cari musik, artis, atau album",
    secondary: "Sekunder",
    outline: "Outline",
    ghost: "Ghost",
    showError: "Tampilkan error",
  },
  states: {
    emptyTitle: "Belum ada lagu",
    emptyDescription: "Musik yang kamu simpan akan muncul di sini.",
    errorTitle: "Gagal memuat",
    errorDescription: "Terjadi masalah saat memuat data.",
  },
} as const;
