import React, { useState, useEffect, useMemo } from "react";
import { Search, Check, X, Lock, Unlock, User, Calendar, Euro, ChevronRight, ArrowLeft, Plus, Trash2, Globe } from "lucide-react";
import { fetchStudents, insertStudent, updateStudentRow, deleteStudentRow } from "./db.js";

const LOGO_DATA_URI = "data:image/jpeg;base64,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";

const SESSIONS = [
  "2026-07-01","2026-07-02","2026-07-07","2026-07-08","2026-07-09",
  "2026-07-14","2026-07-15","2026-07-16","2026-07-21","2026-07-22",
  "2026-07-23","2026-07-28","2026-07-29","2026-07-30",
  "2026-08-04","2026-08-05","2026-08-06","2026-08-11","2026-08-12","2026-08-13"
];

const BONO_INFO = {
  20: { sessions: 20, local: 115, foraster: 130 },
  10: { sessions: 10, local: 60, foraster: 70 },
  suelta: { sessions: null, local: 10, foraster: 10 },
};

const TEACHER_PASS = "inthelab2026";

const T = {
  ca: {
    title: "IN THE LAB MALLORCA",
    subtitle: "Tecnificació estiu 2026",
    studentTab: "Consultar el meu bo",
    teacherTab: "Accés entrenador",
    name: "Nom",
    surname: "Llinatges",
    dni: "DNI",
    search: "Cercar",
    notFound: "No s'ha trobat cap alumne amb aquest nom. Revisa el nom i els llinatges.",
    notFoundButSimilar: "No hem trobat una coincidència exacta. Volies dir algun d'aquests?",
    didYouMean: "Resultats semblants:",
    back: "Tornar",
    bonoType: "Tipus de bo",
    sessionsUsed: "Sessions fetes",
    sessionsLeft: "Sessions restants",
    of: "de",
    unlimited: "Sessions soltes",
    datesAttended: "Dates a les quals has assistit",
    noDates: "Encara no has assistit a cap sessió.",
    password: "Contrasenya",
    enter: "Entrar",
    wrongPass: "Contrasenya incorrecta.",
    logout: "Sortir",
    students: "Alumnes",
    attendance: "Passar llista",
    payments: "Pagaments",
    addStudent: "Afegir alumne",
    local: "Soci Sa Pobla Bàsquet",
    foraster: "No soci",
    save: "Desar",
    cancel: "Cancel·lar",
    searchStudent: "Cercar alumne...",
    selectDate: "Selecciona la data de la sessió",
    markAttended: "Marca els alumnes que han assistit avui",
    noSessionsLeft: "Sense sessions restants",
    paid: "Pagat",
    unpaid: "Pendent",
    price: "Preu",
    markPaid: "Marcar pagat",
    markUnpaid: "Marcar pendent",
    delete: "Eliminar",
    confirmDelete: "Segur que vols eliminar aquest alumne?",
    yes: "Sí",
    no: "No",
    totalStudents: "Alumnes totals",
    totalPaid: "Pagats",
    totalPending: "Pendents",
    noStudents: "Encara no hi ha alumnes registrats.",
    attendedToday: "Han assistit",
    sessionDate: "Data",
    type20: "Pack 20 sessions",
    type10: "Pack 10 sessions",
    typeSuelta: "Sessió solta",
    sueltasBought: "Sessions soltes comprades",
    add: "Afegir",
    location: "Pavelló Miquel Capó, Sa Pobla",
    workInSilence: "Treballa en silenci. Millora cada dia.",
  },
  es: {
    title: "IN THE LAB MALLORCA",
    subtitle: "Tecnificación verano 2026",
    studentTab: "Consultar mi bono",
    teacherTab: "Acceso entrenador",
    name: "Nombre",
    surname: "Apellidos",
    dni: "DNI",
    search: "Buscar",
    notFound: "No se ha encontrado ningún alumno con ese nombre. Revisa nombre y apellidos.",
    notFoundButSimilar: "No hemos encontrado una coincidencia exacta. ¿Querías decir alguno de estos?",
    didYouMean: "Resultados parecidos:",
    back: "Volver",
    bonoType: "Tipo de bono",
    sessionsUsed: "Sesiones hechas",
    sessionsLeft: "Sesiones restantes",
    of: "de",
    unlimited: "Sesiones sueltas",
    datesAttended: "Fechas a las que has asistido",
    noDates: "Todavía no has asistido a ninguna sesión.",
    password: "Contraseña",
    enter: "Entrar",
    wrongPass: "Contraseña incorrecta.",
    logout: "Salir",
    students: "Alumnos",
    attendance: "Pasar lista",
    payments: "Pagos",
    addStudent: "Añadir alumno",
    local: "Socio Sa Pobla Bàsquet",
    foraster: "No socio",
    save: "Guardar",
    cancel: "Cancelar",
    searchStudent: "Buscar alumno...",
    selectDate: "Selecciona la fecha de la sesión",
    markAttended: "Marca los alumnos que han asistido hoy",
    noSessionsLeft: "Sin sesiones restantes",
    paid: "Pagado",
    unpaid: "Pendiente",
    price: "Precio",
    markPaid: "Marcar pagado",
    markUnpaid: "Marcar pendiente",
    delete: "Eliminar",
    confirmDelete: "¿Seguro que quieres eliminar este alumno?",
    yes: "Sí",
    no: "No",
    totalStudents: "Alumnos totales",
    totalPaid: "Pagados",
    totalPending: "Pendientes",
    noStudents: "Todavía no hay alumnos registrados.",
    attendedToday: "Han asistido",
    sessionDate: "Fecha",
    type20: "Pack 20 sesiones",
    type10: "Pack 10 sesiones",
    typeSuelta: "Sesión suelta",
    sueltasBought: "Sesiones sueltas compradas",
    add: "Añadir",
    location: "Pabellón Miquel Capó, Sa Pobla",
    workInSilence: "Trabaja en silencio. Mejora cada día.",
  },
};

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarStudents(students, fullName, max = 3) {
  const q = normalize(fullName);
  return students
    .map((s) => {
      const full = normalize(`${s.name} ${s.surname}`);
      return { s, dist: levenshtein(q, full) };
    })
    .filter((x) => x.dist <= Math.max(3, Math.ceil(x.s ? 0 : 0) + 3))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, max)
    .map((x) => x.s);
}

function formatDate(iso, lang) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString(lang === "ca" ? "ca-ES" : "es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function bonoLabel(type, t) {
  if (type === "20") return t.type20;
  if (type === "10") return t.type10;
  return t.typeSuelta;
}

function bonoSessionsTotal(student) {
  if (student.bonoType === "20") return 20;
  if (student.bonoType === "10") return 10;
  return student.sueltasBought || 0;
}

function price(student) {
  const info = BONO_INFO[student.bonoType];
  return student.local ? info.local : info.foraster;
}

export default function App() {
  const [lang, setLang] = useState("ca");
  const [view, setView] = useState("home"); // home, student-search, student-detail, teacher-login, teacher
  const t = T[lang];

  const [students, setStudents] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  async function reload() {
    try {
      const data = await fetchStudents();
      setStudents(data);
      setLoadError("");
    } catch (e) {
      console.error("Load error", e);
      setLoadError("No s'ha pogut connectar amb la base de dades. / No se pudo conectar con la base de datos.");
      setStudents([]);
    }
    setLoaded(true);
  }

  useEffect(() => {
    reload();
  }, []);

  if (!loaded) {
    return (
      <div style={styles.loadingScreen}>
        <LogoMark size={72} />
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <style>{globalCss}</style>
      <Header lang={lang} setLang={setLang} t={t} view={view} setView={setView} />
      <div style={styles.content}>
        {loadError && <div style={styles.errorBox}>{loadError}</div>}
        {view === "home" && <Home t={t} setView={setView} />}
        {view === "student-search" && (
          <StudentSearch t={t} lang={lang} students={students} setView={setView} reload={reload} />
        )}
        {view === "teacher-login" && <TeacherLogin t={t} setView={setView} />}
        {view === "teacher" && (
          <TeacherPanel
            t={t}
            lang={lang}
            students={students}
            reload={reload}
            setView={setView}
          />
        )}
      </div>
    </div>
  );
}

function Header({ lang, setLang, t, view, setView }) {
  return (
    <div style={styles.header}>
      <div style={styles.headerInner}>
        <div style={styles.brandRow} onClick={() => setView("home")}>
          <LogoMark />
          <div>
            <div style={styles.brandTitle}>{t.title}</div>
            <div style={styles.brandSub}>{t.subtitle}</div>
          </div>
        </div>
        <button
          style={styles.langBtn}
          onClick={() => setLang(lang === "ca" ? "es" : "ca")}
          aria-label="Switch language"
        >
          <Globe size={14} style={{ marginRight: 6 }} />
          {lang === "ca" ? "ES" : "CA"}
        </button>
      </div>
      <div style={styles.headerStripe} />
    </div>
  );
}

function LogoMark({ size = 38 }) {
  return (
    <img
      src={LOGO_DATA_URI}
      alt="In The Lab Mallorca"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
        border: "2px solid #1a1a1a",
      }}
    />
  );
}

function Home({ t, setView }) {
  return (
    <div style={styles.homeWrap}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <LogoMark size={84} />
      </div>
      <h1 style={styles.homeHeadline}>{t.workInSilence}</h1>
      <p style={styles.homeLocation}>{t.location}</p>
      <div style={styles.homeCards}>
        <button style={styles.cardBtn} onClick={() => setView("student-search")}>
          <User size={28} color="#FF6A00" />
          <div style={styles.cardBtnTitle}>{t.studentTab}</div>
          <ChevronRight size={18} color="#888" />
        </button>
        <button style={styles.cardBtnAlt} onClick={() => setView("teacher-login")}>
          <Lock size={24} color="#fff" />
          <div style={styles.cardBtnTitleAlt}>{t.teacherTab}</div>
          <ChevronRight size={18} color="#bbb" />
        </button>
      </div>
    </div>
  );
}

function StudentSearch({ t, lang, students, setView, reload }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [found, setFound] = useState(null);

  useEffect(() => {
    if (reload) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    setError("");
    setSuggestions([]);
    const exact = students.find(
      (s) => normalize(s.name) === normalize(name) && normalize(s.surname) === normalize(surname)
    );
    if (exact) {
      setFound(exact);
      return;
    }
    const fuzzy = similarStudents(students, `${name} ${surname}`);
    if (fuzzy.length > 0) {
      setSuggestions(fuzzy);
      setError(t.notFoundButSimilar);
    } else {
      setError(t.notFound);
    }
  }

  if (found) {
    const live = students.find((s) => s.id === found.id) || found;
    return <StudentDetail t={t} lang={lang} student={live} onBack={() => setFound(null)} setView={setView} />;
  }

  return (
    <div style={styles.panel}>
      <BackButton t={t} onClick={() => setView("home")} />
      <h2 style={styles.panelTitle}>{t.studentTab}</h2>
      <form onSubmit={handleSearch} style={styles.form}>
        <Field label={t.name} value={name} onChange={setName} />
        <Field label={t.surname} value={surname} onChange={setSurname} />
        {error && <div style={styles.errorBox}>{error}</div>}
        <button type="submit" style={styles.primaryBtn}>
          <Search size={16} style={{ marginRight: 8 }} />
          {t.search}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={styles.mutedTextSmall}>{t.didYouMean}</p>
          <div style={styles.studentRows}>
            {suggestions.map((s) => (
              <button key={s.id} style={styles.suggestionRow} onClick={() => setFound(s)}>
                <User size={16} color="#FF6A00" />
                <span style={{ marginLeft: 10, fontWeight: 700 }}>
                  {s.name} {s.surname}
                </span>
                <ChevronRight size={16} color="#888" style={{ marginLeft: "auto" }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, uppercase, optional }) {
  return (
    <label style={styles.fieldLabel}>
      {label}{optional ? "" : ""}
      <input
        style={styles.input}
        value={value}
        onChange={(e) => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
        required={!optional}
      />
    </label>
  );
}

function StudentDetail({ t, lang, student, onBack, setView }) {
  const total = bonoSessionsTotal(student);
  const used = student.attendance.length;
  const left = student.bonoType === "suelta" ? Math.max(total - used, 0) : Math.max(total - used, 0);

  return (
    <div style={styles.panel}>
      <BackButton t={t} onClick={onBack} />
      <div style={styles.studentHeadCard}>
        <div style={styles.studentName}>
          {student.name} {student.surname}
        </div>
        <div style={styles.studentBonoTag}>{bonoLabel(student.bonoType, t)}</div>
      </div>

      <div style={styles.statRow}>
        <StatBox label={t.sessionsUsed} value={used} />
        <StatBox
          label={t.sessionsLeft}
          value={left}
          highlight={left === 0}
        />
        <StatBox label={t.bonoType === "suelta" ? "" : t.of} value={total} hide={student.bonoType === "suelta"} />
      </div>

      <h3 style={styles.subheading}>{t.datesAttended}</h3>
      {student.attendance.length === 0 ? (
        <p style={styles.mutedText}>{t.noDates}</p>
      ) : (
        <div style={styles.dateList}>
          {[...student.attendance]
            .sort()
            .map((d) => (
              <div key={d} style={styles.dateChip}>
                <Check size={14} color="#FF6A00" style={{ marginRight: 6 }} />
                {formatDate(d, lang)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, highlight, hide }) {
  if (hide) return null;
  return (
    <div style={{ ...styles.statBox, ...(highlight ? styles.statBoxHighlight : {}) }}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function BackButton({ t, onClick }) {
  return (
    <button style={styles.backBtn} onClick={onClick}>
      <ArrowLeft size={16} style={{ marginRight: 6 }} />
      {t.back}
    </button>
  );
}

function TeacherLogin({ t, setView }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (pass === TEACHER_PASS) {
      setView("teacher");
    } else {
      setError(t.wrongPass);
    }
  }

  return (
    <div style={styles.panel}>
      <BackButton t={t} onClick={() => setView("home")} />
      <h2 style={styles.panelTitle}>
        <Lock size={20} style={{ marginRight: 8, verticalAlign: "middle" }} />
        {t.teacherTab}
      </h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Field label={t.password} value={pass} onChange={setPass} />
        {error && <div style={styles.errorBox}>{error}</div>}
        <button type="submit" style={styles.primaryBtn}>
          <Unlock size={16} style={{ marginRight: 8 }} />
          {t.enter}
        </button>
      </form>
    </div>
  );
}

function TeacherPanel({ t, lang, students, reload, setView }) {
  const [tab, setTab] = useState("attendance"); // attendance, students, payments
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [localStudents, setLocalStudents] = useState(students);

  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  async function addStudent(newStudent) {
    setLocalStudents((prev) => [...prev, newStudent]);
    try {
      await insertStudent(newStudent);
    } catch (e) {
      console.error(e);
    }
    reload();
  }

  async function updateStudent(id, patch) {
    setLocalStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    try {
      await updateStudentRow(id, patch);
    } catch (e) {
      console.error(e);
    }
  }

  async function removeStudent(id) {
    setLocalStudents((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
    try {
      await deleteStudentRow(id);
    } catch (e) {
      console.error(e);
    }
    reload();
  }

  const students_ = localStudents;

  return (
    <div style={styles.panel}>
      <BackButton t={t} onClick={() => setView("home")} />
      <div style={styles.teacherTabs}>
        <TabBtn active={tab === "attendance"} onClick={() => setTab("attendance")} icon={<Calendar size={16} />} label={t.attendance} />
        <TabBtn active={tab === "students"} onClick={() => setTab("students")} icon={<User size={16} />} label={t.students} />
        <TabBtn active={tab === "payments"} onClick={() => setTab("payments")} icon={<Euro size={16} />} label={t.payments} />
      </div>

      {tab === "attendance" && (
        <AttendanceTab t={t} lang={lang} students={students_} updateStudent={updateStudent} />
      )}
      {tab === "students" && (
        <StudentsTab
          t={t}
          students={students_}
          addStudent={addStudent}
          removeStudent={removeStudent}
          confirmDeleteId={confirmDeleteId}
          setConfirmDeleteId={setConfirmDeleteId}
        />
      )}
      {tab === "payments" && (
        <PaymentsTab t={t} students={students_} updateStudent={updateStudent} />
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button style={{ ...styles.tabBtn, ...(active ? styles.tabBtnActive : {}) }} onClick={onClick}>
      {icon}
      <span style={{ marginLeft: 6 }}>{label}</span>
    </button>
  );
}

function AttendanceTab({ t, lang, students, updateStudent }) {
  const [date, setDate] = useState(SESSIONS[0]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    return students.filter(
      (s) => !q || normalize(`${s.name} ${s.surname}`).includes(q)
    );
  }, [students, query]);

  async function toggleAttendance(student) {
    const has = student.attendance.includes(date);
    const total = bonoSessionsTotal(student);
    if (!has && student.attendance.length >= total) return; // no sessions left
    const nextAttendance = has
      ? student.attendance.filter((d) => d !== date)
      : [...student.attendance, date];
    await updateStudent(student.id, { attendance: nextAttendance });
  }

  const attendedCount = students.filter((s) => s.attendance.includes(date)).length;

  return (
    <div>
      <label style={styles.fieldLabel}>
        {t.selectDate}
        <select style={styles.input} value={date} onChange={(e) => setDate(e.target.value)}>
          {SESSIONS.map((d) => (
            <option key={d} value={d}>
              {formatDate(d, lang)}
            </option>
          ))}
        </select>
      </label>

      <div style={styles.searchRow}>
        <Search size={16} color="#888" />
        <input
          style={styles.searchInput}
          placeholder={t.searchStudent}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <p style={styles.mutedTextSmall}>
        {t.markAttended} · {t.attendedToday}: {attendedCount}
      </p>

      <div style={styles.studentRows}>
        {filtered.length === 0 && <p style={styles.mutedText}>{t.noStudents}</p>}
        {filtered.map((s) => {
          const total = bonoSessionsTotal(s);
          const used = s.attendance.length;
          const left = Math.max(total - used, 0);
          const checked = s.attendance.includes(date);
          const disabled = !checked && left <= 0;
          return (
            <button
              key={s.id}
              style={{
                ...styles.attendanceRow,
                ...(checked ? styles.attendanceRowChecked : {}),
                ...(disabled ? styles.attendanceRowDisabled : {}),
              }}
              onClick={() => !disabled && toggleAttendance(s)}
              disabled={disabled}
            >
              <div style={styles.checkboxCircle}>
                {checked && <Check size={14} color="#0B0B0B" />}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.attendanceName}>
                  {s.name} {s.surname}
                </div>
                <div style={styles.attendanceMeta}>
                  {bonoLabel(s.bonoType, t)} · {disabled ? t.noSessionsLeft : `${left} ${t.sessionsLeft.toLowerCase()}`}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StudentsTab({ t, students, addStudent, removeStudent, confirmDeleteId, setConfirmDeleteId }) {
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    return students.filter((s) => !q || normalize(`${s.name} ${s.surname} ${s.dni}`).includes(q));
  }, [students, query]);

  return (
    <div>
      <div style={styles.searchRow}>
        <Search size={16} color="#888" />
        <input
          style={styles.searchInput}
          placeholder={t.searchStudent}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!showForm ? (
        <button style={styles.primaryBtnSmall} onClick={() => setShowForm(true)}>
          <Plus size={16} style={{ marginRight: 6 }} />
          {t.addStudent}
        </button>
      ) : (
        <AddStudentForm
          t={t}
          onCancel={() => setShowForm(false)}
          onSave={(s) => {
            addStudent(s);
            setShowForm(false);
          }}
        />
      )}

      <div style={styles.studentRows}>
        {filtered.length === 0 && <p style={styles.mutedText}>{t.noStudents}</p>}
        {filtered.map((s) => (
          <div key={s.id} style={styles.studentListRow}>
            <div style={{ flex: 1 }}>
              <div style={styles.attendanceName}>
                {s.name} {s.surname}
              </div>
              <div style={styles.attendanceMeta}>
                {bonoLabel(s.bonoType, t)} · {s.local ? t.local : t.foraster}{s.dni ? ` · DNI ${s.dni}` : ""}
              </div>
            </div>
            {confirmDeleteId === s.id ? (
              <div style={styles.confirmRow}>
                <span style={styles.mutedTextSmall}>{t.confirmDelete}</span>
                <button style={styles.dangerBtn} onClick={() => removeStudent(s.id)}>
                  {t.yes}
                </button>
                <button style={styles.ghostBtn} onClick={() => setConfirmDeleteId(null)}>
                  {t.no}
                </button>
              </div>
            ) : (
              <button style={styles.iconBtn} onClick={() => setConfirmDeleteId(s.id)}>
                <Trash2 size={16} color="#cc3333" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddStudentForm({ t, onCancel, onSave }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dni, setDni] = useState("");
  const [bonoType, setBonoType] = useState("10");
  const [local, setLocal] = useState(true);
  const [sueltasBought, setSueltasBought] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      surname: surname.trim(),
      dni: dni.trim().toUpperCase(),
      bonoType,
      local,
      sueltasBought: bonoType === "suelta" ? Number(sueltasBought) : undefined,
      paid: false,
      attendance: [],
    });
  }

  return (
    <form onSubmit={handleSubmit} style={styles.formCard}>
      <Field label={t.name} value={name} onChange={setName} />
      <Field label={t.surname} value={surname} onChange={setSurname} />
      <Field label={t.dni} value={dni} onChange={setDni} uppercase optional />

      <label style={styles.fieldLabel}>
        {t.bonoType}
        <select style={styles.input} value={bonoType} onChange={(e) => setBonoType(e.target.value)}>
          <option value="20">{t.type20}</option>
          <option value="10">{t.type10}</option>
          <option value="suelta">{t.typeSuelta}</option>
        </select>
      </label>

      {bonoType === "suelta" && (
        <Field
          label={t.sueltasBought}
          value={sueltasBought}
          onChange={(v) => setSueltasBought(v.replace(/[^0-9]/g, ""))}
        />
      )}

      <div style={styles.toggleRow}>
        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(local ? styles.toggleBtnActive : {}) }}
          onClick={() => setLocal(true)}
        >
          {t.local}
        </button>
        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(!local ? styles.toggleBtnActive : {}) }}
          onClick={() => setLocal(false)}
        >
          {t.foraster}
        </button>
      </div>

      <div style={styles.formActions}>
        <button type="button" style={styles.ghostBtnWide} onClick={onCancel}>
          {t.cancel}
        </button>
        <button type="submit" style={styles.primaryBtnSmall}>
          {t.save}
        </button>
      </div>
    </form>
  );
}

function PaymentsTab({ t, students, updateStudent }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    return students.filter((s) => !q || normalize(`${s.name} ${s.surname}`).includes(q));
  }, [students, query]);

  const totalPaid = students.filter((s) => s.paid).length;
  const totalPending = students.length - totalPaid;

  return (
    <div>
      <div style={styles.statRow}>
        <StatBox label={t.totalStudents} value={students.length} />
        <StatBox label={t.totalPaid} value={totalPaid} />
        <StatBox label={t.totalPending} value={totalPending} highlight={totalPending > 0} />
      </div>

      <div style={styles.searchRow}>
        <Search size={16} color="#888" />
        <input
          style={styles.searchInput}
          placeholder={t.searchStudent}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div style={styles.studentRows}>
        {filtered.length === 0 && <p style={styles.mutedText}>{t.noStudents}</p>}
        {filtered.map((s) => (
          <div key={s.id} style={styles.paymentRow}>
            <div style={{ flex: 1 }}>
              <div style={styles.attendanceName}>
                {s.name} {s.surname}
              </div>
              <div style={styles.attendanceMeta}>
                {bonoLabel(s.bonoType, t)} · {s.local ? t.local : t.foraster} · {t.price}: {price(s)}€
              </div>
            </div>
            <button
              style={{ ...styles.payBadge, ...(s.paid ? styles.payBadgePaid : styles.payBadgePending) }}
              onClick={() => updateStudent(s.id, { paid: !s.paid })}
            >
              {s.paid ? t.paid : t.unpaid}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const ORANGE = "#FF6A00";
const BLACK = "#0B0B0B";
const CARD = "#161616";
const BORDER = "#2A2A2A";

const globalCss = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  input:focus, select:focus, button:focus-visible {
    outline: 2px solid ${ORANGE};
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
`;

const styles = {
  app: {
    minHeight: "100vh",
    background: BLACK,
    color: "#EDEDED",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  loadingScreen: {
    minHeight: "100vh",
    background: BLACK,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: BLACK,
    borderBottom: `1px solid ${BORDER}`,
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    maxWidth: 480,
    margin: "0 auto",
  },
  brandRow: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logo: { width: 38, height: 38, borderRadius: "50%", objectFit: "cover" },
  brandTitle: { fontWeight: 800, fontSize: 15, letterSpacing: 0.5 },
  brandSub: { fontSize: 11, color: "#999" },
  langBtn: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: `1px solid ${BORDER}`,
    color: "#ccc",
    borderRadius: 20,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  headerStripe: { height: 3, background: `linear-gradient(90deg, ${ORANGE}, #ffb066, ${ORANGE})` },
  content: { maxWidth: 480, margin: "0 auto", padding: "20px 16px 48px" },

  homeWrap: { textAlign: "center", paddingTop: 8 },
  homeBall: { fontSize: 40, marginBottom: 6 },
  homeHeadline: { fontSize: 22, fontWeight: 800, margin: "4px 0", color: ORANGE, letterSpacing: 0.3 },
  homeLocation: { fontSize: 13, color: "#999", marginBottom: 28 },
  homeCards: { display: "flex", flexDirection: "column", gap: 12 },
  cardBtn: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: "18px 16px",
    cursor: "pointer",
    color: "#fff",
  },
  cardBtnTitle: { flex: 1, textAlign: "left", fontWeight: 700, fontSize: 15 },
  cardBtnAlt: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "transparent",
    border: `1px dashed ${BORDER}`,
    borderRadius: 14,
    padding: "16px",
    cursor: "pointer",
    color: "#fff",
  },
  cardBtnTitleAlt: { flex: 1, textAlign: "left", fontWeight: 600, fontSize: 14, color: "#ccc" },

  panel: { paddingBottom: 24 },
  panelTitle: { fontSize: 18, fontWeight: 800, marginBottom: 16 },
  backBtn: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    border: "none",
    color: "#999",
    fontSize: 13,
    cursor: "pointer",
    padding: "4px 0",
    marginBottom: 12,
  },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  formCard: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  fieldLabel: { display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#aaa", fontWeight: 600 },
  input: {
    background: "#1c1c1c",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "10px 12px",
    color: "#fff",
    fontSize: 14,
  },
  errorBox: {
    background: "rgba(204,51,51,0.12)",
    border: "1px solid rgba(204,51,51,0.4)",
    color: "#ff8a8a",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: ORANGE,
    color: "#0B0B0B",
    border: "none",
    borderRadius: 10,
    padding: "13px",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
  },
  primaryBtnSmall: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: ORANGE,
    color: "#0B0B0B",
    border: "none",
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    marginBottom: 16,
  },

  studentHeadCard: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  studentName: { fontSize: 18, fontWeight: 800 },
  studentBonoTag: { color: ORANGE, fontSize: 12, fontWeight: 700, marginTop: 4 },

  statRow: { display: "flex", gap: 10, marginBottom: 18 },
  statBox: {
    flex: 1,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "12px 8px",
    textAlign: "center",
  },
  statBoxHighlight: { borderColor: ORANGE },
  statValue: { fontSize: 22, fontWeight: 800, color: "#fff" },
  statLabel: { fontSize: 10, color: "#999", marginTop: 2 },

  subheading: { fontSize: 14, fontWeight: 700, marginBottom: 8, color: "#ddd" },
  mutedText: { color: "#888", fontSize: 13 },
  mutedTextSmall: { color: "#888", fontSize: 11, marginBottom: 10 },
  dateList: { display: "flex", flexDirection: "column", gap: 6 },
  dateChip: {
    display: "flex",
    alignItems: "center",
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
  },
  suggestionRow: {
    display: "flex",
    alignItems: "center",
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "12px",
    cursor: "pointer",
    color: "#fff",
    width: "100%",
    textAlign: "left",
  },

  teacherTabs: { display: "flex", gap: 6, marginBottom: 16, background: "#151515", padding: 4, borderRadius: 10 },
  tabBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    color: "#999",
    padding: "8px 4px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  tabBtnActive: { background: ORANGE, color: "#0B0B0B" },

  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#1c1c1c",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "10px 12px",
    marginBottom: 14,
  },
  searchInput: { flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 14, outline: "none" },

  studentRows: { display: "flex", flexDirection: "column", gap: 8 },
  attendanceRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "12px",
    cursor: "pointer",
    textAlign: "left",
  },
  attendanceRowChecked: { borderColor: ORANGE, background: "rgba(255,106,0,0.08)" },
  attendanceRowDisabled: { opacity: 0.45, cursor: "not-allowed" },
  checkboxCircle: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: `2px solid ${ORANGE}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "transparent",
  },
  attendanceName: { fontSize: 14, fontWeight: 700, color: "#fff" },
  attendanceMeta: { fontSize: 11, color: "#999", marginTop: 2 },

  studentListRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "12px",
  },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", padding: 6 },
  confirmRow: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" },
  dangerBtn: {
    background: "#cc3333",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    color: "#999",
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 11,
    cursor: "pointer",
  },
  ghostBtnWide: {
    flex: 1,
    background: "transparent",
    color: "#aaa",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "10px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  formActions: { display: "flex", gap: 10, marginTop: 4 },

  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: {
    flex: 1,
    background: "#1c1c1c",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "9px 6px",
    fontSize: 12,
    fontWeight: 700,
    color: "#aaa",
    cursor: "pointer",
  },
  toggleBtnActive: { background: ORANGE, color: "#0B0B0B", borderColor: ORANGE },

  paymentRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "12px",
  },
  payBadge: {
    border: "none",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  payBadgePaid: { background: "rgba(70,200,120,0.15)", color: "#5fd98a", border: "1px solid rgba(70,200,120,0.4)" },
  payBadgePending: { background: "rgba(255,106,0,0.12)", color: ORANGE, border: `1px solid ${ORANGE}` },
};
