import { useState } from "react"; // Impor useState

// Terima onUpdate sebagai props
function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  // State untuk mengontrol mode edit
  const [isEditing, setIsEditing] = useState(false);
  // State untuk menyimpan data yang sedang diedit
  const [editData, setEditData] = useState({
    text: task.text,
    startTime: task.startTime,
    endTime: task.endTime
  });

  const handleUpdate = () => {
    if (editData.text.trim() === "" || !editData.startTime || !editData.endTime) {
      alert("Harap isi semua kolom.");
      return;
    }
    // Kirim ID dan data baru ke App.jsx
    onUpdate(task.id, editData);
    // Keluar dari mode edit
    setIsEditing(false);
  };

  // Fungsi untuk menangani perubahan pada input form edit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // --- Tampilan saat mode edit aktif ---
  if (isEditing) {
    return (
      <li style={{ padding: "15px", border: "1px solid #646cff", borderRadius: "8px", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" name="text" value={editData.text} onChange={handleInputChange} style={{ padding: "8px", backgroundColor: "#333", color: "white", border: "1px solid #555" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="datetime-local" name="startTime" value={editData.startTime} onChange={handleInputChange} style={{ flex: 1, padding: "8px", backgroundColor: "#333", color: "white", border: "1px solid #555" }}/>
          <input type="datetime-local" name="endTime" value={editData.endTime} onChange={handleInputChange} style={{ flex: 1, padding: "8px", backgroundColor: "#333", color: "white", border: "1px solid #555" }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={() => setIsEditing(false)} style={{ padding: "5px 10px", border: "1px solid #888", background: "transparent", color: "#888" }}>Batal</button>
          <button onClick={handleUpdate} style={{ padding: "5px 10px", border: "none", background: "#2ecc71", color: "white" }}>Simpan</button>
        </div>
      </li>
    );
  }

  // --- Tampilan normal ---
  const formattingOptions = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedStartTime = new Date(task.startTime).toLocaleString("id-ID", formattingOptions);
  const formattedEndTime = new Date(task.endTime).toLocaleString("id-ID", formattingOptions);
  const isOverdue = new Date(task.endTime) < new Date() && !task.done;

  return (
    <li style={{ marginBottom: "12px", padding: "15px", border: `1px solid ${isOverdue ? '#e53e3e' : '#444'}`, borderRadius: "8px" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <input type="checkbox" checked={task.done} onChange={onToggle} style={{ marginRight: '15px', cursor: 'pointer', width: '20px', height: '20px' }} />
          <span style={{ textDecoration: task.done ? "line-through" : "none", fontSize: "1.2rem", fontWeight: "bold", color: task.done ? '#888' : 'white', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
            {task.text}
          </span>
        </div>
        <div style={{ display: "flex", gap: "5px", marginLeft: "10px" }}>
          {/* TOMBOL EDIT WARNA KUNING */}
          <button onClick={() => setIsEditing(true)} style={{ padding: "5px 10px", background: "#f1c40f", color: "black", border: "none", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
          <button onClick={onDelete} style={{ padding: "5px 10px", background: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Hapus</button>
        </div>
      </div>
      <div style={{ fontSize: "0.9em", color: "#aaa" }}>
        <span>Mulai: {formattedStartTime}</span> | <span>Selesai: {formattedEndTime}</span>
      </div>
    </li>
  );
}

export default TaskItem;