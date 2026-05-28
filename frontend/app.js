const api = "";

const state = {
  salas: [],
  clientes: [],
  reservas: [],
};

const formatCurrency = (value) => {
  const number = Number(value ?? 0);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(number);
};

const showToast = (message, isError = false) => {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
};

const request = async (path, options = {}) => {
  const response = await fetch(`${api}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "No se pudo completar la operación");
  }

  return response.json();
};

const setApiStatus = async () => {
  const status = document.querySelector("#api-status");
  try {
    await request("/health");
    status.textContent = "API conectada";
    status.classList.add("ok");
  } catch {
    status.textContent = "API sin conexión";
    status.classList.remove("ok");
  }
};

const renderRows = (selector, rows, emptyColumns, mapper) => {
  const body = document.querySelector(selector);
  body.innerHTML = "";

  if (!rows.length) {
    body.innerHTML = `<tr><td class="empty" colspan="${emptyColumns}">Sin datos registrados</td></tr>`;
    return;
  }

  body.innerHTML = rows.map(mapper).join("");
};

const fillSelect = (selector, rows, placeholder, getValue, getLabel) => {
  const select = document.querySelector(selector);
  const currentValue = select.value;

  select.innerHTML = `<option value="">${placeholder}</option>`;
  select.insertAdjacentHTML(
    "beforeend",
    rows.map((row) => `<option value="${getValue(row)}">${getLabel(row)}</option>`).join("")
  );

  if (rows.some((row) => String(getValue(row)) === currentValue)) {
    select.value = currentValue;
  }
};

const loadSalas = async () => {
  state.salas = await request("/salas/");
  fillSelect(
    "#reserva-sala",
    state.salas,
    "Selecciona una sala",
    (sala) => sala.id_sala,
    (sala) => `${sala.id_sala} - ${sala.nombre}`
  );
  renderRows("#salas-body", state.salas, 6, (sala) => `
    <tr>
      <td>${sala.id_sala}</td>
      <td>${sala.nombre}</td>
      <td>${sala.tematica}</td>
      <td>${sala.dificultad || "-"}</td>
      <td>${sala.capacidad_max}</td>
      <td>${formatCurrency(sala.precio)}</td>
    </tr>
  `);
};

const loadClientes = async () => {
  state.clientes = await request("/clientes/");
  fillSelect(
    "#reserva-cliente",
    state.clientes,
    "Selecciona un cliente",
    (cliente) => cliente.id_cliente,
    (cliente) => `${cliente.id_cliente} - ${cliente.nombre} ${cliente.apellido}`
  );
  renderRows("#clientes-body", state.clientes, 4, (cliente) => `
    <tr>
      <td>${cliente.id_cliente}</td>
      <td>${cliente.nombre} ${cliente.apellido}</td>
      <td>${cliente.email}</td>
      <td>${cliente.telefono || "-"}</td>
    </tr>
  `);
};

const loadReservas = async () => {
  state.reservas = await request("/reservas/");
  renderRows("#reservas-body", state.reservas, 7, (reserva) => `
    <tr>
      <td>${reserva.id_reserva}</td>
      <td>${reserva.id_sala}</td>
      <td>${reserva.id_cliente}</td>
      <td>${new Date(reserva.fecha_hora).toLocaleString("es-ES")}</td>
      <td>${reserva.numero_jugadores}</td>
      <td>${reserva.estado}</td>
      <td>${formatCurrency(reserva.total_pagado)}</td>
    </tr>
  `);
};

const loadAll = async () => {
  try {
    await Promise.all([setApiStatus(), loadSalas(), loadClientes(), loadReservas()]);
  } catch (error) {
    showToast(error.message, true);
  }
};

const formData = (form) => Object.fromEntries(new FormData(form).entries());

document.querySelector("#sala-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = formData(form);

  try {
    await request("/salas/", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.nombre,
        tematica: data.tematica,
        dificultad: data.dificultad,
        capacidad_max: Number(data.capacidad_max),
        precio: Number(data.precio),
      }),
    });
    form.reset();
    showToast("Sala creada correctamente");
    await loadSalas();
  } catch (error) {
    showToast(error.message, true);
  }
});

document.querySelector("#cliente-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = formData(form);

  try {
    await request("/clientes/", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono || null,
      }),
    });
    form.reset();
    showToast("Cliente creado correctamente");
    await loadClientes();
  } catch (error) {
    showToast(error.message, true);
  }
});

document.querySelector("#reserva-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = formData(form);

  try {
    await request("/reservas/", {
      method: "POST",
      body: JSON.stringify({
        id_sala: Number(data.id_sala),
        id_cliente: Number(data.id_cliente),
        id_empleado: null,
        fecha_hora: data.fecha_hora,
        numero_jugadores: Number(data.numero_jugadores),
        total_pagado: Number(data.total_pagado),
      }),
    });
    form.reset();
    showToast("Reserva creada correctamente");
    await loadReservas();
  } catch (error) {
    showToast(error.message, true);
  }
});

document.querySelector("#refresh-salas").addEventListener("click", loadSalas);
document.querySelector("#refresh-clientes").addEventListener("click", loadClientes);
document.querySelector("#refresh-reservas").addEventListener("click", loadReservas);

loadAll();
