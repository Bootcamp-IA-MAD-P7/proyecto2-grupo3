const api = "/api";

const state = { salas: [], clientes: [], reservas: [], empleados: [] };

/* ===================================================================
 *  UTILITIES
 * =================================================================== */
const formatCurrency = (v) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(Number(v ?? 0));

const toDateStr = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const showToast = (msg, isErr = false) => {
  const t = document.querySelector("#toast");
  t.textContent = msg;
  t.classList.toggle("error", isErr);
  t.classList.add("show");
  window.setTimeout(() => t.classList.remove("show"), 3200);
};

const request = async (path, opts = {}) => {
  const res = await fetch(`${api}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
};

const formData = (form) => Object.fromEntries(new FormData(form).entries());

/* ===================================================================
 *  NAVEGACIÓN ENTRE SECCIONES
 * =================================================================== */
const navButtons = document.querySelectorAll(".nav-btn");
const sections = {
  salas: document.querySelector("#section-salas"),
  clientes: document.querySelector("#section-clientes"),
  empleados: document.querySelector("#section-empleados"),
  reservas: document.querySelector("#section-reservas"),
  busqueda: document.querySelector("#section-busqueda"),
};

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    Object.keys(sections).forEach((key) => {
      sections[key].hidden = key !== btn.dataset.section;
    });
  });
});

/* ===================================================================
 *  SALAS — CRUD
 * =================================================================== */
const loadSalas = async () => {
  state.salas = await request("/salas/");
  fillSalaSelects();
  renderSalas();
};

const fillSalaSelects = () => {
  const rows = state.salas;
  const opt = (id, label, precio) => `<option value="${id}" ${precio !== undefined ? `data-precio="${precio}"` : ""}>${label}</option>`;
  document.querySelector("#reserva-sala").innerHTML =
    `<option value="">— Selecciona una sala —</option>` +
    rows.map((s) => opt(s.id_sala, `${s.id_sala} - ${s.nombre}`, s.precio)).join("");
  document.querySelector("#sala-select-edit").innerHTML =
    `<option value="">— Selecciona una sala —</option>` +
    rows.map((s) => opt(s.id_sala, `${s.id_sala} - ${s.nombre}`)).join("");
};

const renderSalas = () => {
  const body = document.querySelector("#salas-body");
  if (!body) return;
  if (!state.salas.length) {
    body.innerHTML = `<tr><td class="empty" colspan="6">Sin salas registradas</td></tr>`;
    return;
  }
  body.innerHTML = state.salas.map((s) => `<tr>
    <td>${s.id_sala}</td>
    <td>${s.nombre}</td>
    <td>${s.tematica}</td>
    <td>${s.dificultad || "—"}</td>
    <td>${s.capacidad_max}</td>
    <td>${formatCurrency(s.precio)}</td>
  </tr>`).join("");
};

document.querySelector("#refresh-salas")?.addEventListener("click", loadSalas);

const salaForm = document.querySelector("#sala-form");
salaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = formData(salaForm);
  try {
    await request("/salas/", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.nombre, tematica: data.tematica, dificultad: data.dificultad,
        capacidad_max: Number(data.capacidad_max), precio: Number(data.precio),
      }),
    });
    salaForm.reset();
    showToast("Sala creada correctamente");
    await loadSalas();
  } catch (err) { showToast(err.message, true); }
});

document.querySelector("#sala-select-edit").addEventListener("change", (e) => {
  const id = Number(e.target.value);
  const s = state.salas.find((x) => x.id_sala === id);
  if (!s) return;
  document.querySelector("#sala-edit-nombre").value = s.nombre;
  document.querySelector("#sala-edit-tematica").value = s.tematica;
  document.querySelector("#sala-edit-dificultad").value = s.dificultad || "";
  document.querySelector("#sala-edit-capacidad").value = s.capacidad_max;
  document.querySelector("#sala-edit-precio").value = s.precio;
});

document.querySelector("#sala-edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = formData(e.currentTarget);
  const id = Number(data.id_sala);
  if (!id) { showToast("Selecciona una sala", true); return; }
  try {
    await request(`/salas/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: data.nombre, tematica: data.tematica, dificultad: data.dificultad,
        capacidad_max: Number(data.capacidad_max), precio: Number(data.precio),
      }),
    });
    showToast("Sala actualizada correctamente");
    await loadSalas();
  } catch (err) { showToast(err.message, true); }
});

document.querySelector("#sala-delete-btn").addEventListener("click", async () => {
  const id = Number(document.querySelector("#sala-select-edit").value);
  if (!id) { showToast("Selecciona una sala", true); return; }
  if (!confirm("¿Borrar esta sala definitivamente?")) return;
  try {
    await request(`/salas/${id}`, { method: "DELETE" });
    showToast("Sala eliminada correctamente");
    document.querySelector("#sala-edit-form").reset();
    await loadSalas();
  } catch (err) { showToast(err.message, true); }
});

/* ===================================================================
 *  CLIENTES — CRUD
 * =================================================================== */
const loadClientes = async () => {
  state.clientes = await request("/clientes/");
  fillClienteSelects();
};

const fillClienteSelects = () => {
  const rows = state.clientes;
  const opt = (id, label) => `<option value="${id}">${label}</option>`;
  document.querySelector("#reserva-cliente").innerHTML =
    `<option value="">— Selecciona un cliente —</option>` +
    rows.map((c) => opt(c.id_cliente, `${c.id_cliente} - ${c.nombre} ${c.apellido}`)).join("");
  document.querySelector("#cliente-select-edit").innerHTML =
    `<option value="">— Selecciona un cliente —</option>` +
    rows.map((c) => opt(c.id_cliente, `${c.id_cliente} - ${c.nombre} ${c.apellido}`)).join("");
};

const clienteForm = document.querySelector("#cliente-form");
clienteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = formData(clienteForm);
  try {
    await request("/clientes/", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.nombre, apellido: data.apellido, email: data.email, telefono: data.telefono || null,
      }),
    });
    clienteForm.reset();
    showToast("Cliente creado correctamente");
    await loadClientes();
  } catch (err) { showToast(err.message, true); }
});

document.querySelector("#cliente-select-edit").addEventListener("change", (e) => {
  const id = Number(e.target.value);
  const c = state.clientes.find((x) => x.id_cliente === id);
  if (!c) return;
  document.querySelector("#cliente-edit-nombre").value = c.nombre;
  document.querySelector("#cliente-edit-apellido").value = c.apellido;
  document.querySelector("#cliente-edit-email").value = c.email;
  document.querySelector("#cliente-edit-telefono").value = c.telefono || "";
});

document.querySelector("#cliente-edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = formData(e.currentTarget);
  const id = Number(data.id_cliente);
  if (!id) { showToast("Selecciona un cliente", true); return; }
  try {
    await request(`/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: data.nombre, apellido: data.apellido, email: data.email, telefono: data.telefono || null,
      }),
    });
    showToast("Cliente actualizado correctamente");
    await loadClientes();
  } catch (err) { showToast(err.message, true); }
});

document.querySelector("#cliente-delete-btn").addEventListener("click", async () => {
  const id = Number(document.querySelector("#cliente-select-edit").value);
  if (!id) { showToast("Selecciona un cliente", true); return; }
  if (!confirm("¿Borrar este cliente definitivamente?")) return;
  try {
    await request(`/clientes/${id}`, { method: "DELETE" });
    showToast("Cliente eliminado correctamente");
    document.querySelector("#cliente-edit-form").reset();
    await loadClientes();
  } catch (err) { showToast(err.message, true); }
});

/* ===================================================================
 *  EMPLEADOS — CRUD
 * =================================================================== */
const loadEmpleados = async () => {
  state.empleados = await request("/empleados/");
  state.empleados.sort((a, b) => a.apellido.localeCompare(b.apellido));
  document.querySelector("#empleado-select-edit").innerHTML =
    `<option value="">— Selecciona un empleado —</option>` +
    state.empleados.map((e) => `<option value="${e.id_empleado}">${e.id_empleado} - ${e.nombre} ${e.apellido} (${e.rol})</option>`).join("");
};

const empleadoForm = document.querySelector("#empleado-form");
empleadoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = formData(empleadoForm);
  try {
    await request("/empleados/", {
      method: "POST",
      body: JSON.stringify({ nombre: data.nombre, apellido: data.apellido, rol: data.rol }),
    });
    empleadoForm.reset();
    showToast("Empleado creado correctamente");
    await loadEmpleados();
  } catch (err) { showToast(err.message, true); }
});

document.querySelector("#empleado-select-edit").addEventListener("change", (e) => {
  const id = Number(e.target.value);
  const emp = state.empleados.find((x) => x.id_empleado === id);
  if (!emp) return;
  document.querySelector("#empleado-edit-nombre").value = emp.nombre;
  document.querySelector("#empleado-edit-apellido").value = emp.apellido;
  document.querySelector("#empleado-edit-rol").value = emp.rol;
});

document.querySelector("#empleado-edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = formData(e.currentTarget);
  const id = Number(data.id_empleado);
  if (!id) { showToast("Selecciona un empleado", true); return; }
  try {
    await request(`/empleados/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nombre: data.nombre, apellido: data.apellido, rol: data.rol }),
    });
    showToast("Empleado actualizado correctamente");
    await loadEmpleados();
  } catch (err) { showToast(err.message, true); }
});

document.querySelector("#empleado-delete-btn").addEventListener("click", async () => {
  const id = Number(document.querySelector("#empleado-select-edit").value);
  if (!id) { showToast("Selecciona un empleado", true); return; }
  if (!confirm("¿Borrar este empleado definitivamente?")) return;
  try {
    await request(`/empleados/${id}`, { method: "DELETE" });
    showToast("Empleado eliminado correctamente");
    document.querySelector("#empleado-edit-form").reset();
    await loadEmpleados();
  } catch (err) { showToast(err.message, true); }
});

/* ===================================================================
 *  RESERVAS — CALENDARIO + SLOTS + CRUD
 * =================================================================== */
let calDate = new Date();
calDate.setDate(1);
let selectedDate = null;
let selectedSalaId = null;
const slotCache = { selectedId: null };

const DURACION = 60;
const HORA_APERTURA = 10;
const HORA_CIERRE = 22;

const updateTotal = () => {
  const sel = document.querySelector("#reserva-sala");
  const opt = sel.options[sel.selectedIndex];
  const precio = opt ? parseFloat(opt.dataset.precio) : 0;
  document.querySelector("#reserva-total").value = precio ? (precio * 0.5).toFixed(2) : "";
};

document.querySelector("#reserva-sala").addEventListener("change", () => {
  selectedDate = null;
  selectedSalaId = Number(document.querySelector("#reserva-sala").value) || null;
  document.querySelector("#calendar-section").hidden = !selectedSalaId;
  document.querySelector("#slot-section").hidden = true;
  document.querySelector("#banner-success").classList.remove("visible");
  document.querySelector("#reserva-fecha_hora").value = "";
  document.querySelector("#reserva-submit").disabled = true;
  slotCache.selectedId = null;
  updateTotal();
  if (selectedSalaId) renderCalendar();
});

/* ---- Renderizar calendario ---- */
const renderCalendar = () => {
  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  document.querySelector("#cal-title").textContent = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(calDate);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const grid = document.querySelector("#calendar-grid");
  grid.innerHTML = "";

  ["Do","Lu","Ma","Mi","Ju","Vi","Sa"].forEach((d) => {
    const el = document.createElement("div");
    el.className = "cal-day-header";
    el.textContent = d;
    grid.appendChild(el);
  });

  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = startOffset - 1; i >= 0; i--) {
    const el = document.createElement("div");
    el.className = "cal-day other-month";
    el.textContent = daysInPrev - i;
    grid.appendChild(el);
  }

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement("div");
    el.className = "cal-day";
    el.textContent = d;
    const dayDate = new Date(year, month, d);
    const isPast = dayDate < todayStart;
    if (dayDate.toDateString() === today.toDateString()) el.classList.add("today");
    if (selectedDate && dayDate.toDateString() === selectedDate.toDateString()) el.classList.add("selected");
    if (isPast) {
      el.classList.add("past");
    } else {
      el.addEventListener("click", () => onDayClick(dayDate));
    }
    grid.appendChild(el);
  }

  const totalCells = startOffset + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const el = document.createElement("div");
    el.className = "cal-day other-month";
    el.textContent = i;
    grid.appendChild(el);
  }
};

const onDayClick = async (dayDate) => {
  selectedDate = dayDate;
  renderCalendar();
  document.querySelector("#banner-success").classList.remove("visible");
  const salaId = document.querySelector("#reserva-sala").value;
  if (!salaId) return;
  await loadDisponibilidad(salaId, toDateStr(dayDate));
};

const loadDisponibilidad = async (salaId, fechaStr) => {
  const section = document.querySelector("#slot-section");
  const grid = document.querySelector("#slot-grid");
  const empty = document.querySelector("#slot-empty");
  const hidden = document.querySelector("#reserva-fecha_hora");
  const submitBtn = document.querySelector("#reserva-submit");
  const dayLabel = document.querySelector("#slot-day-label");

  grid.innerHTML = "";
  slotCache.selectedId = null;
  hidden.value = "";
  submitBtn.disabled = true;

  const formatted = new Date(fechaStr + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  dayLabel.textContent = `Horarios — ${formatted}`;

  try {
    const data = await request(`/disponibilidad/?sala_id=${salaId}&fecha=${fechaStr}`);
    const disponibles = data.slots.filter((s) => s.disponible);

    if (disponibles.length === 0) {
      empty.hidden = false;
      section.hidden = false;
      return;
    }
    empty.hidden = true;

    const allSlots = [];
    for (let h = HORA_APERTURA; h < HORA_CIERRE; h++) {
      const inicio = `${String(h).padStart(2, "0")}:00`;
      const fin = `${String(h + 1).padStart(2, "0")}:00`;
      allSlots.push({ hora_inicio: inicio, hora_fin: fin, disponible: disponibles.some((s) => s.hora_inicio === inicio) });
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const isToday = fechaStr === `${y}-${m}-${d}`;

    allSlots.forEach((slot, idx) => {
      let disponible = slot.disponible;
      if (isToday) {
        const slotHour = parseInt(slot.hora_inicio);
        if (slotHour <= now.getHours()) disponible = false;
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn" + (disponible ? "" : " occupied");
      btn.textContent = slot.hora_inicio;
      btn.dataset.horaInicio = slot.hora_inicio;
      btn.dataset.idx = idx;

      if (disponible) {
        btn.addEventListener("click", () => {
          const prev = document.querySelector(".slot-btn.selected");
          if (prev) prev.classList.remove("selected");
          if (slotCache.selectedId === idx) {
            slotCache.selectedId = null;
            hidden.value = "";
            submitBtn.disabled = true;
            return;
          }
          btn.classList.add("selected");
          slotCache.selectedId = idx;
          hidden.value = `${fechaStr}T${slot.hora_inicio}:00`;
          submitBtn.disabled = false;
        });
      }
      grid.appendChild(btn);
    });
    section.hidden = false;
  } catch (err) {
    showToast("Error al consultar disponibilidad", true);
    section.hidden = true;
  }
};

document.querySelector("#cal-prev").addEventListener("click", () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
document.querySelector("#cal-next").addEventListener("click", () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });

/* ===================================================================
 *  RESERVAS — CREAR / EDITAR (submit button fuera del form)
 * =================================================================== */
document.querySelector("#reserva-submit").addEventListener("click", async () => {
  const form = document.querySelector("#reserva-form");
  const data = formData(form);
  const editId = data.edit_id;

  if (!data.id_sala || !data.id_cliente || !data.fecha_hora) {
    showToast("Completa todos los campos y selecciona un horario", true);
    return;
  }

  const body = {
    id_sala: Number(data.id_sala),
    id_cliente: Number(data.id_cliente),
    id_empleado: null,
    fecha_hora: data.fecha_hora,
    numero_jugadores: Number(data.numero_jugadores),
    total_pagado: Number(data.total_pagado),
  };

  try {
    if (editId) {
      await request(`/reservas/${editId}`, { method: "PUT", body: JSON.stringify(body) });
    } else {
      await request("/reservas/", { method: "POST", body: JSON.stringify(body) });
    }

    // Reset form
    form.reset();
    document.querySelector("#reserva-edit-id").value = "";
    document.querySelector("#reserva-submit").textContent = "Crear reserva";
    document.querySelector("#banner-success").classList.add("visible");
    document.querySelector("#calendar-section").hidden = true;
    document.querySelector("#slot-section").hidden = true;
    document.querySelector("#reserva-submit").disabled = true;
    slotCache.selectedId = null;
    selectedDate = null;

    // Ocultar banner tras 4 segundos
    window.setTimeout(() => { document.querySelector("#banner-success").classList.remove("visible"); }, 4000);

    await loadReservas();
  } catch (err) { showToast(err.message, true); }
});

/* ===================================================================
 *  RESERVAS — LISTADO
 * =================================================================== */
const loadReservas = async () => {
  state.reservas = await request("/reservas/");
  renderReservas();
};

const renderReservas = () => {
  const body = document.querySelector("#reservas-body");
  if (!state.reservas.length) {
    body.innerHTML = `<tr><td class="empty" colspan="10">Sin reservas registradas</td></tr>`;
    return;
  }
  body.innerHTML = state.reservas.map((r) => {
    const sala = state.salas.find((s) => s.id_sala === r.id_sala);
    const cliente = state.clientes.find((c) => c.id_cliente === r.id_cliente);
    const costo = sala ? Number(sala.precio) : 0;
    const diferencia = costo - Number(r.total_pagado);
    return `<tr>
      <td>${r.id_reserva}</td>
      <td>${sala ? sala.nombre : r.id_sala}</td>
      <td>${cliente ? `${cliente.nombre} ${cliente.apellido}` : r.id_cliente}</td>
      <td>${new Date(r.fecha_hora).toLocaleString("es-ES")}</td>
      <td>${r.numero_jugadores}</td>
      <td>${r.estado}</td>
      <td>${formatCurrency(r.total_pagado)}</td>
      <td>${formatCurrency(diferencia)}</td>
      <td>${formatCurrency(costo)}</td>
      <td>
        <button class="btn-sm btn-edit" data-id="${r.id_reserva}">Editar</button>
        <button class="btn-sm btn-danger" data-id="${r.id_reserva}">Borrar</button>
      </td>
    </tr>`;
  }).join("");

  // Borrar
  body.querySelectorAll(".btn-danger[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.id);
      if (!confirm("¿Anular esta reserva?")) return;
      try {
        await request(`/reservas/${id}`, { method: "DELETE" });
        showToast("Reserva anulada correctamente");
        await loadReservas();
      } catch (err) { showToast(err.message, true); }
    });
  });

  // Editar — carga los datos en el formulario
  body.querySelectorAll(".btn-edit[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const r = state.reservas.find((x) => x.id_reserva === id);
      if (!r) return;

      const fechaReserva = new Date(r.fecha_hora);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      if (fechaReserva < todayStart) {
        showToast("No se puede editar una reserva de una fecha pasada", true);
        return;
      }

      // Ir a pestaña reservas
      document.querySelector('[data-section="reservas"]').click();

      // Poner datos en el form
      document.querySelector("#reserva-sala").value = r.id_sala;
      document.querySelector("#reserva-cliente").value = r.id_cliente;
      document.querySelector('input[name="numero_jugadores"]').value = r.numero_jugadores;
      document.querySelector("#reserva-total").value = r.total_pagado;
      document.querySelector("#reserva-edit-id").value = id;
      document.querySelector("#reserva-submit").textContent = "Guardar cambios";

      // Mostrar calendario y seleccionar fecha
      const fecha = new Date(r.fecha_hora);
      calDate = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      selectedDate = fecha;
      document.querySelector("#calendar-section").hidden = false;
      renderCalendar();

      // Cargar slots y marcar el correspondiente
      const fechaStr = toDateStr(fecha);
      const hora = `${String(fecha.getHours()).padStart(2, "0")}:00`;
      loadDisponibilidad(r.id_sala, fechaStr).then(() => {
        // Seleccionar el slot correspondiente
        const slots = document.querySelectorAll(".slot-btn:not(.occupied)");
        slots.forEach((btn) => {
          if (btn.dataset.horainicio === hora) {
            btn.click();
          }
        });
      });
    });
  });
};

document.querySelector("#refresh-reservas").addEventListener("click", loadReservas);

/* ===================================================================
 *  API STATUS + INICIALIZACIÓN
 * =================================================================== */
const setApiStatus = async () => {
  const el = document.querySelector("#api-status");
  try {
    const res = await fetch("/health");
    if (!res.ok) throw new Error("API sin conexión");
    await res.json();
    el.textContent = "API conectada";
    el.classList.add("ok");
  } catch {
    el.textContent = "API sin conexión";
    el.classList.remove("ok");
  }
};

const loadAll = async () => {
  try {
    await Promise.all([setApiStatus(), loadSalas(), loadClientes(), loadEmpleados(), loadReservas()]);
  } catch (err) {
    showToast(err.message, true);
  }
};

/* ===================================================================
 *  BÚSQUEDA AVANZADA
 * =================================================================== */
let searchTab = "reservas";
let searchPage = 1;
const SEARCH_LIMIT = 10;

// Tabs de búsqueda
document.querySelectorAll(".search-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".search-tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    searchTab = btn.dataset.tab;
    // Mostrar filtros correspondientes
    document.querySelectorAll(".search-filters").forEach((el) => el.hidden = true);
    const filters = document.querySelector(`#search-filters-${searchTab}`);
    if (filters) filters.hidden = false;
    searchPage = 1;
    document.querySelector("#search-pagination").hidden = true;
    document.querySelector("#cliente-detalle-panel").hidden = true;
    document.querySelector("#search-tbody").innerHTML = "";
    document.querySelector("#search-thead").innerHTML = "";
  });
});

// Submit búsqueda
document.querySelector("#search-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  searchPage = 1;
  await runSearch();
});

// Paginación
document.querySelector("#pag-prev").addEventListener("click", async () => {
  if (searchPage > 1) { searchPage--; await runSearch(); }
});
document.querySelector("#pag-next").addEventListener("click", async () => {
  searchPage++; await runSearch();
});

// Cerrar detalle cliente
document.querySelector("#cliente-detalle-close").addEventListener("click", () => {
  document.querySelector("#cliente-detalle-panel").hidden = true;
});

const buildSearchParams = () => {
  const p = {};
  if (searchTab === "reservas") {
    const f = document.querySelector("#sf-fecha").value;
    const ci = document.querySelector("#sf-cliente-id").value;
    const si = document.querySelector("#sf-sala-id").value;
    const es = document.querySelector("#sf-estado").value;
    if (f) p.fecha = f;
    if (ci) p.id_cliente = ci;
    if (si) p.id_sala = si;
    if (es) p.estado = es;
  } else if (searchTab === "clientes") {
    const n = document.querySelector("#sf-cliente-nombre").value;
    const e = document.querySelector("#sf-cliente-email").value;
    if (n) p.nombre = n;
    if (e) p.email = e;
  } else if (searchTab === "salas") {
    const n = document.querySelector("#sf-sala-nombre").value;
    const t = document.querySelector("#sf-sala-tematica").value;
    if (n) p.nombre = n;
    if (t) p.tematica = t;
  } else if (searchTab === "empleados") {
    const r = document.querySelector("#sf-emp-rol").value;
    const a = document.querySelector("#sf-emp-activo").value;
    if (r) p.rol = r;
    if (a !== "") p.activo = a;
  }
  return p;
};

const runSearch = async () => {
  const loading = document.querySelector("#search-loading");
  const tbody = document.querySelector("#search-tbody");
  const thead = document.querySelector("#search-thead");
  const pagEl = document.querySelector("#search-pagination");
  const totalEl = document.querySelector("#search-total");

  tbody.innerHTML = "";
  thead.innerHTML = "";
  loading.hidden = false;
  pagEl.hidden = true;
  totalEl.textContent = "";

  const params = buildSearchParams();
  const qs = new URLSearchParams();
  qs.set("page", String(searchPage));
  qs.set("limit", String(SEARCH_LIMIT));
  for (const [k, v] of Object.entries(params)) qs.set(k, v);

  try {
    let data;
    if (searchTab === "reservas") {
      data = await request(`/reservas/?${qs}`);
    } else if (searchTab === "clientes") {
      data = await request(`/clientes/?${qs}`);
    } else if (searchTab === "salas") {
      data = await request(`/salas/?${qs}`);
    } else if (searchTab === "empleados") {
      data = await request(`/empleados/?${qs}`);
    }

    const items = data.items;
    const pag = data.paginacion;
    totalEl.textContent = `— Total: ${pag.total}`;

    if (!items.length) {
      tbody.innerHTML = `<tr><td class="empty" colspan="10">Sin resultados</td></tr>`;
      loading.hidden = true;
      return;
    }

    // Renderizar tabla según tab
    if (searchTab === "reservas") {
      thead.innerHTML = `<tr><th>ID</th><th>Sala</th><th>Cliente</th><th>Fecha</th><th>Jug.</th><th>Estado</th></tr>`;
      tbody.innerHTML = items.map((r) => {
        const sala = state.salas.find((s) => s.id_sala === r.id_sala);
        const cliente = state.clientes.find((c) => c.id_cliente === r.id_cliente);
        return `<tr>
          <td>${r.id_reserva}</td>
          <td>${sala ? sala.nombre : r.id_sala}</td>
          <td>${cliente ? cliente.nombre + " " + cliente.apellido : r.id_cliente}</td>
          <td>${new Date(r.fecha_hora).toLocaleString("es-ES")}</td>
          <td>${r.numero_jugadores}</td>
          <td>${r.estado}</td>
        </tr>`;
      }).join("");
    } else if (searchTab === "clientes") {
      thead.innerHTML = `<tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th></th></tr>`;
      tbody.innerHTML = items.map((c) => `<tr>
        <td>${c.id_cliente}</td>
        <td>${c.nombre} ${c.apellido}</td>
        <td>${c.email}</td>
        <td>${c.telefono || "—"}</td>
        <td><button class="btn-sm ver-reservas-btn" data-id="${c.id_cliente}">Ver reservas</button></td>
      </tr>`).join("");

      // Botones "Ver reservas" en clientes
      tbody.querySelectorAll(".ver-reservas-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = Number(btn.dataset.id);
          const panel = document.querySelector("#cliente-detalle-panel");
          const title = document.querySelector("#cliente-detalle-title");
          const body = document.querySelector("#cliente-detalle-body");
          try {
            const data = await request(`/clientes/${id}`);
            title.textContent = `${data.nombre} ${data.apellido} — Reservas`;
            body.innerHTML = data.reservas.length
              ? data.reservas.map((r) => `<tr>
                  <td>${r.id_reserva}</td>
                  <td>${r.id_sala}</td>
                  <td>${new Date(r.fecha_hora).toLocaleString("es-ES")}</td>
                  <td>${r.numero_jugadores}</td>
                  <td>${formatCurrency(r.total_pagado)}</td>
                  <td>${r.estado}</td>
                </tr>`).join("")
              : `<tr><td class="empty" colspan="6">Sin reservas</td></tr>`;
            panel.hidden = false;
          } catch (err) {
            showToast(err.message, true);
          }
        });
      });
    } else if (searchTab === "salas") {
      thead.innerHTML = `<tr><th>ID</th><th>Nombre</th><th>Temática</th><th>Dificultad</th><th>Capacidad</th><th>Precio</th></tr>`;
      tbody.innerHTML = items.map((s) => `<tr>
        <td>${s.id_sala}</td>
        <td>${s.nombre}</td>
        <td>${s.tematica}</td>
        <td>${s.dificultad || "—"}</td>
        <td>${s.capacidad_max}</td>
        <td>${formatCurrency(s.precio)}</td>
      </tr>`).join("");
    } else if (searchTab === "empleados") {
      thead.innerHTML = `<tr><th>ID</th><th>Nombre</th><th>Rol</th><th>Activo</th></tr>`;
      tbody.innerHTML = items.map((e) => `<tr>
        <td>${e.id_empleado}</td>
        <td>${e.nombre} ${e.apellido}</td>
        <td>${e.rol}</td>
        <td>${e.activo ? "Sí" : "No"}</td>
      </tr>`).join("");
    }

    // Paginación
    const pagInfo = document.querySelector("#pag-info");
    pagInfo.textContent = `Pág. ${pag.page} de ${pag.total_pages}`;
    document.querySelector("#pag-prev").disabled = pag.page <= 1;
    document.querySelector("#pag-next").disabled = pag.page >= pag.total_pages;
    pagEl.hidden = false;
  } catch (err) {
    showToast(err.message, true);
  } finally {
    loading.hidden = true;
  }
};

loadAll();
