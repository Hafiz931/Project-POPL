// Utility functions for task management

/**
 * Menghasilkan ID unik untuk tugas baru.
 * @returns {string} ID unik
 */
export const generateId = () => {
  // Menggabungkan timestamp dan bilangan acak, lalu mengambil 10 karakter setelah '0.'
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Memformat objek Date menjadi string tanggal dan waktu yang mudah dibaca.
 * @param {Date | string} date Objek tanggal atau string tanggal yang dapat diparse
 * @returns {string} Tanggal yang diformat
 */
export const formatDate = (date) => {
  if (!date) return ""; // Tambahkan penanganan jika date null
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Memeriksa apakah suatu tugas sudah lewat tanggal jatuh temponya.
 * @param {string | null} dueDate String tanggal jatuh tempo
 * @returns {boolean} True jika sudah lewat jatuh tempo dan belum selesai
 */
export const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  // Membandingkan waktu jatuh tempo dengan waktu saat ini
  return new Date(dueDate) < new Date();
};

/**
 * Mengembalikan objek styling dan label berdasarkan prioritas.
 * @param {string} priority Prioritas ('low', 'medium', 'high')
 * @returns {{color: string, label: string}} Objek styling
 */
export const getTaskPriority = (priority) => {
  const priorities = {
    low: { color: "bg-green-100 text-green-800", label: "Low" },
    medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
    high: { color: "bg-red-100 text-red-800", label: "High" },
  };
  // Jika prioritas tidak valid, kembalikan prioritas medium sebagai default
  return priorities[priority] || priorities.medium;
};

/**
 * Memfilter daftar tugas berdasarkan kriteria yang diberikan.
 * @param {Array<Object>} tasks Daftar tugas
 * @param {string} filter Kriteria filter ('completed', 'pending', 'overdue')
 * @returns {Array<Object>} Daftar tugas yang sudah difilter
 */
export const filterTasks = (tasks, filter) => {
  switch (filter) {
    case "completed":
      return tasks.filter((task) => task.completed);
    case "pending":
      // Tugas pending adalah yang belum selesai (termasuk yang overdue)
      return tasks.filter((task) => !task.completed);
    case "overdue":
      // Tugas overdue adalah yang belum selesai DAN sudah overdue
      return tasks.filter(
        (task) => !task.completed && isTaskOverdue(task.dueDate)
      );
    case "all":
      return tasks;
    default:
      // Asumsi filter adalah ID Tag
      return tasks.filter((task) => task.tags && task.tags.includes(filter));
  }
};

/**
 * Menyortir daftar tugas berdasarkan kriteria.
 * @param {Array<Object>} tasks Daftar tugas
 * @param {string} sortBy Kriteria sorting ('dueDate', 'priority', 'name', 'createdAt')
 * @returns {Array<Object>} Daftar tugas yang sudah disortir
 */
export const sortTasks = (tasks, sortBy) => {
  // Buat salinan array untuk menghindari mutasi state React
  const sortedTasks = [...tasks];

  switch (sortBy) {
    case "dueDate":
      return sortedTasks.sort((a, b) => {
        // Pindahkan tugas tanpa due date ke akhir
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        // Sortir berdasarkan tanggal terdekat (paling awal)
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

    case "priority": {
      // <--- PERBAIKAN: Menggunakan block scope untuk deklarasi const
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sortedTasks.sort(
        (a, b) =>
          // Urutan menurun: high (3) dulu, lalu medium (2), lalu low (1)
          priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    } // <--- END block scope

    case "name":
      // Sortir berdasarkan abjad judul (a.title)
      return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));

    default: // case 'createdAt' (Default)
      // Sortir berdasarkan tanggal dibuat terbaru (Urutan menurun: Terbaru dulu)
      return sortedTasks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
};
