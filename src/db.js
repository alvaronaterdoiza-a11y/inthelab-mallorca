const SUPABASE_URL = "https://txlbrwvxfsbokedrcmij.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bGJyd3Z4ZnNib2tlZHJjbWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjA1NjgsImV4cCI6MjA5ODM5NjU2OH0.TGLC19f8-Z5VYbwtioJA4apXvwOCmLQ7ZU8ny3koUm4";

const REST_URL = `${SUPABASE_URL}/rest/v1/students`;

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

// Convert DB row (snake_case) <-> app student object (camelCase)
function rowToStudent(row) {
  return {
    id: row.id,
    name: row.name,
    surname: row.surname,
    dni: row.dni || "",
    bonoType: row.bono_type,
    local: row.local,
    sueltasBought: row.sueltas_bought ?? undefined,
    paid: row.paid,
    attendance: row.attendance || [],
  };
}

function studentToRow(s) {
  return {
    id: s.id,
    name: s.name,
    surname: s.surname,
    dni: s.dni || null,
    bono_type: s.bonoType,
    local: s.local,
    sueltas_bought: s.sueltasBought ?? null,
    paid: s.paid,
    attendance: s.attendance || [],
  };
}

export async function fetchStudents() {
  const res = await fetch(`${REST_URL}?select=*`, { headers });
  if (!res.ok) throw new Error("Error al cargar alumnos");
  const rows = await res.json();
  return rows.map(rowToStudent);
}

export async function insertStudent(student) {
  const res = await fetch(REST_URL, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(studentToRow(student)),
  });
  if (!res.ok) throw new Error("Error al crear alumno");
  const rows = await res.json();
  return rowToStudent(rows[0]);
}

export async function updateStudentRow(id, patch) {
  const partialRow = {};
  if ("name" in patch) partialRow.name = patch.name;
  if ("surname" in patch) partialRow.surname = patch.surname;
  if ("dni" in patch) partialRow.dni = patch.dni || null;
  if ("bonoType" in patch) partialRow.bono_type = patch.bonoType;
  if ("local" in patch) partialRow.local = patch.local;
  if ("sueltasBought" in patch) partialRow.sueltas_bought = patch.sueltasBought ?? null;
  if ("paid" in patch) partialRow.paid = patch.paid;
  if ("attendance" in patch) partialRow.attendance = patch.attendance;

  const res = await fetch(`${REST_URL}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(partialRow),
  });
  if (!res.ok) throw new Error("Error al actualizar alumno");
  const rows = await res.json();
  return rowToStudent(rows[0]);
}

export async function deleteStudentRow(id) {
  const res = await fetch(`${REST_URL}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Error al eliminar alumno");
}
