import { useState } from "react";

function TaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "" || startTime === "" || endTime === "") {
      alert("Harap isi semua kolom: kegiatan, waktu mulai, dan waktu selesai.");
      return;
    }
    onAdd({ text, startTime, endTime });
    setText("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tambah kegiatan..."
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #555", backgroundColor: "#333", color: "white" }}
      />
      <div style={{ textAlign: 'left' }}>
        <label style={{ fontSize: '0.9em', color: '#ccc', display: 'block', marginBottom: '5px' }}>Mulai:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #555", boxSizing: 'border-box', backgroundColor: "#333", color: "white" }}
        />
      </div>
      <div style={{ textAlign: 'left' }}>
        <label style={{ fontSize: '0.9em', color: '#ccc', display: 'block', marginBottom: '5px' }}>Selesai:</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #555", boxSizing: 'border-box', backgroundColor: "#333", color: "white" }}
        />
      </div>
      <button type="submit" style={{ padding: "12px 15px", borderRadius: "5px", border: "none", backgroundColor: "#646cff", color: "white", cursor: "pointer", fontSize: "1em" }}>
        Tambah
      </button>
    </form>
  );
}

export default TaskForm;