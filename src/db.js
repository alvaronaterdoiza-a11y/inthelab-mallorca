const SUPABASE_URL = "https://txlbrwvxfsbokedrcmij.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4bGJyd3Z4ZnNib2tlZHJjbWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjA1NjgsImV4cCI6MjA5ODM5NjU2OH0.TGLC19f8-Z5VYbwtioJA4apXvwOCmLQ7ZU8ny3koUm4";

const BASE = `${SUPABASE_URL}/rest/v1`;

const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}
async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}
async function patchReq(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed`);
  return res.json();
}
async function del(path) {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(`DELETE ${path} failed`);
}

// ---------- Students ----------

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
    purchases: row.purchases || [],
    studentType: row.student_type || "grupal",
    groupNumber: row.group_number ?? null,
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
    purchases: s.purchases || [],
    student_type: s.studentType || "grupal",
    group_number: s.groupNumber ?? null,
  };
}

export async function fetchStudents() {
  const rows = await get("/students?select=*");
  return rows.map(rowToStudent);
}

export async function insertStudent(student) {
  const rows = await post("/students", studentToRow(student));
  return rowToStudent(rows[0]);
}

export async function updateStudentRow(id, patchObj) {
  const partialRow = {};
  if ("name" in patchObj) partialRow.name = patchObj.name;
  if ("surname" in patchObj) partialRow.surname = patchObj.surname;
  if ("dni" in patchObj) partialRow.dni = patchObj.dni || null;
  if ("bonoType" in patchObj) partialRow.bono_type = patchObj.bonoType;
  if ("local" in patchObj) partialRow.local = patchObj.local;
  if ("sueltasBought" in patchObj) partialRow.sueltas_bought = patchObj.sueltasBought ?? null;
  if ("paid" in patchObj) partialRow.paid = patchObj.paid;
  if ("attendance" in patchObj) partialRow.attendance = patchObj.attendance;
  if ("purchases" in patchObj) partialRow.purchases = patchObj.purchases;
  if ("studentType" in patchObj) partialRow.student_type = patchObj.studentType;
  if ("groupNumber" in patchObj) partialRow.group_number = patchObj.groupNumber;

  const rows = await patchReq(`/students?id=eq.${encodeURIComponent(id)}`, partialRow);
  return rowToStudent(rows[0]);
}

export async function deleteStudentRow(id) {
  await del(`/students?id=eq.${encodeURIComponent(id)}`);
}

// ---------- Open dates (grupal) ----------

export async function fetchOpenDates() {
  const rows = await get("/open_dates?select=*");
  const map = {};
  rows.forEach((r) => {
    map[r.date] = r.opened;
  });
  return map;
}

export async function upsertOpenDate(date, opened) {
  const res = await fetch(`${BASE}/open_dates`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ date, opened }),
  });
  if (!res.ok) throw new Error("upsert open_date failed");
  return res.json();
}

// ---------- Group signups ----------

export async function fetchGroupSignups() {
  const rows = await get("/group_signups?select=*");
  return rows.map((r) => ({ id: r.id, studentId: r.student_id, date: r.date, createdAt: r.created_at }));
}

export async function insertGroupSignup(signup) {
  const rows = await post("/group_signups", {
    id: signup.id,
    student_id: signup.studentId,
    date: signup.date,
  });
  return rows[0];
}

export async function deleteGroupSignup(id) {
  await del(`/group_signups?id=eq.${encodeURIComponent(id)}`);
}

export async function deleteGroupSignupsForStudentDate(studentId, date) {
  await del(`/group_signups?student_id=eq.${encodeURIComponent(studentId)}&date=eq.${encodeURIComponent(date)}`);
}

// ---------- Individual availability ----------

export async function fetchIndividualAvailability() {
  const rows = await get("/individual_availability?select=*");
  const map = {};
  rows.forEach((r) => {
    map[r.date] = { startHour: r.start_hour, endHour: r.end_hour };
  });
  return map;
}

export async function upsertIndividualAvailability(date, startHour, endHour) {
  const res = await fetch(`${BASE}/individual_availability`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ date, start_hour: startHour, end_hour: endHour }),
  });
  if (!res.ok) throw new Error("upsert availability failed");
  return res.json();
}

// ---------- Individual bookings ----------

export async function fetchIndividualBookings() {
  const rows = await get("/individual_bookings?select=*");
  return rows.map((r) => ({
    id: r.id,
    studentId: r.student_id,
    date: r.date,
    hour: r.hour,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function insertIndividualBooking(booking) {
  const rows = await post("/individual_bookings", {
    id: booking.id,
    student_id: booking.studentId,
    date: booking.date,
    hour: booking.hour,
    status: booking.status || "pending",
  });
  return rows[0];
}

export async function updateIndividualBooking(id, patchObj) {
  const partialRow = {};
  if ("status" in patchObj) partialRow.status = patchObj.status;
  if ("date" in patchObj) partialRow.date = patchObj.date;
  if ("hour" in patchObj) partialRow.hour = patchObj.hour;
  const rows = await patchReq(`/individual_bookings?id=eq.${encodeURIComponent(id)}`, partialRow);
  return rows[0];
}

export async function deleteIndividualBooking(id) {
  await del(`/individual_bookings?id=eq.${encodeURIComponent(id)}`);
}
