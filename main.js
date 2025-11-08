document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     MENÚ LATERAL (SIDEBAR)
  ============================ */
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

    // Cerrar menú si el usuario hace clic fuera
    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove("active");
      }
    });
  }

  /* ============================
     LÓGICA DE PARÁMETROS
  ============================ */
  const PARAMS = {
    peralte: { via12: "8.00%", via3: "6.00%", urbana: "4.00%" },
    vch: [15,20,30,40,50,60,70,80,90,100,110,120,130],
    rmin8: {15:0,20:0,30:0,40:41,50:73,60:113,70:168,80:229,90:304,100:394,110:501,120:667,130:832},
    bw: { "1.0":1.00, "1.5":0.83, "2.0":0.75, "2.5":0.70, "3.0":0.67, "3.5":0.64 },
    rmin6: {15:0,20:15,30:21,40:43,50:79,60:123,70:0,80:0,90:0,100:0,110:0,120:0,130:0},
    rampa: {20:1.35,30:1.28,40:0.96,50:0.77,60:0.60,70:0.55,80:0.50,90:0.47,100:0.44,110:0.41,120:0.38,130:0.38},
    rmin4: {15:4,20:8,30:22,40:47,50:86,60:135,70:203,80:280,90:375,100:492,110:0,120:0,130:0},
    dsMin: 0.10,
    BN: 0.11,
    a: 0.35
  };

  // si no estamos en parámetros.html, no seguir con la lógica
  if (!document.getElementById("tipoVia")) return;

  const tipoVia = document.getElementById("tipoVia");
  const velocidad = document.getElementById("velocidad");
  const carriles = document.getElementById("carriles");
  const este = document.getElementById("este");
  const norte = document.getElementById("norte");

  const rTipo = document.getElementById("rTipo");
  const rEmax = document.getElementById("rEmax");
  const rVch = document.getElementById("rVch");
  const rCarriles = document.getElementById("rCarriles");
  const rBw = document.getElementById("rBw");
  const rRmin = document.getElementById("rRmin");
  const rDs = document.getElementById("rDs");
  const rLamin = document.getElementById("rLamin");
  const rEste = document.getElementById("rEste");
  const rNorte = document.getElementById("rNorte");

  const pEmax = document.getElementById("pEmax");
  const pDsMax = document.getElementById("pDsMax");
  const pDsMin = document.getElementById("pDsMin");
  const pRmin = document.getElementById("pRmin");
  const pLamin = document.getElementById("pLamin");
  const pBn = document.getElementById("pBn");
  const pA = document.getElementById("pA");

  const vchBody = document.getElementById("tabla-vch-body");
  const rmin8Body = document.getElementById("rmin8-body");
  const rmin6Body = document.getElementById("rmin6-body");
  const rmin4Body = document.getElementById("rmin4-body");
  const rampaBody = document.getElementById("rampa-body");

  function init() {
    PARAMS.vch.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      velocidad.appendChild(opt);
    });

    PARAMS.vch.forEach(v => {
      const tr = document.createElement("tr");
      tr.dataset.vel = String(v);
      tr.innerHTML = `<td>${v}</td>`;
      vchBody.appendChild(tr);
    });

    Object.keys(PARAMS.rmin8).forEach(k => {
      const tr = document.createElement("tr");
      tr.dataset.vel = String(k);
      tr.innerHTML = `<td>${k}</td><td>${PARAMS.rmin8[k]}</td>`;
      rmin8Body.appendChild(tr);
    });

    Object.keys(PARAMS.rmin6).forEach(k => {
      const tr = document.createElement("tr");
      tr.dataset.vel = String(k);
      tr.innerHTML = `<td>${k}</td><td>${PARAMS.rmin6[k]}</td>`;
      rmin6Body.appendChild(tr);
    });

    Object.keys(PARAMS.rmin4).forEach(k => {
      const tr = document.createElement("tr");
      tr.dataset.vel = String(k);
      tr.innerHTML = `<td>${k}</td><td>${PARAMS.rmin4[k]}</td>`;
      rmin4Body.appendChild(tr);
    });

    Object.keys(PARAMS.rampa).forEach(k => {
      const tr = document.createElement("tr");
      tr.dataset.vel = String(k);
      tr.innerHTML = `<td>${k}</td><td>${PARAMS.rampa[k]}</td>`;
      rampaBody.appendChild(tr);
    });

    pDsMin.textContent = PARAMS.dsMin;
    pBn.textContent = PARAMS.BN;
    pA.textContent = PARAMS.a;
  }

  function clearHighlights() {
    document.querySelectorAll(".tarjeta-parametro tr").forEach(tr => tr.classList.remove("highlight"));
  }

  function highlightRows(selector, dataAttr, value) {
    document.querySelectorAll(selector).forEach(row => {
      row.classList.toggle("highlight", row.dataset[dataAttr] === String(value));
    });
  }

  function obtenerRminPorTipoYVel(tipoKey, vel) {
    if (!tipoKey || !vel) return "-";
    const e = PARAMS.peralte[tipoKey];
    if (e === "8.00%") return PARAMS.rmin8[vel] ?? "-";
    if (e === "6.00%") return PARAMS.rmin6[vel] ?? "-";
    if (e === "4.00%") return PARAMS.rmin4[vel] ?? "-";
    return "-";
  }

  function calcularLamin(v) {
    if (!v) return "-";
    const lamin = (2 * parseFloat(v) / 3.6);
    return Number.isFinite(lamin) ? lamin.toFixed(2) : "-";
  }

  function actualizarTodo() {
    const tipo = tipoVia.value;
    const v = velocidad.value;
    const c = carriles.value;
    const esteVal = este.value;
    const norteVal = norte.value;

    rTipo.textContent =
      tipo === "via12" ? "Vía 1 y 2 orden" :
      tipo === "via3" ? "Vía 3 orden" :
      tipo === "urbana" ? "Vía urbana" : "-";

    rEmax.textContent = tipo ? PARAMS.peralte[tipo] : "-";
    rVch.textContent = v || "-";
    rCarriles.textContent = c || "-";
    rBw.textContent = c ? PARAMS.bw[c] ?? "-" : "-";

    const rminVal = obtenerRminPorTipoYVel(tipo, v);
    rRmin.textContent = rminVal ?? "-";
    rDs.textContent = PARAMS.rampa[v] ?? "-";

    const laminVal = v ? calcularLamin(v) : "-";
    rLamin.textContent = laminVal;

    rEste.textContent = esteVal || "-";
    rNorte.textContent = norteVal || "-";

    pEmax.textContent = tipo ? PARAMS.peralte[tipo] : "-";
    pDsMax.textContent = PARAMS.rampa[v] ?? "-";
    pDsMin.textContent = PARAMS.dsMin;
    pRmin.textContent = rminVal ?? "-";
    pLamin.textContent = laminVal;
    pBn.textContent = PARAMS.BN;
    pA.textContent = PARAMS.a;

    clearHighlights();
    if (tipo) highlightRows("#tabla-peralte tbody tr", "tipo", tipo);
    if (v) {
      highlightRows("#tabla-vch tbody tr", "vel", v);
      highlightRows("#tabla-rmin8 tbody tr", "vel", v);
      highlightRows("#tabla-rmin6 tbody tr", "vel", v);
      highlightRows("#tabla-rmin4 tbody tr", "vel", v);
      highlightRows("#tabla-rampa tbody tr", "vel", v);
    }
    if (c) highlightRows("#tabla-bw tbody tr", "carril", c);

    const laminCell = document.getElementById("pLamin");
    if (laminCell && laminVal !== "-") {
      laminCell.classList.add("highlight");
      setTimeout(() => laminCell.classList.remove("highlight"), 900);
    }
  }

  tipoVia.addEventListener("change", actualizarTodo);
  velocidad.addEventListener("change", actualizarTodo);
  carriles.addEventListener("change", actualizarTodo);
  este.addEventListener("input", actualizarTodo);
  norte.addEventListener("input", actualizarTodo);

  init();
  actualizarTodo();
});
