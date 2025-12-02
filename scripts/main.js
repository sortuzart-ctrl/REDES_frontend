const menuFlotante = document.getElementById('menuFlotante');
const configToggle = document.getElementById('configToggle');
const configMenu = document.getElementById('configMenu');
const logoLeftInput = document.getElementById('logoLeftInput');
const logoRightInput = document.getElementById('logoRightInput');
const previewLogoLeft = document.getElementById('previewLogoLeft');
const previewLogoRight = document.getElementById('previewLogoRight');
const removeLogosBtn = document.getElementById('removeLogosBtn');
const restoreLogosBtn = document.getElementById('restoreLogosBtn');
const uploadLogosBtn = document.getElementById('uploadLogosBtn');
const bulkLogoInput = document.getElementById('bulkLogoInput');
const defaultColorInput = document.getElementById('defaultColorInput');
const showNumbersInput = document.getElementById('showNumbersInput');
const aplicarConfig = document.getElementById('aplicarConfig');
const guardarConfig = document.getElementById('guardarConfig');
const configPiloto = document.getElementById('configPiloto');
const configFecha = document.getElementById('configFecha');
const configCentro = document.getElementById('configCentro');
const reiniciarBitacora = document.getElementById('reiniciarBitacora');
const guardarPlantilla = document.getElementById('guardarPlantilla');
const cargarPlantilla = document.getElementById('cargarPlantilla');
const gestionarPlantillas = document.getElementById('gestionarPlantillas');
const exportarBackup = document.getElementById('exportarBackup');
const importarBackup = document.getElementById('importarBackup');
const inputBackup = document.getElementById('inputBackup');
const lineaInput = document.getElementById('lineaInput');
const lineaEstado = document.getElementById('lineaEstado');
const vistaPrevia = document.getElementById('vistaPrevia');
const crearInforme = document.getElementById('crearInforme');
const agregarTextoEsquema = document.getElementById('agregarTextoEsquema');
const cargarFotosMenu = document.getElementById('cargarFotosMenu');
const nuevoInforme = document.getElementById('nuevoInforme');
const addBitacoraBtn = document.getElementById('addBitacoraBtn');
const panelLineas = document.getElementById('panelLineas');
const inputFotosGlobal = document.getElementById('inputFotosGlobal');
const labelAgregarFotos = document.getElementById('labelAgregarFotos');
const guardarInforme = document.getElementById('guardarInforme');
const verConsolidado = document.getElementById('verConsolidado');
const verEstadisticas = document.getElementById('verEstadisticas');
// Mostrar esquemas disponibles al abrir el panel de cargar esquema
const esquemasDisponiblesDiv = document.getElementById('esquemasDisponibles');
// Ahora cada imagen tiene nombre y roles permitidos
const archivosEsquemas = [];

function mostrarEsquemasDisponibles() {
  if (!esquemasDisponiblesDiv) return;
  esquemasDisponiblesDiv.innerHTML = '<strong>Esquemas disponibles:</strong>';
  const lista = document.createElement('ul');
  lista.style.listStyle = 'none';
  lista.style.padding = '0';
  lista.style.display = 'flex';
  lista.style.flexWrap = 'wrap';
  lista.style.gap = '16px';
  // Filtrar imágenes según el rol del usuario logueado
  let esSuperAdmin = usuarioActual && usuarioActual.tipo === 'SuperAdmin';
  let rolUsuario = usuarioActual ? (usuarioActual.rol || usuarioActual.empresa) : null;
  archivosEsquemas.forEach(esquema => {
    if (!esSuperAdmin && (!rolUsuario || !esquema.roles.includes(rolUsuario))) return;
    const li = document.createElement('li');
    li.style.margin = '0';
    li.style.padding = '0';
    li.style.listStyle = 'none';
    li.style.width = '100px';
    li.style.textAlign = 'center';
    li.style.cursor = 'pointer';
    // Miniatura
    const img = document.createElement('img');
    img.src = esquema.base64 ? esquema.base64 : `planillas informes/${esquema.nombre}`;
    img.alt = esquema.nombre;
    img.style.width = '90px';
    img.style.height = '90px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 2px 8px #0002';
    img.style.display = 'block';
    img.style.margin = '0 auto 6px auto';
    // Nombre debajo
    const nombreSpan = document.createElement('span');
    nombreSpan.textContent = esquema.nombre;
    nombreSpan.style.fontSize = '12px';
    nombreSpan.style.display = 'block';
    nombreSpan.style.marginBottom = '4px';
    li.appendChild(img);
    li.appendChild(nombreSpan);
    // Botón eliminar solo para admin o super admin
    if (usuarioActual && (usuarioActual.rol === 'Admin' || usuarioActual.tipo === 'SuperAdmin')) {
      const btnEliminarEsquema = document.createElement('button');
      btnEliminarEsquema.textContent = 'Eliminar';
      btnEliminarEsquema.className = 'btn-eliminar-global';
      btnEliminarEsquema.style.marginTop = '4px';
      btnEliminarEsquema.onclick = (e) => {
        e.stopPropagation();
        if (confirm('¿Seguro que quieres eliminar esta imagen?')) {
          const idx = archivosEsquemas.indexOf(esquema);
          if (idx !== -1) {
            archivosEsquemas.splice(idx, 1);
            mostrarEsquemasDisponibles();
            if (typeof mostrarUsuariosLogueados === 'function') {
              mostrarUsuariosLogueados();
            }
            const rolesGestionPanel = document.getElementById('rolesGestionPanel');
            if (rolesGestionPanel) {
              rolesGestionPanel.innerHTML = '';
              mostrarUsuariosLogueados();
            }
            const confirmDiv = document.createElement('div');
            confirmDiv.textContent = 'Imagen eliminada correctamente.';
            confirmDiv.style.position = 'fixed';
            confirmDiv.style.top = '24px';
            confirmDiv.style.right = '24px';
            confirmDiv.style.background = '#d32f2f';
            confirmDiv.style.color = '#fff';
            confirmDiv.style.padding = '12px 24px';
            confirmDiv.style.borderRadius = '8px';
            confirmDiv.style.fontWeight = 'bold';
            confirmDiv.style.boxShadow = '0 2px 8px #0002';
            confirmDiv.style.zIndex = '9999';
            document.body.appendChild(confirmDiv);
            setTimeout(() => { confirmDiv.remove(); }, 1800);
          }
        }
      };
      li.appendChild(btnEliminarEsquema);
    }
    li.onclick = () => {
      // Quitar selección previa
      document.querySelectorAll('#esquemasDisponibles li').forEach(el => {
        el.style.border = 'none';
        el.style.background = '';
      });
      li.style.border = '2px solid #1976d2';
      li.style.background = '#e3f2fd';
      // Simular el flujo de seleccionar imagen manualmente
      const ruta = esquema.base64 ? esquema.base64 : `planillas informes/${esquema.nombre}`;
      const vistaPrevia = document.getElementById('vistaPrevia');
      if (vistaPrevia) {
        vistaPrevia.innerHTML = `<img src="${ruta}" alt="${esquema.nombre}" style="max-width:100%;border-radius:8px;box-shadow:0 2px 8px #0002;">`;
        // Botón para crear informe
        const btnCrear = document.createElement('button');
        btnCrear.textContent = 'Crear informe con este esquema';
        btnCrear.style.display = 'block';
        btnCrear.style.margin = '18px auto 0 auto';
        btnCrear.style.background = '#1976d2';
        btnCrear.style.color = '#fff';
        btnCrear.style.border = 'none';
        btnCrear.style.borderRadius = '6px';
        btnCrear.style.padding = '10px 18px';
        btnCrear.style.fontSize = '16px';
        btnCrear.style.cursor = 'pointer';
        btnCrear.onclick = () => {
          crearInformeConEsquema(ruta);
          // Quitar selección y limpiar vista previa tras crear
          li.style.border = 'none';
          li.style.background = '';
          if (crearInforme) crearInforme.disabled = true;
        };
        vistaPrevia.appendChild(btnCrear);
        // Simular selección como si fuera input file
        lineaInput.value = '';
        lineaEstado.textContent = esquema.nombre;
        // Habilitar botón crear informe del menú lateral
        if (crearInforme) crearInforme.disabled = false;
        // Asignar imagen seleccionada a imagenLineaActual para el flujo
        imagenLineaActual = ruta;
      }
    };
    lista.appendChild(li);
  });
  // Función global para crear informe usando la imagen seleccionada
  function crearInformeConEsquema(rutaImagen) {
    const panelLineas = document.getElementById('panelLineas');
    if (!panelLineas) return;
    const hoja = document.createElement('div');
    hoja.className = 'hoja-bitacora hoja-fotos';
    hoja.style.background = '#fff';
    hoja.style.padding = '32px 24px';
    hoja.style.margin = '24px auto';
    hoja.style.boxShadow = '0 2px 8px #0001';
    hoja.style.borderRadius = '12px';
    hoja.style.maxWidth = '900px';
    hoja.style.position = 'static'; // Evitar absolute/fixed
    // Encabezado con imagen seleccionada
    const encabezado = document.createElement('div');
    encabezado.className = 'encabezado-hoja';
    encabezado.innerHTML = `
      <div class="encabezado-fila">
        <img src="${rutaImagen}" class="logo-izq" alt="Esquema" style="max-height:60px;" />
        <div class="encabezado-texto">
          <h2 style="margin-bottom:8px;">Informe generado</h2>
          <p style="margin:0;">Esquema seleccionado</p>
        </div>
        <img src="${rutaImagen}" class="logo-der" alt="Esquema" style="max-height:60px;" />
      </div>
    `;
    hoja.appendChild(encabezado);
    // Ejemplo de contenido visible y compatible
    const contenido = document.createElement('div');
    contenido.innerHTML = `
      <table style="width:100%;margin-top:24px;border-collapse:collapse;">
        <tr><th style="text-align:left;padding:8px 0;font-size:18px;">Datos</th></tr>
        <tr><td style="padding:8px 0;">Este es un ejemplo de contenido exportable en PDF.</td></tr>
      </table>
    `;
    hoja.appendChild(contenido);
    panelLineas.appendChild(hoja);
    // Limpiar la vista previa y mostrar mensaje
    const vistaPrevia = document.getElementById('vistaPrevia');
    if (vistaPrevia) {
      vistaPrevia.innerHTML = '<div style="color:#1976d2;font-weight:600;padding:16px;text-align:center;">Informe creado correctamente.</div>';
      setTimeout(() => { vistaPrevia.innerHTML = ''; }, 1500);
    }
  }
  esquemasDisponiblesDiv.appendChild(lista);
}

// Mostrar esquemas al abrir el panel de cargar esquema
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    mostrarEsquemasDisponibles();
    // Limpiar vista previa al abrir el panel
    const vistaPrevia = document.getElementById('vistaPrevia');
    if (vistaPrevia) vistaPrevia.innerHTML = '';
  });
}
// Admin menu y usuarios logueados
const adminMenuBtn = document.getElementById('adminMenuBtn');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');
const cerrarAdminPanelBtn = document.getElementById('cerrarAdminPanel');
const loggedUsersList = document.getElementById('loggedUsersList');

// Usuarios logueados y usuario actual (persistidos en IndexedDB)
let usuariosLogueados = [];
let usuarioActual = null;

// Elementos login y registro
const loginSection = document.getElementById('loginSection');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const registerUserForm = document.getElementById('registerUserForm');
const registerError = document.getElementById('registerError');

// Eventos de UI relacionados con admin y sesión
if (adminMenuBtn && adminPanel) {
  adminMenuBtn.addEventListener('click', () => {
    adminPanel.classList.toggle('oculto');
  });
}

if (cerrarAdminPanelBtn && adminPanel) {
  cerrarAdminPanelBtn.addEventListener('click', () => {
    adminPanel.classList.add('oculto');
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    usuarioActual = null;
    mostrarLogin();
    actualizarUIUsuario();
  });
}

function mostrarMenu() {
  document.querySelector('.menu-lateral').style.pointerEvents = '';
  document.querySelector('.menu-lateral').style.opacity = '1';
  document.querySelector('.menu-lateral').style.filter = 'none';
}

function mostrarLogin() {
  if (loginSection) loginSection.style.display = '';
  if (mainContent) mainContent.style.display = 'none';
  if (adminPanel) adminPanel.classList.add('oculto');
  // Desactivar menú lateral
  const menu = document.querySelector('.menu-lateral');
  if (menu) {
    menu.style.pointerEvents = 'none';
    menu.style.opacity = '0.5';
    menu.style.filter = 'grayscale(1)';
  }
}

function mostrarApp() {
  if (loginSection) loginSection.style.display = 'none';
  if (mainContent) mainContent.style.display = '';
  mostrarMenu();
  actualizarUIUsuario();
}

function actualizarUIUsuario() {
  // Botón Admin según rol
  if (adminMenuBtn) {
    if (!usuarioActual || (usuarioActual.rol !== 'Admin' && usuarioActual.tipo !== 'SuperAdmin')) {
      adminMenuBtn.style.display = 'none';
    } else {
      adminMenuBtn.style.display = '';
    }
  }
  // Botón cerrar sesión
  if (logoutBtn) {
    logoutBtn.style.display = usuarioActual ? '' : 'none';
  }
}

function mostrarUsuariosLogueados() {
  if (!loggedUsersList) return;
  loggedUsersList.innerHTML = '';
  // Crear tabla de usuarios
  const tabla = document.createElement('table');
  tabla.className = 'admin-usuarios-table';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr>
    <th>Usuario</th>
    <th>Rol</th>
    <th>Fecha de registro</th>
    <th>Activo desde</th>
    <th>Activo hasta</th>
    <th>Acciones</th>
  </tr>`;
  tabla.appendChild(thead);
  const tbody = document.createElement('tbody');
  usuariosLogueados.forEach(usuario => {
    if (usuario.nombre === 'Sortuzar') return; // No mostrar super admin
    const tr = document.createElement('tr');
    // Usuario
    const tdUser = document.createElement('td');
    tdUser.textContent = usuario.nombre + (usuario.bloqueado ? ' (Bloqueado)' : '');
    tr.appendChild(tdUser);
    // Rol
    const tdRol = document.createElement('td');
    tdRol.textContent = usuario.rol;
    tr.appendChild(tdRol);
    // Fecha registro
    const tdFecha = document.createElement('td');
    tdFecha.textContent = usuario.fechaRegistro || '';
    tr.appendChild(tdFecha);
    // Rango activo desde
    const tdDesde = document.createElement('td');
    const inputDesde = document.createElement('input');
    inputDesde.type = 'date';
    inputDesde.value = usuario.activoDesde || usuario.fechaRegistro || '';
    inputDesde.onchange = () => {
      usuario.activoDesde = inputDesde.value;
    };
    tdDesde.appendChild(inputDesde);
    tr.appendChild(tdDesde);
    // Rango activo hasta
    const tdHasta = document.createElement('td');
    const inputHasta = document.createElement('input');
    inputHasta.type = 'date';
    inputHasta.value = usuario.activoHasta || '';
    inputHasta.onchange = () => {
      usuario.activoHasta = inputHasta.value;
    };
    tdHasta.appendChild(inputHasta);
    tr.appendChild(tdHasta);
    // Acciones
    const tdAcciones = document.createElement('td');
    if (usuarioActual && (usuarioActual.rol === 'Admin' || usuarioActual.tipo === 'SuperAdmin') && usuario.nombre !== usuarioActual.nombre) {
      // Botón bloquear/desbloquear
      const btnBlock = document.createElement('button');
      btnBlock.textContent = usuario.bloqueado ? 'Desbloquear' : 'Bloquear';
      btnBlock.onclick = () => {
        usuario.bloqueado = !usuario.bloqueado;
        mostrarUsuariosLogueados();
      };
      tdAcciones.appendChild(btnBlock);
      // Botón dar de baja (eliminar)
      const btnDel = document.createElement('button');
      btnDel.textContent = 'Dar de baja';
      btnDel.onclick = () => {
        usuariosLogueados = usuariosLogueados.filter(u => u.nombre !== usuario.nombre);
        mostrarUsuariosLogueados();
      };
      tdAcciones.appendChild(btnDel);
    }
    tr.appendChild(tdAcciones);
    tbody.appendChild(tr);
  });
  tabla.appendChild(tbody);
  loggedUsersList.appendChild(tabla);
  // Mostrar gestión de roles y permisos solo si es admin
      // Gestión de empresas (roles)
      let empresas = window.empresas || [];
      const empresasPanel = document.getElementById('empresasGestionPanel');
      const listaEmpresas = document.getElementById('listaEmpresas');
      const formNuevaEmpresa = document.getElementById('formNuevaEmpresa');
      if (formNuevaEmpresa) {
        formNuevaEmpresa.onsubmit = function(e) {
          e.preventDefault();
          const nombre = document.getElementById('nombreEmpresaNueva').value.trim();
          if (nombre && !empresas.includes(nombre)) {
            empresas.push(nombre);
            window.empresas = empresas;
            mostrarEmpresas();
            formNuevaEmpresa.reset();
            // Actualizar select de empresas para imágenes inmediatamente
            if (typeof poblarEmpresasSelectImg === 'function') {
              poblarEmpresasSelectImg();
            }
            // Actualizar selects de empresa en usuarios y roles si existen
            mostrarUsuariosLogueados();
          }
        };
      }
      function mostrarEmpresas() {
        if (!listaEmpresas) return;
        listaEmpresas.innerHTML = '';
        empresas.forEach((nombre, idx) => {
          const li = document.createElement('li');
          li.textContent = nombre;
          li.style.padding = '6px 0';
          li.style.fontWeight = '500';
          li.style.color = '#1976d2';
          // Botón eliminar empresa
          const btnDel = document.createElement('button');
          btnDel.textContent = 'Eliminar';
          btnDel.title = 'Eliminar empresa';
          btnDel.style.marginLeft = '8px';
          btnDel.style.padding = '2px 10px';
          btnDel.style.fontSize = '13px';
          btnDel.style.background = '#fff';
          btnDel.style.border = '1px solid #d32f2f';
          btnDel.style.borderRadius = '6px';
          btnDel.style.color = '#d32f2f';
          btnDel.style.cursor = 'pointer';
          btnDel.style.verticalAlign = 'middle';
          btnDel.onmouseover = () => {
            btnDel.style.background = '#ffd6d6';
            btnDel.style.color = '#b71c1c';
          };
          btnDel.onmouseout = () => {
            btnDel.style.background = '#fff';
            btnDel.style.color = '#d32f2f';
          };
          btnDel.onclick = () => {
            if (confirm('¿Seguro que quieres eliminar esta empresa?')) {
              li.style.transition = 'background 0.4s, opacity 0.4s';
              li.style.background = '#ffd6d6';
              li.style.opacity = '0.5';
              setTimeout(() => {
                empresas.splice(idx, 1);
                window.empresas = empresas;
                mostrarEmpresas();
                // Confirmación visual
                const confirmDiv = document.createElement('div');
                confirmDiv.textContent = 'Empresa eliminada correctamente.';
                confirmDiv.style.position = 'fixed';
                confirmDiv.style.top = '24px';
                confirmDiv.style.right = '24px';
                confirmDiv.style.background = '#d32f2f';
                confirmDiv.style.color = '#fff';
                confirmDiv.style.padding = '12px 24px';
                confirmDiv.style.borderRadius = '8px';
                confirmDiv.style.fontWeight = 'bold';
                confirmDiv.style.boxShadow = '0 2px 8px #0002';
                confirmDiv.style.zIndex = '9999';
                document.body.appendChild(confirmDiv);
                setTimeout(() => { confirmDiv.remove(); }, 1800);
              }, 400);
            }
          };
          li.appendChild(btnDel);
          listaEmpresas.appendChild(li);
        });
      }
      mostrarEmpresas();

      // Usar empresas como opciones de roles in imágenes y usuarios
      // Actualizar inputs de roles en tablas para usar select con empresas
    // Lógica para cargar nuevas imágenes en planillas
    const formNuevaImagen = document.getElementById('formNuevaImagenPlanilla');
    // Poblar select de empresas en el formulario de imagen
    const selectEmpresaImg = document.getElementById('empresaImagenPlanilla');
    function poblarEmpresasSelectImg() {
      if (!selectEmpresaImg) return;
      selectEmpresaImg.innerHTML = '';
      (window.empresas || []).forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp;
        opt.textContent = emp;
        selectEmpresaImg.appendChild(opt);
      });
    }
    poblarEmpresasSelectImg();
    if (formNuevaImagen) {
      formNuevaImagen.onsubmit = function(e) {
        e.preventDefault();
        const inputFile = document.getElementById('inputImagenPlanilla');
        const nombreInput = document.getElementById('nombreImagenPlanilla');
        const empresaInput = document.getElementById('empresaImagenPlanilla');
        const errorDiv = document.getElementById('errorImagenPlanilla');
        errorDiv.style.display = 'none';
        if (!inputFile.files[0]) {
          errorDiv.textContent = 'Debes seleccionar una imagen.';
          errorDiv.style.display = 'block';
          return;
        }
        const nombre = nombreInput.value.trim();
        if (!nombre) {
          errorDiv.textContent = 'Debes ingresar un nombre para la imagen.';
          errorDiv.style.display = 'block';
          return;
        }
        const empresa = empresaInput.value;
        if (!empresa) {
          errorDiv.textContent = 'Debes seleccionar una empresa.';
          errorDiv.style.display = 'block';
          return;
        }
        // Guardar la imagen en memoria (no en disco, solo en la sesión)
        const reader = new FileReader();
        reader.onload = function(ev) {
          // Simular guardado en "planillas informes" agregando al arreglo
          archivosEsquemas.push({ nombre, roles: [empresa], base64: ev.target.result });
          mostrarEsquemasDisponibles();
          errorDiv.style.display = 'none';
          formNuevaImagen.reset();
          // Animación y confirmación visual al agregar
          const esquemasPanel = document.getElementById('rolesGestionPanel');
          if (esquemasPanel) {
            esquemasPanel.style.transition = 'box-shadow 0.4s';
            esquemasPanel.style.boxShadow = '0 0 16px 2px #1976d2';
            setTimeout(() => { esquemasPanel.style.boxShadow = ''; }, 800);
            // Actualizar el panel de imágenes inmediatamente
            mostrarUsuariosLogueados();
          }
          const confirmDiv = document.createElement('div');
          confirmDiv.textContent = 'Imagen cargada y empresa asignada correctamente.';
          confirmDiv.style.position = 'fixed';
          confirmDiv.style.top = '24px';
          confirmDiv.style.right = '24px';
          confirmDiv.style.background = '#1976d2';
          confirmDiv.style.color = '#fff';
          confirmDiv.style.padding = '12px 24px';
          confirmDiv.style.borderRadius = '8px';
          confirmDiv.style.fontWeight = 'bold';
          confirmDiv.style.boxShadow = '0 2px 8px #0002';
          confirmDiv.style.zIndex = '9999';
          document.body.appendChild(confirmDiv);
          setTimeout(() => { confirmDiv.remove(); }, 1800);
        };
        reader.readAsDataURL(inputFile.files[0]);
      };
    }
  const rolesGestionPanel = document.getElementById('rolesGestionPanel');
  if (rolesGestionPanel && usuarioActual && (usuarioActual.rol === 'Admin' || usuarioActual.tipo === 'SuperAdmin')) {
    rolesGestionPanel.innerHTML = '<h5 style="margin-bottom:8px;">Imágenes predeterminadas y roles permitidos</h5>';
    const tablaImg = document.createElement('table');
    tablaImg.style.width = '100%';
    tablaImg.style.marginBottom = '12px';
    tablaImg.innerHTML = `<thead><tr><th style="text-align:left;padding-left:16px;">Imagen</th><th style="text-align:left;">Empresas permitidas</th></tr></thead>`;
    const tbodyImg = document.createElement('tbody');
    archivosEsquemas.forEach((img, idx) => {
      const tr = document.createElement('tr');
      // Imagen y botón eliminar
      const tdNombre = document.createElement('td');
      tdNombre.style.paddingLeft = '16px';
      tdNombre.style.verticalAlign = 'middle';
      tdNombre.textContent = img.nombre + ' ';
      const btnDelImg = document.createElement('button');
      btnDelImg.textContent = 'Eliminar';
      btnDelImg.title = 'Eliminar imagen';
      btnDelImg.className = 'btn-eliminar-global';
      btnDelImg.onclick = () => {
        if (confirm('¿Seguro que quieres eliminar esta imagen?')) {
          tr.style.transition = 'background 0.4s, opacity 0.4s';
          tr.style.background = '#ffd6d6';
          tr.style.opacity = '0.5';
          setTimeout(() => {
            archivosEsquemas.splice(idx, 1);
            mostrarEsquemasDisponibles();
            // Refrescar el panel de roles e imágenes
            if (typeof mostrarUsuariosLogueados === 'function') {
              mostrarUsuariosLogueados();
            }
            // Refrescar el panel de roles si existe
            const rolesGestionPanel = document.getElementById('rolesGestionPanel');
            if (rolesGestionPanel) {
              rolesGestionPanel.innerHTML = '';
              mostrarUsuariosLogueados();
            }
            // Confirmación visual
            const confirmDiv = document.createElement('div');
            confirmDiv.textContent = 'Imagen eliminada correctamente.';
            confirmDiv.style.position = 'fixed';
            confirmDiv.style.top = '24px';
            confirmDiv.style.right = '24px';
            confirmDiv.style.background = '#d32f2f';
            confirmDiv.style.color = '#fff';
            confirmDiv.style.padding = '12px 24px';
            confirmDiv.style.borderRadius = '8px';
            confirmDiv.style.fontWeight = 'bold';
            confirmDiv.style.boxShadow = '0 2px 8px #0002';
            confirmDiv.style.zIndex = '9999';
            document.body.appendChild(confirmDiv);
            setTimeout(() => { confirmDiv.remove(); }, 1800);
          }, 400);
        }
      };
      tdNombre.appendChild(btnDelImg);
      // Roles como texto simple
      const tdRoles = document.createElement('td');
      tdRoles.style.verticalAlign = 'middle';
      tdRoles.textContent = img.roles ? img.roles.join(', ') : '';
      tr.appendChild(tdNombre);
      tr.appendChild(tdRoles);
      tbodyImg.appendChild(tr);
    });
    tablaImg.appendChild(tbodyImg);
    rolesGestionPanel.appendChild(tablaImg);

    rolesGestionPanel.innerHTML += '<h5 style="margin-bottom:8px;">Usuarios y roles asignados</h5>';
    const tablaUsr = document.createElement('table');
    tablaUsr.style.width = '100%';
    tablaUsr.style.marginBottom = '12px';
    tablaUsr.innerHTML = `<thead><tr><th style="text-align:left;padding-left:16px;">Usuario</th><th style="text-align:left;">Tipo</th><th style="text-align:left;">Empresa</th></tr></thead>`;
    const tbodyUsr = document.createElement('tbody');
    usuariosLogueados.forEach((usr, idx) => {
        if (usr.nombre === 'Sortuzar') return; // No mostrar super admin
      const tr = document.createElement('tr');
      const tdNombre = document.createElement('td');
      tdNombre.style.paddingLeft = '16px';
      tdNombre.style.verticalAlign = 'middle';
      tdNombre.textContent = usr.nombre;
      // Select tipo
      const tdTipo = document.createElement('td');
      tdTipo.style.verticalAlign = 'middle';
      const selectTipo = document.createElement('select');
      selectTipo.style.padding = '2px 10px';
      selectTipo.style.fontSize = '13px';
      selectTipo.style.borderRadius = '6px';
      selectTipo.style.border = '1px solid #1976d2';
      selectTipo.style.background = '#fff';
      selectTipo.style.color = '#1976d2';
      ['Usuario','Admin'].forEach(tipo => {
        const opt = document.createElement('option');
        opt.value = tipo;
        opt.textContent = tipo;
        if (usr.tipo === tipo) opt.selected = true;
        selectTipo.appendChild(opt);
      });
      selectTipo.onchange = () => {
        usuariosLogueados[idx].tipo = selectTipo.value;
        mostrarUsuariosLogueados();
      };
      tdTipo.appendChild(selectTipo);
      // Select empresa
      const tdEmpresa = document.createElement('td');
      tdEmpresa.style.verticalAlign = 'middle';
      const selectEmpresa = document.createElement('select');
      selectEmpresa.style.padding = '2px 10px';
      selectEmpresa.style.fontSize = '13px';
      selectEmpresa.style.borderRadius = '6px';
      selectEmpresa.style.border = '1px solid #1976d2';
      selectEmpresa.style.background = '#fff';
      selectEmpresa.style.color = '#1976d2';
      (empresas || []).forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp;
        opt.textContent = emp;
        if (usr.empresa === emp) opt.selected = true;
        selectEmpresa.appendChild(opt);
      });
      selectEmpresa.onchange = () => {
        usuariosLogueados[idx].empresa = selectEmpresa.value;
        mostrarUsuariosLogueados();
      };
      tdEmpresa.appendChild(selectEmpresa);
      tr.appendChild(tdNombre);
      tr.appendChild(tdTipo);
      tr.appendChild(tdEmpresa);
      tbodyUsr.appendChild(tr);
    });
    tablaUsr.appendChild(tbodyUsr);
    rolesGestionPanel.appendChild(tablaUsr);
  }
}

if (adminMenuBtn) {
  adminMenuBtn.addEventListener('click', () => {
    document.querySelectorAll('.panel-lateral').forEach(panel => {
      if (panel !== adminPanel) panel.classList.add('oculto');
    });
    // Crear overlay modal si no existe
    let overlay = document.getElementById('adminModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'adminModalOverlay';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
    if (adminPanel) {
      adminPanel.classList.remove('oculto');
      adminPanel.classList.add('modal');
      overlay.appendChild(adminPanel);
    }
    if (mainContent) mainContent.style.display = 'none';
    mostrarUsuariosLogueados();
    // Botón para cerrar modal
    if (!document.getElementById('cerrarAdminPanel')) {
      const btnCerrar = document.createElement('button');
      btnCerrar.id = 'cerrarAdminPanel';
      btnCerrar.textContent = 'Cerrar';
      btnCerrar.onclick = () => {
        adminPanel.classList.add('oculto');
        adminPanel.classList.remove('modal');
        overlay.style.display = 'none';
        if (mainContent) mainContent.style.display = '';
        btnCerrar.remove();
        document.body.appendChild(adminPanel); // restaurar panel al body
      };
      adminPanel.appendChild(btnCerrar);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value.trim();
    const encontrado = usuariosLogueados.find(u => u.nombre.trim().toLowerCase() === user && u.pass.trim() === pass);
    if (encontrado && !encontrado.bloqueado) {
      usuarioActual = encontrado;
      mostrarApp();
      mostrarUsuariosLogueados();
      if (loginError) loginError.style.display = 'none';
    } else if (encontrado && encontrado.bloqueado) {
      if (loginError) {
        loginError.textContent = 'Usuario bloqueado. Contacta al administrador.';
        loginError.style.display = 'block';
      }
    } else {
      if (loginError) {
        loginError.textContent = 'Usuario o contraseña incorrectos';
        loginError.style.display = 'block';
      }
    }
  });
}

if (registerUserForm) {
  // Poblar select de empresas al mostrar el panel
  const selectEmpresa = document.getElementById('newEmpresa');
  function poblarEmpresasSelect() {
    if (!selectEmpresa) return;
    selectEmpresa.innerHTML = '';
    (window.empresas || []).forEach(emp => {
      const opt = document.createElement('option');
      opt.value = emp;
      opt.textContent = emp;
      selectEmpresa.appendChild(opt);
    });
  }
  poblarEmpresasSelect();
  registerUserForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!usuarioActual || (usuarioActual.rol !== 'Admin' && usuarioActual.tipo !== 'SuperAdmin')) {
      if (registerError) {
        registerError.textContent = 'Solo Admin o SuperAdmin pueden registrar usuarios';
        registerError.style.display = 'block';
      }
      return;
    }
    const nombre = document.getElementById('newUser').value.trim();
    const pass = document.getElementById('newPass').value;
    const tipo = document.getElementById('newTipo').value;
    const empresa = selectEmpresa.value;
    if (usuariosLogueados.some(u => u.nombre === nombre)) {
      if (registerError) {
        registerError.textContent = 'El usuario ya existe';
        registerError.style.display = 'block';
      }
      return;
    }
    const fechaRegistro = new Date().toISOString().split('T')[0];
    const nuevoUsuario = { nombre, pass, tipo, empresa, bloqueado: false, fechaRegistro };
    usuariosLogueados.push(nuevoUsuario);
    // Guardar también en IndexedDB
    if (typeof guardarUsuarioEnIndexedDB === 'function') {
      guardarUsuarioEnIndexedDB(nuevoUsuario).catch(err => console.error('Error guardando usuario en IndexedDB', err));
    }
    if (registerError) registerError.style.display = 'none';
    mostrarUsuariosLogueados();
    registerUserForm.reset();
  });
}

// Funciones IndexedDB para usuarios usando la misma base de datos
async function guardarUsuarioEnIndexedDB(usuario) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_USUARIOS, 'readwrite');
    const store = tx.objectStore(STORE_USUARIOS);
    store.put(usuario);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function cargarUsuariosDesdeIndexedDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_USUARIOS, 'readonly');
    const store = tx.objectStore(STORE_USUARIOS);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function inicializarUsuarios() {
  try {
    let usuarios = await cargarUsuariosDesdeIndexedDB();
    if (!usuarios || usuarios.length === 0) {
      usuarios = [
        { nombre: 'Sortuzar', pass: 'admin123', tipo: 'SuperAdmin', empresa: '', bloqueado: false, fechaRegistro: '2025-11-30' },
        { nombre: 'María Pérez', pass: 'usuario1', rol: 'Usuario', bloqueado: false, fechaRegistro: '2025-11-30' },
        { nombre: 'Carlos Soto', pass: 'usuario2', rol: 'Usuario', bloqueado: false, fechaRegistro: '2025-11-30' }
      ];
      // Usuario fijo solicitado: prueba1 / Prueba_2025
      usuarios.push({ nombre: 'prueba1', pass: 'Prueba_2025', rol: 'Usuario', bloqueado: false, fechaRegistro: '2025-12-02' });
      for (const u of usuarios) {
        await guardarUsuarioEnIndexedDB(u);
      }
    } else {
      // Asegurar que exista el usuario prueba1 aunque ya haya datos
      const existePrueba1 = usuarios.some(u => u.nombre === 'prueba1');
      if (!existePrueba1) {
        const nuevo = { nombre: 'prueba1', pass: 'Prueba_2025', rol: 'Usuario', bloqueado: false, fechaRegistro: '2025-12-02' };
        await guardarUsuarioEnIndexedDB(nuevo);
        usuarios.push(nuevo);
      }
    }
    usuariosLogueados = usuarios;
  } catch (e) {
    console.error('Error inicializando usuarios desde IndexedDB', e);
    usuariosLogueados = [
      { nombre: 'Sortuzar', pass: 'admin123', tipo: 'SuperAdmin', empresa: '', bloqueado: false, fechaRegistro: '2025-11-30' },
      { nombre: 'María Pérez', pass: 'usuario1', rol: 'Usuario', bloqueado: false, fechaRegistro: '2025-11-30' },
      { nombre: 'Carlos Soto', pass: 'usuario2', rol: 'Usuario', bloqueado: false, fechaRegistro: '2025-11-30' },
      { nombre: 'prueba1', pass: 'Prueba_2025', rol: 'Usuario', bloqueado: false, fechaRegistro: '2025-12-02' }
    ];
  }
}

// Inicializar usuarios y luego mostrar login
inicializarUsuarios().finally(() => {
  mostrarLogin();
});
const verRecordatorios = document.getElementById('verRecordatorios');
const badgeRecordatorios = document.getElementById('badgeRecordatorios');
const exportarPDF = document.getElementById('exportarPDF');
const verEstadoCache = document.getElementById('verEstadoCache');
const limpiarCachePWA = document.getElementById('limpiarCachePWA');
const verEstadoSync = document.getElementById('verEstadoSync');
const forzarSync = document.getElementById('forzarSync');
const limpiarColaSync = document.getElementById('limpiarColaSync');

// Inputs para datos del informe
const inputPiloto = document.getElementById('inputPiloto');
const inputFecha = document.getElementById('inputFecha');
const inputJaula = document.getElementById('inputJaula');
const inputArea = document.getElementById('inputArea');

let imagenLineaActual = null;
let contadorNumerosFotos = 1; // Contador global para mantener numeración continua

// Overlay para cerrar paneles
const overlayPanel = document.getElementById('overlayPanel');

// ================== INDEXEDDB PARA INFORMES GRANDES Y USUARIOS ==================
const DB_NAME = 'bitacoraDB';
const DB_VERSION = 2; // subir versión para asegurar store de usuarios
const STORE_INFORMES = 'informesGuardados';
const STORE_USUARIOS = 'usuarios';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_INFORMES)) {
        const store = db.createObjectStore(STORE_INFORMES, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_USUARIOS)) {
        db.createObjectStore(STORE_USUARIOS, { keyPath: 'nombre' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Error abriendo IndexedDB'));
  });
}

async function addInformeIndexedDB(informe) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_INFORMES, 'readwrite');
    const store = tx.objectStore(STORE_INFORMES);
    const req = store.add(informe);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Error guardando informe en IndexedDB'));
  });
}

async function getInformesIndexedDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_INFORMES, 'readonly');
    const store = tx.objectStore(STORE_INFORMES);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error || new Error('Error leyendo informes desde IndexedDB'));
  });
}

async function getInformeByTimestampIndexedDB(timestamp) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_INFORMES, 'readonly');
    const store = tx.objectStore(STORE_INFORMES);
    const index = store.index('timestamp');
    const req = index.get(timestamp);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error || new Error('Error buscando informe en IndexedDB'));
  });
}

async function updateInformeIndexedDB(timestamp, cambios) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_INFORMES, 'readwrite');
    const store = tx.objectStore(STORE_INFORMES);
    const index = store.index('timestamp');
    const getReq = index.get(timestamp);
    getReq.onsuccess = () => {
      const existente = getReq.result;
      if (!existente) {
        reject(new Error('Informe no encontrado para actualizar'));
        return;
      }
      const actualizado = { ...existente, ...cambios };
      const putReq = store.put(actualizado);
      putReq.onsuccess = () => resolve(actualizado);
      putReq.onerror = () => reject(putReq.error || new Error('Error actualizando informe en IndexedDB'));
    };
    getReq.onerror = () => reject(getReq.error || new Error('Error leyendo informe en IndexedDB'));
  });
}

// Actualizar bitácora de un informe aplicando reparaciones desde recordatorios
async function aplicarReparacionesEnInforme(timestamp, opciones) {
  const { repararRoturas, repararAnomalias } = opciones || {};
  if (!repararRoturas && !repararAnomalias) return;

  const informe = await getInformeByTimestampIndexedDB(timestamp);
  if (!informe || !informe.contenido) return;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = informe.contenido;

  const tabla = tempDiv.querySelector('.tabla-bitacora tbody');
  if (!tabla) return;

  // Recorremos todas las filas y aplicamos la lógica de "pendiente pasa a reparada"
  tabla.querySelectorAll('tr').forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    if (celdas.length < 9) return;

    if (repararRoturas) {
      const rotRepCelda = celdas[4];
      const rotPenCelda = celdas[5];
      const rotRep = parseInt(rotRepCelda.textContent.trim()) || 0;
      const rotPen = parseInt(rotPenCelda.textContent.trim()) || 0;
      if (rotPen > 0) {
        rotRepCelda.textContent = String(rotRep + rotPen);
        rotPenCelda.textContent = '0';
      }
    }

    if (repararAnomalias) {
      const objRepCelda = celdas[7];
      const objPenCelda = celdas[8];
      const objRep = parseInt(objRepCelda.textContent.trim()) || 0;
      const objPen = parseInt(objPenCelda.textContent.trim()) || 0;
      if (objPen > 0) {
        objRepCelda.textContent = String(objRep + objPen);
        objPenCelda.textContent = '0';
      }
    }
  });

  // Guardar cambios en IndexedDB manteniendo mismo timestamp
  await updateInformeIndexedDB(timestamp, { contenido: tempDiv.innerHTML });
}

// Settings (persistidos en localStorage)
const DEFAULT_SETTINGS = { 
  defaultColor: '#1976d2', 
  showNumbers: true, 
  logoLeft: null, 
  logoRight: null,
  pilotoDefault: '',
  fechaDefault: '29-10-2025',
  centroDefault: ''
};
let settings = loadSettings();

function loadSettings() {
  try {
    const raw = localStorage.getItem('reporteSettings');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings() {
  try {
    localStorage.setItem('reporteSettings', JSON.stringify(settings));
  } catch (e) {
    console.warn('No se pudo guardar settings', e);
  }
}

  // ===== Crear bitácora inicial automáticamente
  function crearBitacoraInicial() {
    const hoja = document.createElement('div');
    hoja.className = 'hoja-bitacora hoja-fotos';
    hoja.id = 'bitacora-principal';
    hoja.style.transform = 'scale(0.98)';
    hoja.style.transformOrigin = 'top center';
    // encabezado usando settings (si existen) o assets por defecto
    const encabezado = document.createElement('div');
    encabezado.className = 'encabezado-hoja';
    const leftLogo = settings.logoLeft || 'assets/logo-izquierdo.png';
    const rightLogo = settings.logoRight || 'assets/logo-derecho.png';
    encabezado.innerHTML = `
      <div class="encabezado-fila">
        <img src="${leftLogo}" class="logo-izq" alt="Logo Izquierdo" />
        <div class="encabezado-texto">
          <h2>Bitácora de Inspección</h2>
          <p>Registro diario</p>
        </div>
        <img src="${rightLogo}" class="logo-der" alt="Logo Derecho" />
      </div>
    `;
    hoja.appendChild(encabezado);
    // contenido: tabla completa en un solo bloque
    const contenido = document.createElement('div');
    contenido.className = 'bloque-fotos';
    contenido.innerHTML = `
      <div class="hoja-bitacora-contenido">
        <table class="tabla-bitacora">
          <thead>
            <tr class="top-header">
              <th rowspan="2">Dia Turno</th>
              <th rowspan="2">Fecha de informe</th>
              <th rowspan="2">Area de Inspeccion</th>
              <th colspan="3">Roturas</th>
              <th colspan="3">Objetos y/o Anomalias</th>
            </tr>
            <tr class="sub-header">
              <th>Informadas</th>
              <th>Reparadas</th>
              <th>Pendientes</th>
              <th>Informadas</th>
              <th>Reparadas</th>
              <th>Pendientes</th>
            </tr>
          </thead>
          <tbody>
            ${Array.from({ length: 15 }).map((_, i) => `
              <tr>
                <td class="numero-dia">${i + 1}</td>
                <td data-col="fecha">
                  <input type="date" class="fecha-bitacora" style="width:100%; box-sizing:border-box; border:none; padding:4px;" />
                </td>
                <td contenteditable="true" class="editable-cell" data-col="area"></td>
                <td contenteditable="true" class="editable-cell" data-col="rot_informadas"></td>
                <td contenteditable="true" class="editable-cell" data-col="rot_reparadas"></td>
                <td class="celda-pendiente" data-col="rot_pendientes" style="background-color: #f0f0f0; cursor: not-allowed;"></td>
                <td contenteditable="true" class="editable-cell" data-col="obj_informadas"></td>
                <td contenteditable="true" class="editable-cell" data-col="obj_reparadas"></td>
                <td class="celda-pendiente" data-col="obj_pendientes" style="background-color: #f0f0f0; cursor: not-allowed;"></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="abrev" style="margin-top:18px;">
          <p><strong>Abreviaturas en áreas de Inspección Loberos:</strong> CB (cabecera malla Lobera), FN (Fondo malla Lobera), LT (Lateral malla Lobera), MP (mamparo malla Lobera)</p>
          <p><strong>Abreviaturas en áreas de Inspección Peceras:</strong> CP (Cara de malla Pecera), FP (Fondo malla Pecera)</p>
        </div>
      </div>
    `;
    hoja.appendChild(contenido);
    return hoja;
  }

  // Insertar bitácora al final siempre
  function asegurarBitacoraAlFinal() {
    let bitacora = document.getElementById('bitacora-principal');
    if (!bitacora) {
      bitacora = crearBitacoraInicial();
    }
    // Mover al final del panelLineas
    panelLineas.appendChild(bitacora);
  }

  // Función helper para insertar elementos antes de la bitácora de inspección
  function insertarAntesBitacora(elemento) {
    const bitacora = document.getElementById('bitacora-principal');
    if (bitacora) {
      panelLineas.insertBefore(elemento, bitacora);
    } else {
      panelLineas.appendChild(elemento);
    }
  }

  // Crear bitácora inicial
  asegurarBitacoraAlFinal();

  // Observar cambios en panelLineas para mantener bitácora al final
  let observerActivo = true;
  let editandoBitacora = false;
  
  const observer = new MutationObserver((mutations) => {
    // No reaccionar si se está editando la bitácora
    if (editandoBitacora) return;
    
    // Solo reaccionar a adiciones/eliminaciones de nodos, no a cambios de texto
    const hayNodosNuevos = mutations.some(m => 
      m.addedNodes.length > 0 || m.removedNodes.length > 0
    );
    if (observerActivo && hayNodosNuevos) {
      observerActivo = false;
      setTimeout(() => {
        asegurarBitacoraAlFinal();
        observerActivo = true;
      }, 100);
    }
  });
  observer.observe(panelLineas, { childList: true, subtree: false });
  
  // Detectar cuando se está editando la bitácora
  document.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('editable-cell')) {
      editandoBitacora = true;
    }
  });
  
  document.addEventListener('focusout', (e) => {
    if (e.target.classList.contains('editable-cell')) {
      // Pequeño delay para permitir cambio entre celdas
      setTimeout(() => {
        if (!document.activeElement?.classList.contains('editable-cell')) {
          editandoBitacora = false;
        }
      }, 50);
    }
  });

  // ===== BOTÓN: Agregar bitácora adicional si es necesario
  if (addBitacoraBtn) {
    addBitacoraBtn.addEventListener('click', () => {
      const hoja = document.createElement('div');
      hoja.className = 'hoja-bitacora hoja-fotos';
      hoja.style.transform = 'scale(0.98)';
      hoja.style.transformOrigin = 'top center';

      const encabezado = document.createElement('div');
      encabezado.className = 'encabezado-hoja';
      const leftLogo = settings.logoLeft || 'assets/logo-izquierdo.png';
      const rightLogo = settings.logoRight || 'assets/logo-derecho.png';
      encabezado.innerHTML = `
        <div class="encabezado-fila">
          <img src="${leftLogo}" class="logo-izq" alt="Logo Izquierdo" />
          <div class="encabezado-texto">
            <h2>Bitácora de Inspección</h2>
            <p>Registro diario</p>
          </div>
          <img src="${rightLogo}" class="logo-der" alt="Logo Derecho" />
        </div>
      `;
      hoja.appendChild(encabezado);

      const contenido = document.createElement('div');
      contenido.className = 'bloque-fotos';
      contenido.innerHTML = `
        <div class="hoja-bitacora-contenido">
          <table class="tabla-bitacora">
            <thead>
              <tr class="top-header">
                <th rowspan="2">Dia Turno</th>
                <th rowspan="2">Fecha de informe</th>
                <th rowspan="2">Area de Inspeccion</th>
                <th colspan="3">Roturas</th>
                <th colspan="3">Objetos y/o Anomalias</th>
              </tr>
              <tr class="sub-header">
                <th>Informadas</th>
                <th>Reparadas</th>
                <th>Pendientes</th>
                <th>Informadas</th>
                <th>Reparadas</th>
                <th>Pendientes</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({ length: 15 }).map((_, i) => `
                <tr>
                  <td class="numero-dia">${i + 1}</td>
                  <td contenteditable="true" class="editable-cell" data-col="fecha"></td>
                  <td contenteditable="true" class="editable-cell" data-col="area"></td>
                  <td contenteditable="true" class="editable-cell" data-col="rot_informadas"></td>
                  <td contenteditable="true" class="editable-cell" data-col="rot_reparadas"></td>
                  <td class="celda-pendiente" data-col="rot_pendientes" style="background-color: #f0f0f0; cursor: not-allowed;"></td>
                  <td contenteditable="true" class="editable-cell" data-col="obj_informadas"></td>
                  <td contenteditable="true" class="editable-cell" data-col="obj_reparadas"></td>
                  <td class="celda-pendiente" data-col="obj_pendientes" style="background-color: #f0f0f0; cursor: not-allowed;"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="abrev" style="margin-top:18px;">
            <p><strong>Abreviaturas en áreas de Inspección Loberos:</strong> CB (cabecera malla Lobera), FN (Fondo malla Lobera), LT (Lateral malla Lobera), MP (mamparo malla Lobera)</p>
            <p><strong>Abreviaturas en áreas de Inspección Peceras:</strong> CP (Cara de malla Pecera), FP (Fondo malla Pecera)</p>
          </div>
        </div>
      `;
      hoja.appendChild(contenido);
      // Insertar antes de la bitácora principal para que la principal siempre esté al final
      const bitacoraPrincipal = document.getElementById('bitacora-principal');
      if (bitacoraPrincipal) {
        panelLineas.insertBefore(hoja, bitacoraPrincipal);
      } else {
        panelLineas.appendChild(hoja);
      }
      applySettingsToUI();
      hoja.scrollIntoView({ behavior: 'smooth' });
    });
  }
// Aplicar settings a la UI: logos y comportamiento de números
function applySettingsToUI() {
  // logos: si hay settings, aplicar a todas las instancias
  // if settings.logoLeft is an empty string => explicitly removed
  if (settings.logoLeft === '') {
    document.querySelectorAll('.logo-izq').forEach(img => img.src = '');
  } else if (settings.logoLeft) {
    document.querySelectorAll('.logo-izq').forEach(img => img.src = settings.logoLeft);
  }
  if (settings.logoRight === '') {
    document.querySelectorAll('.logo-der').forEach(img => img.src = '');
  } else if (settings.logoRight) {
    document.querySelectorAll('.logo-der').forEach(img => img.src = settings.logoRight);
  }

  // números: color y visibilidad
  document.querySelectorAll('.numero-foto, .numero-interactivo').forEach(el => {
    el.style.backgroundColor = settings.defaultColor;
    el.style.display = settings.showNumbers ? '' : 'none';
  });

  // actualizar inputs UI si existen
  if (defaultColorInput) defaultColorInput.value = settings.defaultColor;
  if (showNumbersInput) showNumbersInput.checked = !!settings.showNumbers;
  if (previewLogoLeft && settings.logoLeft) previewLogoLeft.src = settings.logoLeft;
  if (previewLogoRight && settings.logoRight) previewLogoRight.src = settings.logoRight;
  
  // actualizar campos de configuración de encabezado
  if (configPiloto) configPiloto.value = settings.pilotoDefault || DEFAULT_SETTINGS.pilotoDefault;
  if (configFecha) configFecha.value = settings.fechaDefault || DEFAULT_SETTINGS.fechaDefault;
  if (configCentro) configCentro.value = settings.centroDefault || DEFAULT_SETTINGS.centroDefault;
  
  // Llenar automáticamente la hoja índice con nombre y centro
  const operadorInput = document.getElementById('operadorInput');
  const centroInputIndice = document.getElementById('centroInput');
  
  if (operadorInput && settings.pilotoDefault) {
    operadorInput.value = settings.pilotoDefault;
  }
  if (centroInputIndice && settings.centroDefault) {
    centroInputIndice.value = settings.centroDefault;
  }
}

// init: almacenar src originales de logos para fallback
document.querySelectorAll('.logo-izq').forEach(img => {
  if (!img.dataset.originalSrc) img.dataset.originalSrc = img.src;
});
document.querySelectorAll('.logo-der').forEach(img => {
  if (!img.dataset.originalSrc) img.dataset.originalSrc = img.src;
});

// aplicar settings guardados al inicio
applySettingsToUI();

// Limpiar celdas de pendientes al cargar
document.querySelectorAll('.celda-pendiente').forEach(celda => {
  celda.textContent = '';
});

// ========== SINCRONIZACIÓN DE ENCABEZADOS ==========
// Función para sincronizar valores de encabezados entre todas las hojas
function sincronizarEncabezados(campo, valor) {
  document.querySelectorAll(`[data-sync="${campo}"]`).forEach(input => {
    if (input.value !== valor) {
      input.value = valor;
    }
  });
}

// Agregar event listeners para sincronización en tiempo real
document.addEventListener('input', (e) => {
  if (e.target.dataset.sync) {
    const campo = e.target.dataset.sync;
    const valor = e.target.value;
    sincronizarEncabezados(campo, valor);
  }
  
  // Calcular automáticamente pendientes en la bitácora (acumulativo)
  if (e.target.classList.contains('editable-cell')) {
    const col = e.target.dataset.col;
    if (col === 'rot_informadas' || col === 'rot_reparadas' || col === 'obj_informadas' || col === 'obj_reparadas') {
      const tabla = e.target.closest('table');
      if (tabla) {
        const filas = Array.from(tabla.querySelectorAll('tbody tr'));
        let pendientesRoturasAcum = 0;
        let pendientesObjetosAcum = 0;
        
        filas.forEach(fila => {
          const celdas = fila.querySelectorAll('td');
          if (celdas.length >= 9) {
            const textoRotInf = celdas[3]?.textContent.trim() || '';
            const textoRotRep = celdas[4]?.textContent.trim() || '';
            const textoObjInf = celdas[6]?.textContent.trim() || '';
            const textoObjRep = celdas[7]?.textContent.trim() || '';
            
            const rotInformadas = parseInt(textoRotInf) || 0;
            const rotReparadas = parseInt(textoRotRep) || 0;
            const objInformadas = parseInt(textoObjInf) || 0;
            const objReparadas = parseInt(textoObjRep) || 0;
            
            // Verificar si hay datos en esta fila
            const hayDatosRoturas = textoRotInf !== '' || textoRotRep !== '';
            const hayDatosObjetos = textoObjInf !== '' || textoObjRep !== '';
            
            // Acumular pendientes
            if (hayDatosRoturas) {
              pendientesRoturasAcum += rotInformadas - rotReparadas;
              pendientesRoturasAcum = Math.max(0, pendientesRoturasAcum);
            }
            
            if (hayDatosObjetos) {
              pendientesObjetosAcum += objInformadas - objReparadas;
              pendientesObjetosAcum = Math.max(0, pendientesObjetosAcum);
            }
            
            // Actualizar celdas de pendientes SOLO en la fila actual con datos
            if (celdas[5]) {
              if (hayDatosRoturas) {
                celdas[5].textContent = pendientesRoturasAcum;
              } else {
                celdas[5].textContent = '';
              }
            }
            if (celdas[8]) {
              if (hayDatosObjetos) {
                celdas[8].textContent = pendientesObjetosAcum;
              } else {
                celdas[8].textContent = '';
              }
            }
          }
        });
      }
    }
  }
});

// ========== PROTECCIÓN DE EDICIÓN DE BITÁCORA ==========
// Evitar que eventos interfieran con la edición de celdas de bitácora
document.addEventListener('click', (e) => {
  const celda = e.target.closest('.editable-cell');
  if (celda && celda.hasAttribute('contenteditable')) {
    // Asegurar que la celda reciba el foco
    if (document.activeElement !== celda) {
      celda.focus();
    }
  }
}, true); // Use capture phase

// Función auxiliar para abrir/cerrar paneles
function abrirPanel(panel) {
  menuFlotante.classList.add('oculto');
  configMenu.classList.add('oculto');
  if (panel) {
    panel.classList.remove('oculto');
    overlayPanel.classList.remove('oculto');
  } else {
    overlayPanel.classList.add('oculto');
  }
}

function cerrarPaneles() {
  menuFlotante.classList.add('oculto');
  configMenu.classList.add('oculto');
  overlayPanel.classList.add('oculto');
}

// Cerrar paneles al hacer clic en el overlay
if (overlayPanel) {
  overlayPanel.addEventListener('click', cerrarPaneles);
}

menuToggle.addEventListener('click', () => {
  const estaAbierto = !menuFlotante.classList.contains('oculto');
  if (estaAbierto) {
    cerrarPaneles();
  } else {
    abrirPanel(menuFlotante);
  }
});

// Config menu toggle
if (configToggle && configMenu) {
  configToggle.addEventListener('click', () => {
    const estaAbierto = !configMenu.classList.contains('oculto');
    if (estaAbierto) {
      cerrarPaneles();
    } else {
      abrirPanel(configMenu);
    }
  });

  // Helpers para lectura de archivos y previews
  if (logoLeftInput) {
    logoLeftInput.addEventListener('change', () => {
      const f = logoLeftInput.files && logoLeftInput.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (e) => {
        if (previewLogoLeft) previewLogoLeft.src = e.target.result;
        // no guardar aún hasta que el usuario aplique/guarde
        previewLogoLeft.dataset.pending = e.target.result;
      };
      r.readAsDataURL(f);
    });
  }

  if (logoRightInput) {
    logoRightInput.addEventListener('change', () => {
      const f = logoRightInput.files && logoRightInput.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (e) => {
        if (previewLogoRight) previewLogoRight.src = e.target.result;
        previewLogoRight.dataset.pending = e.target.result;
      };
      r.readAsDataURL(f);
    });
  }

  // Botón para subir logos en lote: abre un input multiple y asigna el primero al izquierdo y segundo al derecho
  if (uploadLogosBtn && bulkLogoInput) {
    uploadLogosBtn.addEventListener('click', () => {
      bulkLogoInput.value = null; // reset
      bulkLogoInput.click();
    });

    bulkLogoInput.addEventListener('change', () => {
      const files = bulkLogoInput.files ? Array.from(bulkLogoInput.files) : [];
      // file[0] -> left, file[1] -> right (si existen)
      if (files[0]) {
        const r = new FileReader();
        r.onload = (e) => {
          if (previewLogoLeft) previewLogoLeft.src = e.target.result;
          if (previewLogoLeft) previewLogoLeft.dataset.pending = e.target.result;
        };
        r.readAsDataURL(files[0]);
      }
      if (files[1]) {
        const r2 = new FileReader();
        r2.onload = (e) => {
          if (previewLogoRight) previewLogoRight.src = e.target.result;
          if (previewLogoRight) previewLogoRight.dataset.pending = e.target.result;
        };
        r2.readAsDataURL(files[1]);
      }
    });
  }

  // Quitar logos: dejar src vacío y persistir si se desea
  if (removeLogosBtn) {
    removeLogosBtn.addEventListener('click', () => {
      // marcar como removidos
      settings.logoLeft = '';
      settings.logoRight = '';
      saveSettings();
      applySettingsToUI();
    });
  }

  // Restaurar originales (usar data-original-src guardado en el DOM)
  if (restoreLogosBtn) {
    restoreLogosBtn.addEventListener('click', () => {
      document.querySelectorAll('.logo-izq').forEach(img => {
        if (img.dataset.originalSrc) img.src = img.dataset.originalSrc;
      });
      document.querySelectorAll('.logo-der').forEach(img => {
        if (img.dataset.originalSrc) img.src = img.dataset.originalSrc;
      });
      // quitar cualquier logo guardado en settings para volver a originales
      settings.logoLeft = null;
      settings.logoRight = null;
      saveSettings();
      applySettingsToUI();
    });
  }

  // Aplicar sin guardar
  if (aplicarConfig) {
    aplicarConfig.addEventListener('click', () => {
      if (previewLogoLeft && previewLogoLeft.dataset.pending) settings.logoLeft = previewLogoLeft.dataset.pending;
      if (previewLogoRight && previewLogoRight.dataset.pending) settings.logoRight = previewLogoRight.dataset.pending;
      if (defaultColorInput) settings.defaultColor = defaultColorInput.value;
      if (showNumbersInput) settings.showNumbers = showNumbersInput.checked;
      if (configPiloto) settings.pilotoDefault = configPiloto.value;
      if (configFecha) settings.fechaDefault = configFecha.value;
      if (configCentro) settings.centroDefault = configCentro.value;
      applySettingsToUI();
    });
  }

  // Guardar y aplicar
  if (guardarConfig) {
    guardarConfig.addEventListener('click', () => {
      if (previewLogoLeft && previewLogoLeft.dataset.pending) settings.logoLeft = previewLogoLeft.dataset.pending;
      if (previewLogoRight && previewLogoRight.dataset.pending) settings.logoRight = previewLogoRight.dataset.pending;
      if (defaultColorInput) settings.defaultColor = defaultColorInput.value;
      if (showNumbersInput) settings.showNumbers = showNumbersInput.checked;
      if (configPiloto) settings.pilotoDefault = configPiloto.value;
      if (configFecha) settings.fechaDefault = configFecha.value;
      if (configCentro) settings.centroDefault = configCentro.value;
      saveSettings();
      applySettingsToUI();
      
      // Actualizar todos los encabezados existentes con los nuevos valores
      if (configPiloto && configPiloto.value) {
        document.querySelectorAll('[data-sync="piloto"]').forEach(input => {
          input.value = configPiloto.value;
        });
      }
      if (configFecha && configFecha.value) {
        document.querySelectorAll('[data-sync="fecha"]').forEach(input => {
          input.value = configFecha.value;
        });
      }
      if (configCentro && configCentro.value) {
        document.querySelectorAll('[data-sync="centro"]').forEach(input => {
          input.value = configCentro.value;
        });
      }
      
      // Actualizar también la hoja índice
      const operadorInput = document.getElementById('operadorInput');
      const centroInputIndice = document.getElementById('centroInput');
      if (operadorInput && configPiloto && configPiloto.value) {
        operadorInput.value = configPiloto.value;
      }
      if (centroInputIndice && configCentro && configCentro.value) {
        centroInputIndice.value = configCentro.value;
      }
      
      cerrarPaneles();
    });
  }
  
  // Botón para reiniciar bitácora
  if (reiniciarBitacora) {
    reiniciarBitacora.addEventListener('click', () => {
      if (confirm('⚠️ ¿Estás seguro de que quieres reiniciar la bitácora? Se borrarán todos los datos ingresados.')) {
        // Limpiar localStorage
        localStorage.removeItem('bitacoraGuardada');
        
        // Limpiar todas las celdas de la bitácora actual
        const tablaBitacora = document.querySelector('.tabla-bitacora tbody');
        if (tablaBitacora) {
          tablaBitacora.querySelectorAll('tr').forEach(tr => {
            tr.querySelectorAll('td[contenteditable="true"]').forEach(td => {
              td.textContent = '';
              td.removeAttribute('data-value');
            });
            // Limpiar también las celdas de pendientes
            tr.querySelectorAll('.celda-pendiente').forEach(td => {
              td.textContent = '';
            });
          });
        }
        
        alert('✅ Bitácora reiniciada correctamente');
        cerrarPaneles();
      }
    });
  }
  
  // ========== EVENT LISTENERS PARA PLANTILLAS ==========
  if (guardarPlantilla) {
    guardarPlantilla.addEventListener('click', guardarPlantillaBitacora);
  }
  
  if (cargarPlantilla) {
    cargarPlantilla.addEventListener('click', cargarPlantillaBitacora);
  }
  
  if (gestionarPlantillas) {
    gestionarPlantillas.addEventListener('click', gestionarPlantillasBitacora);
  }
  
  // ========== BOTONES DE MODO OFFLINE ==========
  if (verEstadoCache) {
    verEstadoCache.addEventListener('click', async () => {
      try {
        const estado = await obtenerEstadoCache();
        alert(`📊 Estado de Caché\n\n✅ Recursos en caché: ${estado.cached}\n📦 Total de recursos: ${estado.total}\n\n${estado.cached > 0 ? '✅ La aplicación funciona offline' : '⚠️ Aún no hay recursos en caché'}`);
      } catch (e) {
        alert('⚠️ No se pudo obtener el estado de la caché');
      }
    });
  }
  
  if (limpiarCachePWA) {
    limpiarCachePWA.addEventListener('click', limpiarCache);
  }
  
  // ========== BOTONES DE SINCRONIZACIÓN ==========
  if (verEstadoSync) {
    verEstadoSync.addEventListener('click', verEstadoSincronizacion);
  }
  
  if (forzarSync) {
    forzarSync.addEventListener('click', forzarSincronizacion);
  }
  
  if (limpiarColaSync) {
    limpiarColaSync.addEventListener('click', limpiarColaSincronizacion);
  }
  
  // ========== SISTEMA DE BACKUP ==========
  // Exportar backup completo
  if (exportarBackup) {
    exportarBackup.addEventListener('click', () => {
      try {
        const backup = {
          version: '1.0',
          fecha: new Date().toISOString(),
          informesGuardados: JSON.parse(localStorage.getItem('informesGuardados') || '[]'),
          bitacoraGuardada: JSON.parse(localStorage.getItem('bitacoraGuardada') || '[]'),
          borradorAutoguardado: JSON.parse(localStorage.getItem('borradorAutoguardado') || 'null'),
          settings: JSON.parse(localStorage.getItem('reporteSettings') || '{}'),
          recordatorios: JSON.parse(localStorage.getItem('recordatorios') || '[]'),
          plantillasBitacora: JSON.parse(localStorage.getItem('plantillasBitacora') || '[]')
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-informes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        mostrarNotificacion('✅ Backup descargado', 3000);
      } catch (e) {
        alert('❌ Error al crear backup: ' + e.message);
        console.error(e);
      }
    });
  }
  
  // Importar/Restaurar backup
  if (importarBackup && inputBackup) {
    importarBackup.addEventListener('click', () => {
      inputBackup.click();
    });
    
    inputBackup.addEventListener('change', () => {
      const archivo = inputBackup.files[0];
      if (!archivo) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          
          // Validar estructura del backup
          if (!backup.version || !backup.informesGuardados) {
            throw new Error('Formato de backup inválido');
          }
          
          const confirmar = confirm(
            `📂 Restaurar Backup\n\n` +
            `Fecha del backup: ${new Date(backup.fecha).toLocaleString()}\n` +
            `Informes: ${backup.informesGuardados.length}\n\n` +
            `⚠️ ADVERTENCIA: Esto reemplazará todos los datos actuales.\n\n` +
            `¿Deseas continuar?`
          );
          
          if (confirmar) {
            // Restaurar datos
            if (backup.informesGuardados) {
              localStorage.setItem('informesGuardados', JSON.stringify(backup.informesGuardados));
            }
            if (backup.bitacoraGuardada) {
              localStorage.setItem('bitacoraGuardada', JSON.stringify(backup.bitacoraGuardada));
            }
            if (backup.borradorAutoguardado) {
              localStorage.setItem('borradorAutoguardado', JSON.stringify(backup.borradorAutoguardado));
            }
            if (backup.settings) {
              localStorage.setItem('reporteSettings', JSON.stringify(backup.settings));
            }
            if (backup.recordatorios) {
              localStorage.setItem('recordatorios', JSON.stringify(backup.recordatorios));
            }
            if (backup.plantillasBitacora) {
              localStorage.setItem('plantillasBitacora', JSON.stringify(backup.plantillasBitacora));
            }
            
            mostrarNotificacion('✅ Backup restaurado correctamente', 3000);
            
            setTimeout(() => {
              if (confirm('Se recomienda recargar la página para aplicar todos los cambios. ¿Recargar ahora?')) {
                location.reload();
              }
            }, 1000);
          }
        } catch (e) {
          alert('❌ Error al restaurar backup: ' + e.message);
          console.error(e);
        }
      };
      
      reader.readAsText(archivo);
      inputBackup.value = ''; // Limpiar input
    });
  }
}

// ========== FUNCIÓN DE COMPRESIÓN DE IMÁGENES ==========
function comprimirImagen(base64String, maxWidth = 600, quality = 0.4) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Redimensionar si es necesario
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Comprimir a JPEG con calidad especificada
      const comprimida = canvas.toDataURL('image/jpeg', quality);
      resolve(comprimida);
    };
    img.src = base64String;
  });
}

lineaInput.addEventListener('change', () => {
  const archivo = lineaInput.files[0];
  if (archivo) {
    lineaEstado.textContent = `Imagen cargada: "${archivo.name}"`;
    const reader = new FileReader();
    reader.onload = function (e) {
      const imagenOriginal = e.target.result;
      
      // Preguntar si quiere recortar o usar completa
      if (confirm('¿Quieres usar la imagen completa?\n\nOK = Usar completa\nCancelar = Recortar manualmente')) {
        // Usar imagen completa directamente
        imagenLineaActual = imagenOriginal;
        vistaPrevia.innerHTML = `<img src="${imagenLineaActual}" class="imagen-previa" />`;
        crearInforme.disabled = false;
        if (agregarTextoEsquema) agregarTextoEsquema.disabled = false;
        if (cargarFotosMenu) cargarFotosMenu.disabled = false;
        if (inputFotosGlobal) inputFotosGlobal.disabled = false;
        if (labelAgregarFotos) {
          labelAgregarFotos.style.cursor = 'pointer';
          labelAgregarFotos.style.opacity = '1';
          labelAgregarFotos.style.backgroundColor = '#ffffff';
          labelAgregarFotos.removeAttribute('disabled');
        }
      } else {
        // Mostrar editor de recorte
        mostrarEditorRecorte(imagenOriginal, (imagenRecortada) => {
          imagenLineaActual = imagenRecortada;
          vistaPrevia.innerHTML = `<img src="${imagenLineaActual}" class="imagen-previa" />`;
          crearInforme.disabled = false;
          if (agregarTextoEsquema) agregarTextoEsquema.disabled = false;
          if (cargarFotosMenu) cargarFotosMenu.disabled = false;
          if (inputFotosGlobal) inputFotosGlobal.disabled = false;
          if (labelAgregarFotos) {
            labelAgregarFotos.style.cursor = 'pointer';
            labelAgregarFotos.style.opacity = '1';
            labelAgregarFotos.style.backgroundColor = '#ffffff';
            labelAgregarFotos.removeAttribute('disabled');
          }
        });
      }
    };
    reader.readAsDataURL(archivo);
  } else {
    lineaEstado.textContent = 'No se ha seleccionado ninguna imagen';
    vistaPrevia.innerHTML = '';
    crearInforme.disabled = true;
    if (agregarTextoEsquema) agregarTextoEsquema.disabled = true;
    if (inputFotosGlobal) inputFotosGlobal.disabled = true;
    if (labelAgregarFotos) {
      labelAgregarFotos.style.cursor = 'not-allowed';
      labelAgregarFotos.style.opacity = '0.5';
      labelAgregarFotos.style.backgroundColor = '#f0f0f0';
      labelAgregarFotos.setAttribute('disabled', 'disabled');
    }
  }
});

crearInforme.addEventListener('click', () => {
  if (!imagenLineaActual) return;

  const idLinea = `linea-${Date.now()}`;
  let numerosDisponibles = [];

  // Obtener valores de los inputs o de configuración guardada
  const piloto = inputPiloto ? inputPiloto.value || settings.pilotoDefault || '' : settings.pilotoDefault || '';
  const fecha = inputFecha ? inputFecha.value || settings.fechaDefault || '29-10-2025' : settings.fechaDefault || '29-10-2025';
  const centro = configCentro ? configCentro.value || settings.centroDefault || '' : settings.centroDefault || '';
  const jaula = inputJaula ? inputJaula.value || '102' : '102';
  const area = inputArea ? inputArea.value || 'CABECERA' : 'CABECERA';

  // ===== HOJA 1: LÍNEA =====
  const hojaLinea = document.createElement('div');
  hojaLinea.className = 'hoja-fotos';

  const encabezadoLinea = document.createElement('div');
  encabezadoLinea.className = 'encabezado-hoja';
  const leftLogo = settings.logoLeft || 'assets/logo-izquierdo.png';
  const rightLogo = settings.logoRight || 'assets/logo-derecho.png';
  encabezadoLinea.innerHTML = `
    <div class="encabezado-fila">
      <img src="${leftLogo}" class="logo-izq" alt="Esquema" style="max-height:60px;" />
      <div class="encabezado-texto">
        <h2>Informe de Inspección Submarina</h2>
        <div style="display:flex; gap:15px; justify-content:center; margin-bottom:4px; flex-wrap:wrap;">
          <p style="margin:0;"><strong>Piloto ROV:</strong> <input type="text" class="encabezado-input sync-piloto" data-sync="piloto" value="${piloto}" readonly style="border:none; background:transparent; font-weight:normal; width:auto; min-width:120px; cursor:default;" /></p>
          <p style="margin:0;"><strong>Fecha:</strong> <input type="text" class="encabezado-input sync-fecha" data-sync="fecha" value="${fecha}" readonly style="border:none; background:transparent; font-weight:normal; width:auto; min-width:100px; cursor:default;" /></p>
          <p style="margin:0;"><strong>Centro de Cultivo:</strong> <input type="text" class="encabezado-input sync-centro" data-sync="centro" value="${centro}" readonly style="border:none; background:transparent; font-weight:normal; width:auto; min-width:140px; cursor:default;" /></p>
        </div>
        <p style="text-align:center; margin:0;"><strong>Área:</strong> <input type="text" class="encabezado-input sync-area" data-sync="area" value="${area} - JAULA N.º${jaula}" style="border:none; background:transparent; font-weight:normal; width:auto; min-width:180px;" /></p>
      </div>
      <img src="${rightLogo}" class="logo-der" alt="Esquema" style="max-height:60px;" />
    </div>
  `;
  hojaLinea.appendChild(encabezadoLinea);

  const bloqueLinea = document.createElement('div');
  bloqueLinea.className = 'bloque-fotos';
  bloqueLinea.innerHTML = `

    <div class="linea-final" style="position: relative !important; display: flex !important; justify-content: center !important; align-items: center !important;">
      <div class="imagen-wrapper" style="position: relative !important; display: inline-block !important; max-width: 100% !important;">
        <img src="${imagenLineaActual}" class="linea-imagen" style="width: 100% !important; height: auto !important; max-height: 600px !important; object-fit: contain !important; display: block !important;" />
      </div>
      <button class="btn-cambiar-esquema" title="Cambiar esquema">🔄 Cambiar Esquema</button>
      <input type="file" accept="image/*" class="input-cambiar-esquema" style="display:none;" />
    </div>
  `;
  hojaLinea.appendChild(bloqueLinea);
  
  // Funcionalidad para cambiar el esquema
  const btnCambiarEsquema = bloqueLinea.querySelector('.btn-cambiar-esquema');
  const inputCambiarEsquema = bloqueLinea.querySelector('.input-cambiar-esquema');
  const imgEsquema = bloqueLinea.querySelector('.linea-imagen');
  
  btnCambiarEsquema.addEventListener('click', () => {
    inputCambiarEsquema.click();
  });
  
  inputCambiarEsquema.addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        const imagenOriginal = ev.target.result;
        
        // Preguntar si quiere recortar o usar completa
        if (confirm('¿Quieres usar la imagen completa?\n\nOK = Usar completa\nCancelar = Recortar manualmente')) {
          // Usar imagen completa directamente
          imgEsquema.src = imagenOriginal;
          imagenLineaActual = imagenOriginal;
        } else {
          // Mostrar editor de recorte
          mostrarEditorRecorte(imagenOriginal, (imagenRecortada) => {
            imgEsquema.src = imagenRecortada;
            imagenLineaActual = imagenRecortada;
          });
        }
      };
      reader.readAsDataURL(archivo);
    }
  });
  
  const inputContainer = document.createElement('div');
  inputContainer.className = 'contenedor-cargar-fotos';
  inputContainer.innerHTML = `
    <div class="upload-area-fotos">
      <label for="${idLinea}-input" class="upload-label-fotos">
        <div class="upload-icon">📷</div>
        <div class="upload-text">
          <span class="upload-title">Cargar fotos para esta línea</span>
          <span class="upload-subtitle">Selecciona hasta 9 imágenes por hoja</span>
        </div>
      </label>
      <input type="file" accept="image/*" multiple id="${idLinea}-input" class="input-file-hidden" />
    </div>
  `;
  hojaLinea.appendChild(inputContainer);
  insertarAntesBitacora(hojaLinea);
  
  // Habilitar los botones después de crear el informe
  if (agregarTextoEsquema) agregarTextoEsquema.disabled = false;
  if (cargarFotosMenu) cargarFotosMenu.disabled = false;
  
  const inputFotos = inputContainer.querySelector(`#${idLinea}-input`);
  const lineaFinal = bloqueLinea.querySelector('.linea-final');
  const imagenWrapper = bloqueLinea.querySelector('.imagen-wrapper');

  let contadorLocal = 1; // Contador local para números interactivos en esta línea

  // Agregar event listener ANTES de restaurar bitácora
  inputFotos.addEventListener('change', (event) => {
    console.log('Evento change disparado, archivos:', inputFotos.files.length);
    const archivos = Array.from(inputFotos.files);
    
    if (archivos.length === 0) {
      console.log('No se seleccionaron archivos');
      return;
    }
    
    console.log('Procesando archivos:', archivos.map(a => a.name));
    
    const lectores = archivos.map((archivo) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async function (e) {
          // Comprimir la imagen antes de agregarla (600px, calidad 40%)
          const imagenComprimida = await comprimirImagen(e.target.result, 600, 0.4);
          resolve({ src: imagenComprimida, nombre: archivo.name });
        };
        reader.readAsDataURL(archivo);
      });
    });

    Promise.all(lectores).then((imagenes) => {
      console.log('Todas las imágenes cargadas:', imagenes.length);
      // crear hojas separadas, máximo 9 fotos por hoja (3x3)
      const grupos = [];
      for (let i = 0; i < imagenes.length; i += 9) {
        grupos.push(imagenes.slice(i, i + 9));
      }
      
      console.log('Grupos de fotos:', grupos.length, 'grupos');

      grupos.forEach((grupo, paginaIndex) => {
        console.log(`Creando hoja ${paginaIndex + 1} con ${grupo.length} fotos`);
        const hojaGrupo = document.createElement('div');
        hojaGrupo.className = 'hoja-fotos';

        const encabez = document.createElement('div');
        encabez.className = 'encabezado-hoja';
        const leftLogo = settings.logoLeft || 'assets/logo-izquierdo.png';
        const rightLogo = settings.logoRight || 'assets/logo-derecho.png';
        encabez.innerHTML = `
          <div class="encabezado-fila">
            <img src="${leftLogo}" class="logo-izq" alt="Logo Izquierdo" />
            <div class="encabezado-texto">
              <h2>Informe de Inspección Submarina</h2>
              <div style="display:flex; gap:15px; justify-content:center; margin-bottom:4px; flex-wrap:wrap;">
                <p style="margin:0;"><strong>Piloto ROV:</strong> <input type="text" class="encabezado-input sync-piloto" data-sync="piloto" value="${piloto}" readonly style="border:none; background:transparent; font-weight:normal; width:auto; min-width:120px; cursor:default;" /></p>
                <p style="margin:0;"><strong>Fecha:</strong> <input type="text" class="encabezado-input sync-fecha" data-sync="fecha" value="${fecha}" readonly style="border:none; background:transparent; font-weight:normal; width:auto; min-width:100px; cursor:default;" /></p>
                <p style="margin:0;"><strong>Centro de Cultivo:</strong> <input type="text" class="encabezado-input sync-centro" data-sync="centro" value="${centro}" readonly style="border:none; background:transparent; font-weight:normal; width:auto; min-width:140px; cursor:default;" /></p>
              </div>
              <p style="text-align:center; margin:0;"><strong>Área:</strong> <input type="text" class="encabezado-input sync-area" data-sync="area" value="${area} - JAULA N.º${jaula}" style="border:none; background:transparent; font-weight:normal; width:auto; min-width:180px;" /></p>
            </div>
            <img src="${rightLogo}" class="logo-der" alt="Logo Derecho" style="max-height:60px;" />
          </div>
        `;
        hojaGrupo.appendChild(encabez);

        const bloque = document.createElement('div');
        bloque.className = 'bloque-fotos';

        const contenedorPagina = document.createElement('div');
        contenedorPagina.className = 'hoja-galeria';

        grupo.forEach(({ src, nombre }, i) => {
          const contenedor = document.createElement('div');
          contenedor.className = 'foto-contenedor';

          const numeroGlobal = paginaIndex * 6 + i + 1;

          contenedor.innerHTML = `
            <div class="numero-foto">${numeroGlobal}</div>
            <div class="controles-foto">
              <button class="btn-eliminar" title="Eliminar foto">🗑️</button>
              <button class="btn-cambiar" title="Cambiar foto">🔄</button>
            </div>
            <img src="${src}" class="foto-informe" />
            <textarea class="descripcion-foto">${generarDescripcion(nombre)}</textarea>
          `;

          const numeroFoto = contenedor.querySelector('.numero-foto');
          if (numeroFoto) {
            numeroFoto.style.backgroundColor = settings.defaultColor;
            numeroFoto.style.display = settings.showNumbers ? '' : 'none';
          }

          if (numeroFoto) {
            const cicloColores = ['#1976d2', '#d32f2f', '#fbc02d', '#388e3c'];
            let idxInicial = cicloColores.indexOf(numeroFoto.style.backgroundColor);
            if (idxInicial === -1) {
              idxInicial = cicloColores.indexOf(settings.defaultColor);
              if (idxInicial === -1) idxInicial = 0;
              numeroFoto.style.backgroundColor = cicloColores[idxInicial];
            }
            numeroFoto.dataset.colorIndex = String(idxInicial);

            numeroFoto.addEventListener('click', (e) => {
              e.stopPropagation();
              const current = parseInt(numeroFoto.dataset.colorIndex || '0', 10);
              const next = (current + 1) % cicloColores.length;
              numeroFoto.dataset.colorIndex = String(next);
              numeroFoto.style.backgroundColor = cicloColores[next];
            });
          }

          // Botón eliminar
          const btnEliminar = contenedor.querySelector('.btn-eliminar');
          if (btnEliminar) {
            btnEliminar.addEventListener('click', (e) => {
              e.stopPropagation();
              contenedor.remove();
              // Renumerar fotos restantes
              const fotos = contenedorPagina.querySelectorAll('.foto-contenedor');
              fotos.forEach((foto, index) => {
                const numero = foto.querySelector('.numero-foto');
                if (numero) numero.textContent = index + 1;
              });
            });
          }

          // Botón cambiar
          const btnCambiar = contenedor.querySelector('.btn-cambiar');
          const imgFoto = contenedor.querySelector('.foto-informe');
          if (btnCambiar && imgFoto) {
            btnCambiar.addEventListener('click', (e) => {
              e.stopPropagation();
              const inputFile = document.createElement('input');
              inputFile.type = 'file';
              inputFile.accept = 'image/*';
              inputFile.addEventListener('change', () => {
                if (inputFile.files && inputFile.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    imgFoto.src = ev.target.result;
                  };
                  reader.readAsDataURL(inputFile.files[0]);
                }
              });
              inputFile.click();
            });
          }

          contenedorPagina.appendChild(contenedor);
        });

        bloque.appendChild(contenedorPagina);
        hojaGrupo.appendChild(bloque);
        insertarAntesBitacora(hojaGrupo);

        Sortable.create(contenedorPagina, {
          animation: 150,
          onEnd: () => {
            const fotos = contenedorPagina.querySelectorAll('.foto-contenedor');
            fotos.forEach((foto, index) => {
              const numero = foto.querySelector('.numero-foto');
              numero.textContent = index + 1;
            });
          }
        });
      });

      inputFotos.value = '';
    });
  });

  imagenWrapper.addEventListener('click', (e) => {
    // Evitar agregar números si se hace clic en una caja de texto o sus elementos
    if (e.target.classList.contains('caja-texto-esquema') || 
        e.target.classList.contains('btn-eliminar-texto-esquema') ||
        e.target.closest('.caja-texto-esquema')) {
      return;
    }
    
    // Obtener la posición relativa al wrapper de la imagen usando coordenadas de pantalla
    const rect = imagenWrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * imagenWrapper.offsetWidth;
    const y = (e.clientY - rect.top) / rect.height * imagenWrapper.offsetHeight;

    const numeroAsignado = numerosDisponibles.length > 0
      ? numerosDisponibles.shift()
      : contadorLocal++;

    const grupoNumero = document.createElement('div');
    grupoNumero.className = 'grupo-numero';
    // Colocar el número exactamente en el punto clicado (corregido por zoom/escala)
    grupoNumero.style.left = `${x}px`;
    grupoNumero.style.top = `${y}px`;

    const numero = document.createElement('div');
    numero.className = 'numero-interactivo';
    numero.textContent = numeroAsignado;
    numero.style.backgroundColor = settings.defaultColor;
    numero.style.display = settings.showNumbers ? '' : 'none';

    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker-interactivo oculto';
    colorPicker.innerHTML = `
      <button class="color-btn" data-color="#1976d2" style="background-color:#1976d2;"></button>
      <button class="color-btn" data-color="#d32f2f" style="background-color:#d32f2f;"></button>
      <button class="color-btn" data-color="#fbc02d" style="background-color:#fbc02d;"></button>
      <button class="color-btn" data-color="#388e3c" style="background-color:#388e3c;"></button>
    `;

    grupoNumero.appendChild(numero);
    grupoNumero.appendChild(colorPicker);
    grupoNumero.style.position = 'absolute';
    grupoNumero.style.transform = 'translate(-50%, -50%)';
    grupoNumero.style.zIndex = 10;

    grupoNumero.addEventListener('mouseenter', () => {
      colorPicker.classList.remove('oculto');
    });

    grupoNumero.addEventListener('mouseleave', () => {
      colorPicker.classList.add('oculto');
    });

    const botonesColor = colorPicker.querySelectorAll('.color-btn');
    botonesColor.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        numero.style.backgroundColor = btn.dataset.color;
      });
    });

    numero.addEventListener('click', (ev) => {
      ev.stopPropagation();
      numerosDisponibles.push(numeroAsignado);
      numerosDisponibles.sort((a, b) => a - b);
      grupoNumero.remove();
    });

    imagenWrapper.appendChild(grupoNumero);
  });

  // Restaurar bitácora después de crear el informe y configurar todos los listeners
  setTimeout(() => {
    restaurarBitacora();
  }, 100);

  imagenLineaActual = null;
  vistaPrevia.innerHTML = '';
  lineaEstado.textContent = 'No se ha seleccionado ninguna imagen';
  crearInforme.disabled = true;
  cerrarPaneles();
});

function generarDescripcion(nombreArchivo) {
  const nombre = nombreArchivo.toUpperCase();
  const jaula = nombre.match(/JAULA(\d+)/);
  const profundidad = nombre.match(/(\d+)M/);

  const partes = [];
  if (jaula) partes.push(`Jaula: ${jaula[1]}`);
  if (profundidad) partes.push(`Profundidad: ${profundidad[0]}`);

  return partes.length ? partes.join(' | ') : '';
}

// ========== SISTEMA DE GUARDADO Y CONSOLIDADO DE INFORMES ==========

// Guardar bitacora en localStorage antes de guardar informe
function guardarBitacora() {
  const tablaBitacora = document.querySelector('.tabla-bitacora tbody');
  if (tablaBitacora) {
    const filas = [];
    tablaBitacora.querySelectorAll('tr').forEach(tr => {
      const celdas = [];
      tr.querySelectorAll('td').forEach((td, idx) => {
        if (idx === 1) {
          // Columna fecha (input date)
          const inputFecha = td.querySelector('input.fecha-bitacora');
          celdas.push(inputFecha ? inputFecha.value : td.textContent.trim());
        } else {
          celdas.push(td.textContent.trim());
        }
      });
      filas.push(celdas);
    });
    localStorage.setItem('bitacoraGuardada', JSON.stringify(filas));
    console.log('Bitácora guardada:', filas); // Debug
  }
}

// Bloquear filas de bitácora ya usadas y dejar libre la siguiente
function bloquearFilasBitacoraUsadas() {
  const tablaBitacora = document.querySelector('.tabla-bitacora tbody');
  if (!tablaBitacora) return;

  const filas = Array.from(tablaBitacora.querySelectorAll('tr'));
  let ultimaFilaConDatos = -1;

  filas.forEach((tr, index) => {
    const celdas = tr.querySelectorAll('td');
    const area = celdas[2]?.textContent.trim();
    const rotInf = celdas[3]?.textContent.trim();
    const objInf = celdas[6]?.textContent.trim();
    const tieneDatos = !!(area || rotInf || objInf);

    if (tieneDatos) {
      ultimaFilaConDatos = index;
      tr.classList.add('fila-bloqueada');
      tr.querySelectorAll('.editable-cell').forEach(td => {
        td.setAttribute('contenteditable', 'false');
      });
    }
  });

  // Desbloquear solo la fila siguiente a la última con datos (si existe)
  const siguienteIndex = ultimaFilaConDatos + 1;
  if (siguienteIndex >= 0 && siguienteIndex < filas.length) {
    const filaSiguiente = filas[siguienteIndex];
    filaSiguiente.classList.remove('fila-bloqueada');
    filaSiguiente.querySelectorAll('.editable-cell').forEach(td => {
      td.setAttribute('contenteditable', 'true');
    });
  }
}

// Sincronizar contenido editable al DOM antes de guardar
function sincronizarBitacoraAlDOM() {
  const tablaBitacora = document.querySelector('.tabla-bitacora tbody');
  if (tablaBitacora) {
    tablaBitacora.querySelectorAll('tr').forEach(tr => {
      tr.querySelectorAll('td[contenteditable="true"]').forEach(td => {
        // Forzar que el textContent se refleje en el HTML
        const contenido = td.textContent;
        td.setAttribute('data-value', contenido);
        td.textContent = contenido;
      });
    });
  }
}

// ========== SISTEMA DE PLANTILLAS DE BITÁCORA ==========

// Guardar plantilla de bitácora
function guardarPlantillaBitacora() {
  const nombrePlantilla = prompt('💾 Nombre de la plantilla:', 'Plantilla ' + (new Date().toLocaleDateString()));
  
  if (!nombrePlantilla || nombrePlantilla.trim() === '') {
    return;
  }
  
  // Obtener datos actuales de la bitácora
  const datosGuardados = localStorage.getItem('bitacoraGuardada');
  if (!datosGuardados) {
    alert('⚠️ No hay datos de bitácora para guardar como plantilla.');
    return;
  }
  
  try {
    const filas = JSON.parse(datosGuardados);
    
    // Obtener plantillas existentes
    const plantillasGuardadas = JSON.parse(localStorage.getItem('plantillasBitacora') || '[]');
    
    // Crear nueva plantilla
    const nuevaPlantilla = {
      id: Date.now(),
      nombre: nombrePlantilla.trim(),
      fecha: new Date().toLocaleDateString(),
      datos: filas
    };
    
    plantillasGuardadas.push(nuevaPlantilla);
    localStorage.setItem('plantillasBitacora', JSON.stringify(plantillasGuardadas));
    
    mostrarNotificacion('✅ Plantilla guardada: ' + nombrePlantilla, 3000);
  } catch (e) {
    alert('❌ Error al guardar la plantilla');
    console.error(e);
  }
}

// Cargar plantilla de bitácora
function cargarPlantillaBitacora() {
  const plantillasGuardadas = JSON.parse(localStorage.getItem('plantillasBitacora') || '[]');
  
  if (plantillasGuardadas.length === 0) {
    alert('📁 No hay plantillas guardadas. Guarda una primero.');
    return;
  }
  
  // Crear modal de selección
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
  
  const contenido = document.createElement('div');
  contenido.style.cssText = 'background:#fff; padding:30px; border-radius:12px; max-width:600px; width:100%; max-height:80vh; overflow-y:auto;';
  
  contenido.innerHTML = `
    <h2 style="margin:0 0 20px 0; color:#1976d2; display:flex; align-items:center; gap:12px;">
      <span style="font-size:28px;">📋</span>
      Cargar Plantilla
    </h2>
    <div id="listaPlantillas" style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
      ${plantillasGuardadas.map(plantilla => `
        <div class="item-plantilla" data-id="${plantilla.id}" style="background:#f5f5f5; padding:16px; border-radius:8px; cursor:pointer; transition:all 0.2s; border:2px solid transparent;">
          <div style="font-weight:600; font-size:16px; margin-bottom:4px; color:#333;">${plantilla.nombre}</div>
          <div style="font-size:13px; color:#666;">📅 Creada: ${plantilla.fecha} • ${plantilla.datos.length} filas</div>
        </div>
      `).join('')}
    </div>
    <button id="cancelarCarga" style="width:100%; padding:12px; background:#757575; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;">❌ Cancelar</button>
  `;
  
  modal.appendChild(contenido);
  document.body.appendChild(modal);
  
  // Hover effects
  contenido.querySelectorAll('.item-plantilla').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.background = '#e3f2fd';
      item.style.borderColor = '#1976d2';
      item.style.transform = 'scale(1.02)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '#f5f5f5';
      item.style.borderColor = 'transparent';
      item.style.transform = 'scale(1)';
    });
    item.addEventListener('click', () => {
      const plantillaId = parseInt(item.dataset.id);
      const plantilla = plantillasGuardadas.find(p => p.id === plantillaId);
      if (plantilla && confirm(`¿ Cargar la plantilla "${plantilla.nombre}"?\n\nEsto reemplazará los datos actuales de la bitácora.`)) {
        cargarDatosPlantilla(plantilla.datos);
        modal.remove();
        mostrarNotificacion('✅ Plantilla cargada: ' + plantilla.nombre, 3000);
      }
    });
  });
  
  contenido.querySelector('#cancelarCarga').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Cargar datos de plantilla en la bitácora
function cargarDatosPlantilla(datos) {
  try {
    const tablaBitacora = document.querySelector('.tabla-bitacora tbody');
    if (!tablaBitacora) return;
    
    tablaBitacora.querySelectorAll('tr').forEach((tr, idx) => {
      if (datos[idx]) {
        tr.querySelectorAll('td').forEach((td, colIdx) => {
          if (datos[idx][colIdx] && datos[idx][colIdx].trim() !== '') {
            td.textContent = datos[idx][colIdx];
            td.setAttribute('data-value', datos[idx][colIdx]);
          } else {
            td.textContent = '';
            td.removeAttribute('data-value');
          }
        });
      }
    });
    
    // Guardar en localStorage
    localStorage.setItem('bitacoraGuardada', JSON.stringify(datos));
  } catch (e) {
    alert('❌ Error al cargar la plantilla');
    console.error(e);
  }
}

// Gestionar plantillas (ver, eliminar)
function gestionarPlantillasBitacora() {
  const plantillasGuardadas = JSON.parse(localStorage.getItem('plantillasBitacora') || '[]');
  
  if (plantillasGuardadas.length === 0) {
    alert('📁 No hay plantillas guardadas.');
    return;
  }
  
  // Crear modal de gestión
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
  
  const contenido = document.createElement('div');
  contenido.style.cssText = 'background:#fff; padding:30px; border-radius:12px; max-width:700px; width:100%; max-height:80vh; overflow-y:auto;';
  
  function renderizarLista() {
    const plantillas = JSON.parse(localStorage.getItem('plantillasBitacora') || '[]');
    
    contenido.innerHTML = `
      <h2 style="margin:0 0 20px 0; color:#1976d2; display:flex; align-items:center; gap:12px;">
        <span style="font-size:28px;">⚙️</span>
        Gestionar Plantillas
      </h2>
      
      ${plantillas.length === 0 ? `
        <div style="text-align:center; padding:40px 20px; color:#999;">
          <div style="font-size:48px; margin-bottom:12px;">📁</div>
          <div style="font-size:16px;">No hay plantillas guardadas</div>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
          ${plantillas.map(plantilla => `
            <div style="background:#f5f5f5; padding:16px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
              <div style="flex:1;">
                <div style="font-weight:600; font-size:16px; margin-bottom:4px; color:#333;">${plantilla.nombre}</div>
                <div style="font-size:13px; color:#666; margin-bottom:8px;">
                  📅 ${plantilla.fecha} • ${plantilla.datos.length} filas • ID: ${plantilla.id}
                </div>
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn-ver" data-id="${plantilla.id}" style="padding:8px 12px; background:#2196f3; color:white; border:none; border-radius:6px; cursor:pointer; margin-right:4px; font-size:12px; font-weight:600;">👁️ Ver</button>
                <button class="btn-eliminar" data-id="${plantilla.id}" style="padding:8px 12px; background:#f44336; color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600;">🗑️ Eliminar</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
      
      <button id="cerrarGestion" style="width:100%; padding:12px; background:#757575; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;">✔️ Cerrar</button>
    `;
    
    // Event listeners para botones
    contenido.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const plantillaId = parseInt(btn.dataset.id);
        const plantilla = plantillas.find(p => p.id === plantillaId);
        if (plantilla && confirm(`¿ Eliminar la plantilla "${plantilla.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
          const nuevasPlantillas = plantillas.filter(p => p.id !== plantillaId);
          localStorage.setItem('plantillasBitacora', JSON.stringify(nuevasPlantillas));
          mostrarNotificacion('🗑️ Plantilla eliminada', 2000);
          renderizarLista();
        }
      });
    });
    
    contenido.querySelectorAll('.btn-ver').forEach(btn => {
      btn.addEventListener('click', () => {
        const plantillaId = parseInt(btn.dataset.id);
        const plantilla = plantillas.find(p => p.id === plantillaId);
        if (plantilla) {
          mostrarDetallesPlantilla(plantilla);
        }
      });
    });
    
    contenido.querySelector('#cerrarGestion').addEventListener('click', () => {
      modal.remove();
    });
  }
  
  renderizarLista();
  modal.appendChild(contenido);
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Mostrar detalles de una plantilla
function mostrarDetallesPlantilla(plantilla) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center; padding:20px;';
  
  const contenido = document.createElement('div');
  contenido.style.cssText = 'background:#fff; padding:30px; border-radius:12px; max-width:800px; width:100%; max-height:85vh; overflow-y:auto;';
  
  // Contar datos útiles
  const filasConDatos = plantilla.datos.filter(fila => fila.some(celda => celda && celda.trim() !== ''));
  const areasUnicas = [...new Set(plantilla.datos.filter(f => f[2]).map(f => f[2]))];
  
  contenido.innerHTML = `
    <h2 style="margin:0 0 20px 0; color:#1976d2; display:flex; align-items:center; gap:10px;">
      <span style="font-size:28px;">📊</span>
      ${plantilla.nombre}
    </h2>
    
    <div style="background:#f5f5f5; padding:16px; border-radius:8px; margin-bottom:20px;">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px;">
        <div>
          <div style="font-size:13px; color:#666; margin-bottom:4px;">📅 Fecha de creación</div>
          <div style="font-weight:600; color:#333;">${plantilla.fecha}</div>
        </div>
        <div>
          <div style="font-size:13px; color:#666; margin-bottom:4px;">📊 Total de filas</div>
          <div style="font-weight:600; color:#333;">${plantilla.datos.length}</div>
        </div>
        <div>
          <div style="font-size:13px; color:#666; margin-bottom:4px;">✅ Filas con datos</div>
          <div style="font-weight:600; color:#333;">${filasConDatos.length}</div>
        </div>
        <div>
          <div style="font-size:13px; color:#666; margin-bottom:4px;">📍 Áreas incluidas</div>
          <div style="font-weight:600; color:#333;">${areasUnicas.length}</div>
        </div>
      </div>
    </div>
    
    ${areasUnicas.length > 0 ? `
      <div style="background:#f5f5f5; padding:16px; border-radius:8px; margin-bottom:20px;">
        <h3 style="margin:0 0 12px 0; font-size:16px; color:#333;">📍 Áreas configuradas:</h3>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${areasUnicas.map(area => `
            <span style="background:#1976d2; color:white; padding:6px 12px; border-radius:16px; font-size:13px; font-weight:600;">${area}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <div style="background:#f9f5f5; padding:16px; border-radius:8px; max-height:300px; overflow-y:auto; margin-bottom:20px;">
      <h3 style="margin:0 0 12px 0; font-size:16px; color:#333;">📝 Vista previa de datos:</h3>
      <table style="width:100%; font-size:12px; border-collapse:collapse;">
        <thead>
          <tr style="background:#e0e0e0;">
            <th style="padding:8px; text-align:left; border:1px solid #1565c0; font-weight:600;">#</th>
            <th style="padding:8px; text-align:left; border:1px solid #1565c0; font-weight:600;">Día/Turno</th>
            <th style="padding:8px; text-align:left; border:1px solid #1565c0; font-weight:600;">Fecha</th>
            <th style="padding:8px; text-align:left; border:1px solid #1565c0; font-weight:600;">Área</th>
            <th style="padding:8px; text-align:center; border:1px solid #1565c0; font-weight:600; min-width:280px;">Roturas</th>
            <th style="padding:8px; text-align:center; border:1px solid #1565c0; font-weight:600; min-width:280px;">Anomalías</th>
          </tr>
        </thead>
        <tbody>
          ${filasConDatos.slice(0, 10).map((fila, idx) => `
            <tr style="${idx % 2 === 0 ? 'background:#fff;' : 'background:#f9f9f9;'}">
              ${fila.map((celda, colIdx) => `
                <td style="padding:6px; border:1px solid #ddd; ${colIdx >= 3 ? 'text-align:center;' : ''}">${celda || '-'}</td>
              `).join('')}
            </tr>
          `).join('')}
          ${filasConDatos.length > 10 ? `
            <tr><td colspan="10" style="padding:8px; text-align:center; color:#999; font-style:italic;">... y ${filasConDatos.length - 10} filas más</td></tr>
          ` : ''}
        </tbody>
      </table>
    </div>
    
    <div style="display:flex; gap:12px;">
      <button id="cargarEstaPlantilla" style="flex:1; padding:12px; background:#4caf50; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;">✅ Cargar esta plantilla</button>
      <button id="cerrarDetalles" style="flex:1; padding:12px; background:#757575; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;">❌ Cerrar</button>
    </div>
  `;
  
  modal.appendChild(contenido);
  document.body.appendChild(modal);
  
  contenido.querySelector('#cargarEstaPlantilla').addEventListener('click', () => {
    if (confirm(`¿ Cargar la plantilla "${plantilla.nombre}"?\n\nEsto reemplazará los datos actuales de la bitácora.`)) {
      cargarDatosPlantilla(plantilla.datos);
      modal.remove();
      mostrarNotificacion('✅ Plantilla cargada: ' + plantilla.nombre, 3000);
    }
  });
  
  contenido.querySelector('#cerrarDetalles').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Restaurar bitácora desde localStorage
function restaurarBitacora() {
  const datosGuardados = localStorage.getItem('bitacoraGuardada');
  if (datosGuardados) {
    try {
      const filas = JSON.parse(datosGuardados);
      console.log('Restaurando bitácora:', filas); // Debug
      const tablaBitacora = document.querySelector('.tabla-bitacora tbody');
      if (tablaBitacora && filas.length > 0) {
        tablaBitacora.querySelectorAll('tr').forEach((tr, idx) => {
          if (filas[idx]) {
            tr.querySelectorAll('td').forEach((td, colIdx) => {
              const valor = filas[idx][colIdx];
              if (colIdx === 1) {
                // Columna fecha con input date
                const inputFecha = td.querySelector('input.fecha-bitacora');
                if (inputFecha && valor) {
                  inputFecha.value = valor;
                }
              } else if (valor && valor.trim() !== '') {
                td.textContent = valor;
                td.setAttribute('data-value', valor);
              }
            });
          }
        });
        console.log('Bitácora restaurada correctamente');
      }
    } catch (e) {
      console.error('Error al restaurar bitácora:', e);
    }
  }
}

// Guardar informe del día actual
async function guardarInformeDiario() {
  // ========== VALIDACIÓN DE CAMPOS OBLIGATORIOS ==========
  const errores = [];
  
  // Validar que haya contenido
  if (!panelLineas.innerHTML || panelLineas.innerHTML.trim() === '') {
    errores.push('• No hay contenido para guardar');
  }
  
  // Validar que exista al menos una hoja (esquema o foto)
  const hojas = panelLineas.querySelectorAll('.hoja-bitacora, .hoja-fotos, .hoja-indice, .hoja-esquema');
  if (hojas.length === 0) {
    errores.push('• Debes crear al menos una hoja de informe');
  }
  
  // Validar que haya un piloto configurado
  const pilotoInputs = panelLineas.querySelectorAll('[data-sync="piloto"]');
  const piloto = pilotoInputs.length > 0 ? pilotoInputs[0].value : '';
  if (!piloto || piloto.trim() === '') {
    errores.push('• Falta configurar el nombre del Piloto ROV (ve a Configuración)');
  }
  
  // Validar que haya una fecha configurada
  const fechaInputs = panelLineas.querySelectorAll('[data-sync="fecha"]');
  const fecha = fechaInputs.length > 0 ? fechaInputs[0].value : '';
  if (!fecha || fecha.trim() === '') {
    errores.push('• Falta configurar la fecha (ve a Configuración)');
  }
  
  // Validar que haya al menos un área especificada
  const areaInputs = panelLineas.querySelectorAll('[data-sync="area"]');
  const area = areaInputs.length > 0 ? areaInputs[0].value : '';
  if (!area || area.trim() === '') {
    errores.push('• Falta especificar el Área de inspección');
  }
  
  // Mostrar errores si los hay
  if (errores.length > 0) {
    const mensaje = '⚠️ No se puede guardar el informe:\n\n' + errores.join('\n');
    alert(mensaje);
    return;
  }
  
  // Sincronizar bitácora al DOM antes de guardar
  sincronizarBitacoraAlDOM();
  
  // Guardar la bitacora automáticamente
  guardarBitacora();
  
  // Verificar si estamos en modo edición
  const editandoIdx = guardarInforme.dataset.editandoIdx;
  
  if (editandoIdx !== undefined) {
    // Modo actualización
    const idx = parseInt(editandoIdx);
    try {
      const indice = JSON.parse(localStorage.getItem('informesGuardados') || '[]');
      
      if (idx >= 0 && idx < indice.length) {
        const itemIndice = indice[idx];
        const nombreActual = itemIndice.nombre;
        const confirmarNombre = prompt('Confirmar nombre del informe:', nombreActual);
        
        if (!confirmarNombre) {
          // Cancelar actualización
          delete guardarInforme.dataset.editandoIdx;
          guardarInforme.textContent = '💾 Guardar';
          guardarInforme.style.background = '';
          return;
        }
        
        const nuevoTimestamp = Date.now();

        // Actualizar en IndexedDB usando el timestamp antiguo
        await updateInformeIndexedDB(itemIndice.timestamp, {
          nombre: confirmarNombre,
          contenido: panelLineas.innerHTML,
          timestamp: nuevoTimestamp
        });

        // Actualizar índice ligero en localStorage
        indice[idx] = {
          fecha: itemIndice.fecha,
          nombre: confirmarNombre,
          timestamp: nuevoTimestamp
        };
        localStorage.setItem('informesGuardados', JSON.stringify(indice));

        alert(`✅ Informe "${confirmarNombre}" actualizado exitosamente`);
        
        // Salir del modo edición
        delete guardarInforme.dataset.editandoIdx;
        guardarInforme.textContent = '💾 Guardar';
        guardarInforme.style.background = '';
      }
    } catch (e) {
      alert('❌ Error al actualizar el informe');
      console.error(e);
    }
  } else {
    // Modo guardar nuevo
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const nombreInforme = prompt('Nombre del informe (opcional):', `Informe ${fecha}`);
    if (!nombreInforme) return;

    // Comprimir contenido antes de guardar
    // Asegurar que la bitácora principal siempre se incluya en el contenido guardado
    let contenidoAGuardar = '';
    try {
      const panelClonado = panelLineas.cloneNode(true);
      const bitacoraPrincipal = document.getElementById('bitacora-principal');
      if (bitacoraPrincipal && !panelClonado.querySelector('#bitacora-principal')) {
        panelClonado.appendChild(bitacoraPrincipal.cloneNode(true));
      }
      contenidoAGuardar = panelClonado.innerHTML;
    } catch (e) {
      console.error('Error al clonar panelLineas, usando innerHTML directo', e);
      contenidoAGuardar = panelLineas.innerHTML;
    }
    
    // Comprimir imágenes base64 si son muy grandes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contenidoAGuardar;
    const imagenes = tempDiv.querySelectorAll('img');
    let imagenesComprimidas = 0;
    
    imagenes.forEach(img => {
      if (img.src && img.src.startsWith('data:image') && img.src.length > 100000) {
        // Imagen muy grande, marcar para advertencia pero no comprimir aquí
        // ya que la compresión requiere canvas y es asíncrona
        imagenesComprimidas++;
      }
    });
    
    const informe = {
      fecha: fecha,
      nombre: nombreInforme,
      timestamp: Date.now(),
      contenido: contenidoAGuardar
    };

    try {
      // Guardar en IndexedDB (sin límite práctico de 5MB como localStorage)
      await addInformeIndexedDB(informe);

      // Mantener en localStorage solo un pequeño índice (sin contenido grande)
      const indice = JSON.parse(localStorage.getItem('informesGuardados') || '[]');
      indice.push({ fecha: informe.fecha, nombre: informe.nombre, timestamp: informe.timestamp });
      localStorage.setItem('informesGuardados', JSON.stringify(indice));

      // Agregar a cola de sincronización
      agregarAColaSincronizacion({
        type: 'GUARDAR_INFORME',
        data: informe
      });

      alert(`✅ Informe "${nombreInforme}" guardado exitosamente`);

      // No limpiar el contenido, mantener todo visible incluyendo la bitácora
      // Bloquear filas ya utilizadas y dejar libre la siguiente para el próximo informe
      bloquearFilasBitacoraUsadas();
    } catch (e) {
      console.error(e);
      alert('❌ Error al guardar el informe en almacenamiento interno. Intenta nuevamente o exporta a PDF.');
    }
  }
}

// Ver y gestionar consolidado
// Restaurar event listeners después de cargar un informe guardado
function restaurarEventListenersInforme() {
  // Primero restaurar event listeners para números EXISTENTES
  const gruposNumeroExistentes = document.querySelectorAll('.grupo-numero');
  gruposNumeroExistentes.forEach(grupoNumero => {
    const numero = grupoNumero.querySelector('.numero-interactivo');
    const colorPicker = grupoNumero.querySelector('.color-picker-interactivo');
    
    if (numero && colorPicker) {
      // Restaurar hover para mostrar/ocultar color picker
      grupoNumero.addEventListener('mouseenter', () => {
        colorPicker.classList.remove('oculto');
      });

      grupoNumero.addEventListener('mouseleave', () => {
        colorPicker.classList.add('oculto');
      });

      // Restaurar botones de color
      const botonesColor = colorPicker.querySelectorAll('.color-btn');
      botonesColor.forEach(btn => {
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          numero.style.backgroundColor = btn.dataset.color;
        });
      });

      // Restaurar click para eliminar
      numero.addEventListener('click', (ev) => {
        ev.stopPropagation();
        numerosDisponibles.push(numeroAsignado);
        numerosDisponibles.sort((a, b) => a - b);
        grupoNumero.remove();
      });
    }
  });
  
  // Restaurar event listeners para crear nuevos números en el esquema
  const imagenesWrapper = document.querySelectorAll('.imagen-wrapper');
  
  imagenesWrapper.forEach(imagenWrapper => {
    // Encontrar el número más alto existente para continuar el correlativo
    let numeroMasAlto = 0;
    const numerosExistentes = imagenWrapper.querySelectorAll('.numero-interactivo');
    numerosExistentes.forEach(numElem => {
      const valor = parseInt(numElem.textContent) || 0;
      if (valor > numeroMasAlto) {
        numeroMasAlto = valor;
      }
    });
    
    let contadorLocal = numeroMasAlto + 1;
    
    imagenWrapper.addEventListener('click', (e) => {
      // Evitar agregar números si se hace clic en una caja de texto o sus elementos
      if (e.target.classList.contains('caja-texto-esquema') || 
          e.target.classList.contains('btn-eliminar-texto-esquema') ||
          e.target.closest('.caja-texto-esquema') ||
          e.target.classList.contains('grupo-numero') ||
          e.target.closest('.grupo-numero') ||
          e.target.classList.contains('numero-interactivo') ||
          e.target.classList.contains('color-btn')) {
        return;
      }
      
      // Obtener la posición relativa al wrapper de la imagen usando coordenadas normalizadas
      const rect = imagenWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * imagenWrapper.offsetWidth;
      const y = (e.clientY - rect.top) / rect.height * imagenWrapper.offsetHeight;

      const numeroAsignado = contadorLocal++;

      const grupoNumero = document.createElement('div');
      grupoNumero.className = 'grupo-numero';
      // Colocar el número exactamente en el punto clicado (corregido por zoom/escala)
      grupoNumero.style.left = `${x}px`;
      grupoNumero.style.top = `${y}px`;

      const numero = document.createElement('div');
      numero.className = 'numero-interactivo';
      numero.textContent = numeroAsignado;
      numero.style.backgroundColor = settings.defaultColor;
      numero.style.display = settings.showNumbers ? '' : 'none';

      const colorPicker = document.createElement('div');
      colorPicker.className = 'color-picker-interactivo oculto';
      colorPicker.innerHTML = `
        <button class="color-btn" data-color="#1976d2" style="background-color:#1976d2;"></button>
        <button class="color-btn" data-color="#d32f2f" style="background-color:#d32f2f;"></button>
        <button class="color-btn" data-color="#fbc02d" style="background-color:#fbc02d;"></button>
        <button class="color-btn" data-color="#388e3c" style="background-color:#388e3c;"></button>
      `;

      grupoNumero.appendChild(numero);
      grupoNumero.appendChild(colorPicker);
      grupoNumero.style.position = 'absolute';
      grupoNumero.style.transform = 'translate(-50%, -50%)';
      grupoNumero.style.zIndex = 10;

      grupoNumero.addEventListener('mouseenter', () => {
        colorPicker.classList.remove('oculto');
      });

      grupoNumero.addEventListener('mouseleave', () => {
        colorPicker.classList.add('oculto');
      });

      const botonesColor = colorPicker.querySelectorAll('.color-btn');
      botonesColor.forEach(btn => {
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          numero.style.backgroundColor = btn.dataset.color;
        });
      });

      numero.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (confirm('¿Eliminar este número?')) {
          grupoNumero.remove();
        }
      });

      imagenWrapper.appendChild(grupoNumero);
    });
  });
  
  // Restaurar event listeners para cajas de texto
  const cajasTexto = document.querySelectorAll('.caja-texto-esquema');
  cajasTexto.forEach(caja => {
    const btnEliminar = caja.querySelector('.btn-eliminar-texto-esquema');
    if (btnEliminar) {
      btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta caja de texto?')) {
          caja.remove();
        }
      });
    }
  });
  
  console.log('Event listeners restaurados para edición');
}

async function verConsolidadoInformes() {
  try {
    const indice = JSON.parse(localStorage.getItem('informesGuardados') || '[]');
    
    if (indice.length === 0) {
      alert('No hay informes guardados para analizar.');
      return;
    }

    // Cargar contenido completo desde IndexedDB según el índice
    const informesCompletos = [];
    for (const item of indice) {
      const inf = await getInformeByTimestampIndexedDB(item.timestamp);
      if (inf && inf.contenido) {
        informesCompletos.push(inf);
      }
    }

    if (informesCompletos.length === 0) {
      alert('No se pudo cargar el contenido de los informes para el consolidado.');
      return;
    }

    // Analizar datos de los informes
    const stats = analizarDatosInformes(informesCompletos);
    
    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
    
    const contenido = document.createElement('div');
    contenido.style.cssText = 'background:#fff; padding:24px; border-radius:12px; max-width:800px; width:100%; max-height:80vh; overflow-y:auto;';
    
    contenido.innerHTML = `
      <h2 style="margin:0 0 20px 0; color:#1976d2; display:flex; align-items:center; gap:10px;">
        <span style="font-size:28px;">📊</span>
        Consolidado de Informes
      </h2>
      
      <!-- Resumen general -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:24px;">
        <div style="background:linear-gradient(135deg, #1976d2 0%, #1565c0 100%); color:white; padding:20px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <div style="font-size:36px; font-weight:bold; margin-bottom:8px;">${stats.totalInformes}</div>
          <div style="font-size:14px; opacity:0.9;">Total de Informes</div>
        </div>
        
        <div style="background:linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color:white; padding:20px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <div style="font-size:36px; font-weight:bold; margin-bottom:8px;">${stats.totalRoturas}</div>
          <div style="font-size:14px; opacity:0.9;">Total Roturas</div>
        </div>
        
        <div style="background:linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color:white; padding:20px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <div style="font-size:36px; font-weight:bold; margin-bottom:8px;">${stats.totalAnomalias}</div>
          <div style="font-size:14px; opacity:0.9;">Total Anomalías</div>
        </div>
        
        <div style="background:linear-gradient(135deg, #4caf50 0%, #388e3c 100%); color:white; padding:20px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <div style="font-size:36px; font-weight:bold; margin-bottom:8px;">${stats.promedioRoturas}</div>
          <div style="font-size:14px; opacity:0.9;">Promedio Roturas/Día</div>
        </div>
      </div>
      
      <!-- Áreas más problemáticas -->
      <div style="background:#f5f5f5; padding:20px; border-radius:8px; margin-bottom:24px;">
        <h3 style="margin:0 0 16px 0; color:#333; font-size:18px;">🎯 Áreas Más Problemáticas</h3>
        <div style="display:grid; gap:8px;">
          ${stats.areasMasProblematicas.slice(0, 5).map((area, idx) => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:12px 16px; border-radius:6px; border-left:4px solid ${['#f44336', '#ff5722', '#ff9800', '#ffc107', '#ffeb3b'][idx]};">
              <span style="font-weight:500;">${area.nombre}</span>
              <span style="background:${['#f44336', '#ff5722', '#ff9800', '#ffc107', '#ffeb3b'][idx]}; color:white; padding:4px 12px; border-radius:12px; font-size:13px; font-weight:600;">${area.incidencias} incidencias</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Tendencia por período -->
      <div style="background:#f5f5f5; padding:20px; border-radius:8px; margin-bottom:24px;">
        <h3 style="margin:0 0 16px 0; color:#333; font-size:18px;">📈 Últimos ${Math.min(stats.tendenciaDias.length, 10)} Días</h3>
        <div style="display:flex; gap:8px; align-items:flex-end; height:200px;">
          ${stats.tendenciaDias.slice(-10).map((dia, idx) => {
            const maxRoturas = Math.max(...stats.tendenciaDias.map(d => d.roturas), 1);
            const altura = (dia.roturas / maxRoturas) * 160;
            return `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px;">
                <div style="font-weight:bold; color:#1976d2; font-size:14px;">${dia.roturas}</div>
                <div style="width:100%; background:linear-gradient(to top, #1976d2, #42a5f5); border-radius:4px 4px 0 0; height:${altura}px; min-height:10px; transition:all 0.3s;"></div>
                <div style="font-size:11px; color:#666; transform:rotate(-45deg); margin-top:8px;">${dia.fecha}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Resumen de reparaciones -->
      <div style="background:#f5f5f5; padding:20px; border-radius:8px; margin-bottom:24px;">
        <h3 style="margin:0 0 16px 0; color:#333; font-size:18px;">🔧 Estado de Reparaciones</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:16px;">
          <div style="background:white; padding:16px; border-radius:6px; text-align:center; border-top:4px solid #4caf50;">
            <div style="font-size:28px; font-weight:bold; color:#4caf50; margin-bottom:4px;">${stats.roturasReparadas}</div>
            <div style="font-size:13px; color:#666;">Roturas Reparadas</div>
          </div>
          <div style="background:white; padding:16px; border-radius:6px; text-align:center; border-top:4px solid #ff9800;">
            <div style="font-size:28px; font-weight:bold; color:#ff9800; margin-bottom:4px;">${stats.roturasPendientes}</div>
            <div style="font-size:13px; color:#666;">Roturas Pendientes</div>
          </div>
          <div style="background:white; padding:16px; border-radius:6px; text-align:center; border-top:4px solid #2196f3;">
            <div style="font-size:28px; font-weight:bold; color:#2196f3; margin-bottom:4px;">${stats.anomaliasReparadas}</div>
            <div style="font-size:13px; color:#666;">Anomalías Reparadas</div>
          </div>
          <div style="background:white; padding:16px; border-radius:6px; text-align:center; border-top:4px solid #f44336;">
            <div style="font-size:28px; font-weight:bold; color:#f44336; margin-bottom:4px;">${stats.anomaliasPendientes}</div>
            <div style="font-size:13px; color:#666;">Anomalías Pendientes</div>
          </div>
        </div>
      </div>
      
      <button id="cerrarStats" style="width:100%; padding:12px; background:#757575; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;">✖️ Cerrar</button>
    `;
    
    modal.appendChild(contenido);
    document.body.appendChild(modal);
    
    contenido.querySelector('#cerrarStats').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
  } catch (e) {
    alert('❌ Error al generar estadísticas');
    console.error(e);
  }
}

// Función para analizar datos de los informes
function analizarDatosInformes(informes) {
  const stats = {
    totalInformes: informes.length,
    totalRoturas: 0,
    totalAnomalias: 0,
    roturasReparadas: 0,
    roturasPendientes: 0,
    anomaliasReparadas: 0,
    anomaliasPendientes: 0,
    areasMasProblematicas: [],
    detallePorArea: {},
    tendenciaDias: [],
    promedioRoturas: 0
  };
  
  const areasMap = {};
  const fechasMap = {};
  
  informes.forEach(informe => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = informe.contenido;
    
    // Buscar tabla de bitácora
    const tabla = tempDiv.querySelector('.tabla-bitacora tbody');
    if (tabla) {
      tabla.querySelectorAll('tr').forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 9) {
          let fecha = '';
          const fechaInput = celdas[1].querySelector('input[type="date"]');
          if (fechaInput) {
            fecha = fechaInput.value || fechaInput.textContent.trim();
          } else {
            fecha = celdas[1].textContent.trim();
          }
          const area = celdas[2].textContent.trim();
          const rotInf = parseInt(celdas[3].textContent.trim()) || 0;
          const rotRep = parseInt(celdas[4].textContent.trim()) || 0;
          const rotPen = parseInt(celdas[5].textContent.trim()) || 0;
          const objInf = parseInt(celdas[6].textContent.trim()) || 0;
          const objRep = parseInt(celdas[7].textContent.trim()) || 0;
          const objPen = parseInt(celdas[8].textContent.trim()) || 0;
          
          if (rotInf > 0 || objInf > 0 || area) {
            stats.totalRoturas += rotInf;
            stats.totalAnomalias += objInf;
            stats.roturasReparadas += rotRep;
            stats.roturasPendientes += rotPen;
            stats.anomaliasReparadas += objRep;
            stats.anomaliasPendientes += objPen;
            
            // Contabilizar áreas (totales y detalle)
            if (area) {
              areasMap[area] = (areasMap[area] || 0) + rotInf + objInf;
              if (!stats.detallePorArea[area]) {
                stats.detallePorArea[area] = {
                  rotInf: 0,
                  rotRep: 0,
                  rotPen: 0,
                  objInf: 0,
                  objRep: 0,
                  objPen: 0
                };
              }
              const det = stats.detallePorArea[area];
              det.rotInf += rotInf;
              det.rotRep += rotRep;
              det.rotPen += rotPen;
              det.objInf += objInf;
              det.objRep += objRep;
              det.objPen += objPen;
            }
            
            // Tendencia por fecha
            if (fecha) {
              fechasMap[fecha] = (fechasMap[fecha] || 0) + rotInf;
            }
          }
        }
      });
    }
  });
  
  // Procesar áreas más problemáticas
  stats.areasMasProblematicas = Object.entries(areasMap)
    .map(([nombre, incidencias]) => ({ nombre, incidencias }))
    .sort((a, b) => b.incidencias - a.incidencias);
  
  // Procesar tendencia por días
  stats.tendenciaDias = Object.entries(fechasMap)
    .map(([fecha, roturas]) => ({ fecha, roturas }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  
  // Calcular promedio
  stats.promedioRoturas = stats.tendenciaDias.length > 0 
    ? (stats.totalRoturas / stats.tendenciaDias.length).toFixed(1)
    : 0;
  
  return stats;
}

// ========== SISTEMA DE RECORDATORIOS ==========

// Obtener todos los recordatorios activos
function obtenerRecordatorios() {
  return JSON.parse(localStorage.getItem('recordatorios') || '[]');
}

// Guardar recordatorios
function guardarRecordatorios(recordatorios) {
  localStorage.setItem('recordatorios', JSON.stringify(recordatorios));
  actualizarBadgeRecordatorios();
}

// Actualizar badge de notificaciones
function actualizarBadgeRecordatorios() {
  if (!badgeRecordatorios) return;
  
  const recordatorios = obtenerRecordatorios();
  const activos = recordatorios.filter(r => {
    const tieneRoturaPend = (r.roturasP || 0) > 0 && !r.roturaCompletada;
    const tieneAnomPend = (r.anomaliasP || 0) > 0 && !r.anomaliaCompletada;
    return tieneRoturaPend || tieneAnomPend;
  });
  
  if (activos.length > 0) {
    badgeRecordatorios.textContent = activos.length;
    badgeRecordatorios.style.display = 'block';
  } else {
    badgeRecordatorios.style.display = 'none';
  }
}

// Generar recordatorios automáticos desde las bitácoras
async function generarRecordatoriosAutomaticos() {
  const indice = JSON.parse(localStorage.getItem('informesGuardados') || '[]');
  const recordatoriosExistentes = obtenerRecordatorios();
  const nuevosRecordatorios = [];
  
  console.log('🔎 Escaneando informes para recordatorios. Índice:', indice);

  for (const item of indice) {
    // Intentar obtener el informe completo desde IndexedDB
    let informe = null;
    try {
      if (item.timestamp) {
        informe = await getInformeByTimestampIndexedDB(item.timestamp);
      }
    } catch (e) {
      console.warn('No se pudo leer informe desde IndexedDB para recordatorios', e);
    }

    // Compatibilidad: si no se encuentra en IndexedDB pero el índice aún tiene contenido embebido
    if (!informe || !informe.contenido) {
      if (item.contenido) {
        informe = item;
      } else {
        continue;
      }
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = informe.contenido;
    
    // Extraer centro de cultivo y jaula del encabezado
    let centroCultivo = '';
    let jaula = '';
    
    const inputCentro = tempDiv.querySelector('.sync-centro');
    if (inputCentro) {
      centroCultivo = inputCentro.value || inputCentro.textContent.trim();
    }
    
    const inputArea = tempDiv.querySelector('.sync-area');
    if (inputArea) {
      const areaTexto = inputArea.value || inputArea.textContent.trim();
      const match = areaTexto.match(/JAULA N\.º(\d+)/i);
      if (match) {
        jaula = match[1];
      }
    }
    
    const tabla = tempDiv.querySelector('.tabla-bitacora tbody');
    if (tabla) {
      console.log('📄 Analizando bitácora de informe', informe.nombre);
      tabla.querySelectorAll('tr').forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 9) {
          let fecha = '';
          const fechaInput = celdas[1].querySelector('input[type="date"]');
          if (fechaInput) {
            fecha = fechaInput.value || fechaInput.textContent.trim();
          } else {
            fecha = celdas[1].textContent.trim();
          }
          const area = celdas[2].textContent.trim();
          const rotPen = parseInt(celdas[5].textContent.trim()) || 0;
          const objPen = parseInt(celdas[8].textContent.trim()) || 0;

          console.log('  • Fila bitácora -> fecha:', fecha, 'área:', area, 'rotPen:', rotPen, 'objPen:', objPen);
          
          if (rotPen > 0 || objPen > 0) {
            const recordatorioId = `${informe.nombre}-${area}-${fecha}`;
            
            // Verificar si ya existe
            const yaExiste = recordatoriosExistentes.some(r => r.id === recordatorioId);
            if (!yaExiste) {
              nuevosRecordatorios.push({
                id: recordatorioId,
                tipo: rotPen > 0 && objPen > 0 ? 'ambos' : (rotPen > 0 ? 'rotura' : 'anomalia'),
                area: area,
                centroCultivo: centroCultivo,
                jaula: jaula,
                fecha: fecha,
                roturasP: rotPen,
                anomaliasP: objPen,
                informe: informe.nombre,
                timestamp: informe.timestamp,
                creado: new Date().toISOString(),
                // estados independientes
                roturaCompletada: false,
                anomaliaCompletada: false,
                prioridad: (rotPen + objPen) > 5 ? 'alta' : (rotPen + objPen) > 2 ? 'media' : 'baja'
              });
            }
          }
        }
      });
    }
  }
  
  if (nuevosRecordatorios.length > 0) {
    const todosRecordatorios = [...recordatoriosExistentes, ...nuevosRecordatorios];
    guardarRecordatorios(todosRecordatorios);
  }
  
  return nuevosRecordatorios.length;
}

// Ver panel de recordatorios
function verPanelRecordatorios() {
  const recordatorios = obtenerRecordatorios();
  
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
  
  const contenido = document.createElement('div');
  contenido.style.cssText = 'background:#fff; padding:30px; border-radius:12px; max-width:900px; width:100%; max-height:85vh; overflow-y:auto;';
  
  function renderizarRecordatorios() {
    const recordatoriosActualizados = obtenerRecordatorios();
    const activos = recordatoriosActualizados.filter(r => {
      const tieneRoturaPend = (r.roturasP || 0) > 0 && !r.roturaCompletada;
      const tieneAnomPend = (r.anomaliasP || 0) > 0 && !r.anomaliaCompletada;
      return tieneRoturaPend || tieneAnomPend;
    });
    const completados = recordatoriosActualizados.filter(r => {
      const tieneRotPend = (r.roturasP || 0) > 0 && !r.roturaCompletada;
      const tieneAnomPend = (r.anomaliasP || 0) > 0 && !r.anomaliaCompletada;
      return !tieneRotPend && !tieneAnomPend;
    });

    const totalRoturasPend = activos.reduce((acc, r) => acc + (r.roturasP || 0), 0);
    const totalAnomaliasPend = activos.reduce((acc, r) => acc + (r.anomaliasP || 0), 0);
    
    contenido.innerHTML = `
      <h2 style="margin:0 0 24px 0; color:#1976d2; display:flex; align-items:center; gap:12px;">
        <span style="font-size:32px;">🔔</span>
        Recordatorios de Reparaciones
      </h2>

      <!-- Dashboard de pendientes -->
      <div style="display:flex; gap:16px; margin-bottom:20px; flex-wrap:wrap;">
        <div style="flex:1 1 200px; background:#fff3e0; border-radius:10px; padding:14px 16px; border:1px solid #ffe0b2; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:13px; color:#f57c00; font-weight:600;">Roturas pendientes</div>
            <div style="font-size:22px; font-weight:700; color:#e65100;">${totalRoturasPend}</div>
          </div>
          <button id="btnRepararRoturas" style="padding:8px 12px; background:#ef6c00; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600; white-space:nowrap;">🔧 Reparar roturas</button>
        </div>
        <div style="flex:1 1 200px; background:#e3f2fd; border-radius:10px; padding:14px 16px; border:1px solid #bbdefb; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:13px; color:#1565c0; font-weight:600;">Anomalías pendientes</div>
            <div style="font-size:22px; font-weight:700; color:#0d47a1;">${totalAnomaliasPend}</div>
          </div>
          <button id="btnRepararAnomalias" style="padding:8px 12px; background:#1976d2; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600; white-space:nowrap;">⚙️ Reparar anomalías</button>
        </div>
      </div>
      
      <!-- Filtros -->
      <div style="margin-bottom:16px;">
        <input type="text" id="buscarRecordatorio" placeholder="🔍 Buscar por área, fecha o informe..." style="width:100%; padding:10px 14px; border:2px solid #1976d2; border-radius:8px; font-size:14px; box-sizing:border-box;" />
      </div>
      
      <div style="margin-bottom:20px; display:flex; gap:10px;">
        <button id="generarNuevos" style="padding:10px 20px; background:#4caf50; color:white; border:none; border-radius:6px; cursor:pointer; margin-right:4px; font-size:14px; font-weight:600;">➕ Generar Nuevos</button>
        <button id="cerrarRecordatorios" style="padding:10px 20px; background:#757575; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;">✖️ Cerrar</button>
      </div>
      
      <div id="listaRecordatorios" style="display:flex; flex-direction:column; gap:16px; margin-bottom:20px;">
        <div>
          <h3 style="margin:0 0 8px 0; font-size:15px; color:#333;">Pendientes</h3>
          ${activos.length === 0 ? `
            <div style="text-align:center; padding:24px 16px; color:#999; border:1px dashed #ccc; border-radius:8px;">
              <div style="font-size:32px; margin-bottom:8px;">✅</div>
              <div style="font-size:14px;">No hay recordatorios pendientes</div>
              <div style="font-size:13px; margin-top:4px;">Usa "Generar Nuevos" para buscar reparaciones pendientes</div>
            </div>
          ` : `<div style="display:flex; flex-direction:column; gap:8px;">${activos.map(r => crearHTMLRecordatorio(r)).join('')}</div>`}
        </div>

        <div>
          <h3 style="margin:12px 0 8px 0; font-size:15px; color:#666;">Completados</h3>
          ${completados.length === 0 ? `
            <div style="font-size:13px; color:#aaa; padding:4px 2px;">Aún no hay recordatorios completados.</div>
          ` : `<div style="display:flex; flex-direction:column; gap:6px; max-height:160px; overflow-y:auto; border:1px solid #eee; border-radius:8px; padding:8px; background:#fafafa;">${completados.map(r => crearHTMLRecordatorio(r)).join('')}</div>`}
        </div>
      </div>
      
      <button id="cerrarRecordatorios" style="width:100%; padding:12px; background:#757575; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:600;">✖️ Cerrar</button>
    `;

    // Acciones de dashboard
    const btnRepararRoturas = contenido.querySelector('#btnRepararRoturas');
    if (btnRepararRoturas) {
      btnRepararRoturas.addEventListener('click', () => {
        const recs = obtenerRecordatorios();
        let modificados = 0;

        recs.forEach(r => {
          if ((r.roturasP || 0) > 0 && !r.roturaCompletada && r.timestamp) {
            r.roturaCompletada = true;
            modificados++;
          }
        });

        if (modificados > 0) {
          guardarRecordatorios(recs);
          mostrarNotificacion(`✅ Se marcaron todas las roturas pendientes como reparadas`, 3000);
          renderizarRecordatorios();
        } else {
          mostrarNotificacion('ℹ️ No hay roturas pendientes para marcar como reparadas', 2500);
        }
      });
    }

    const btnRepararAnomalias = contenido.querySelector('#btnRepararAnomalias');
    if (btnRepararAnomalias) {
      btnRepararAnomalias.addEventListener('click', () => {
        const recs = obtenerRecordatorios();
        let modificados = 0;

        recs.forEach(r => {
          if ((r.anomaliasP || 0) > 0 && !r.anomaliaCompletada && r.timestamp) {
            r.anomaliaCompletada = true;
            modificados++;
          }
        });

        if (modificados > 0) {
          guardarRecordatorios(recs);
          mostrarNotificacion(`✅ Se marcaron todas las anomalías pendientes como reparadas`, 3000);
          renderizarRecordatorios();
        } else {
          mostrarNotificacion('ℹ️ No hay anomalías pendientes para marcar como reparadas', 2500);
        }
      });
    }
    
    // Event listeners para filtros
    contenido.querySelectorAll('.filtro-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        contenido.querySelectorAll('.filtro-btn').forEach(b => {
          b.style.background = '#f5f5f5';
          b.style.color = '#333';
          b.style.border = '1px solid #ddd';
          b.classList.remove('active');
        });
        btn.style.background = '#1976d2';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.classList.add('active');
        
        const filtro = btn.dataset.filtro;
        aplicarFiltro(filtro);
      });
    });
    
    // Botón generar nuevos
    contenido.querySelector('#generarNuevos').addEventListener('click', async () => {
      const nuevos = await generarRecordatoriosAutomaticos();
      if (nuevos > 0) {
        mostrarNotificacion(`✅ Se generaron ${nuevos} recordatorios nuevos`, 3000);
        renderizarRecordatorios();
      } else {
        mostrarNotificacion('ℹ️ No se encontraron nuevas reparaciones pendientes', 3000);
      }
    });
    
    // Event listeners para acciones
    contenido.querySelectorAll('.btn-completar').forEach(btn => {
      btn.addEventListener('click', () => {
        const recordatorioId = btn.dataset.id;
        marcarRecordatorioCompletado(recordatorioId);
        renderizarRecordatorios();
      });
    });
    
    contenido.querySelectorAll('.btn-eliminar-rec').forEach(btn => {
      btn.addEventListener('click', () => {
        const recordatorioId = btn.dataset.id;
        eliminarRecordatorio(recordatorioId);
        renderizarRecordatorios();
      });
    });
    
    contenido.querySelector('#cerrarRecordatorios').addEventListener('click', () => {
      modal.remove();
    });
  }
  
  function aplicarFiltro(filtro) {
    const recordatorios = obtenerRecordatorios();
    let filtrados = [];
    
    if (filtro === 'todos') {
      filtrados = recordatorios.filter(r => {
        const tieneRoturaPend = (r.roturasP || 0) > 0 && !r.roturaCompletada;
        const tieneAnomPend = (r.anomaliasP || 0) > 0 && !r.anomaliaCompletada;
        return tieneRoturaPend || tieneAnomPend;
      });
    } else if (filtro === 'completados') {
      filtrados = recordatorios.filter(r => !((r.roturasP || 0) > 0 && !r.roturaCompletada) && !((r.anomaliasP || 0) > 0 && !r.anomaliaCompletada));
    } else {
      filtrados = recordatorios.filter(r => !r.completado && r.prioridad === filtro);
    }
    
    const lista = contenido.querySelector('#listaRecordatorios');
    if (filtrados.length === 0) {
      lista.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:#999;">
          <div style="font-size:48px; margin-bottom:12px;">📭</div>
          <div style="font-size:16px;">No hay recordatorios en esta categoría</div>
        </div>
      `;
    } else {
      lista.innerHTML = filtrados.map(r => crearHTMLRecordatorio(r)).join('');
      
      // Re-attach event listeners
      lista.querySelectorAll('.btn-completar').forEach(btn => {
        btn.addEventListener('click', () => {
          marcarRecordatorioCompletado(btn.dataset.id);
          renderizarRecordatorios();
        });
      });
      
      lista.querySelectorAll('.btn-eliminar-rec').forEach(btn => {
        btn.addEventListener('click', () => {
          eliminarRecordatorio(btn.dataset.id);
          renderizarRecordatorios();
        });
      });
    }
  }
  
  function crearHTMLRecordatorio(r) {
    const colorPrioridad = r.prioridad === 'alta' ? '#f44336' : (r.prioridad === 'media' ? '#ff9800' : '#4caf50');
    const iconoPrioridad = r.prioridad === 'alta' ? '🔴' : (r.prioridad === 'media' ? '🟠' : '🟢');
    const diasDesde = Math.floor((new Date() - new Date(r.creado)) / (1000 * 60 * 60 * 24));
    
    return `
      <div style="background:#f5f5f5; padding:16px; border-radius:8px; border-left:4px solid ${colorPrioridad}; ${r.completado ? 'opacity:0.6;' : ''}">
       
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
          <div style="flex:1;">
            <div style="font-weight:600; font-size:16px; color:#333; margin-bottom:4px;">
              ${iconoPrioridad} ${r.area}
              ${r.completado ? '<span style="background:#4caf50; color:white; padding:2px 8px; border-radius:12px; font-size:11px; margin-left:8px;">COMPLETADO</span>' : ''}
            </div>
            <div style="font-size:13px; color:#666; margin-bottom:8px;">
              ${r.centroCultivo ? `🏭 ${r.centroCultivo}` : ''} ${r.jaula ? `• 🔢 Jaula ${r.jaula}` : ''} ${r.centroCultivo || r.jaula ? '<br>' : ''}
              📅 ${r.fecha} • 📋 ${r.informe}
            </div>
            <div style="display:flex; gap:16px; font-size:13px;">
              ${ (r.roturasP || 0) > 0 && !r.roturaCompletada ? `<span style="color:#f44336; font-weight:600;">🔧 ${r.roturasP} rotura${r.roturasP > 1 ? 's' : ''} pendiente${r.roturasP > 1 ? 's' : ''}</span>` : ''}
              ${ (r.anomaliasP || 0) > 0 && !r.anomaliaCompletada ? `<span style="color:#ff9800; font-weight:600;">⚠️ ${r.anomaliasP} anomalía${r.anomaliasP > 1 ? 's' : ''} pendiente${r.anomaliasP > 1 ? 's' : ''}</span>` : ''}
            </div>
            <div style="font-size:12px; color:#999; margin-top:4px;">
              ${r.completado ? `Completado hace ${Math.floor((new Date() - new Date(r.fechaCompletado)) / (1000 * 60 * 60 * 24))} día(s)` : `Creado hace ${diasDesde} día(s)`}
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            ${!r.completado ? `
              <button class="btn-completar" data-id="${r.id}" style="padding:8px 12px; background:#4caf50; color:white; border:none; border-radius:6px; cursor:pointer; margin-right:4px; font-size:12px; font-weight:600; white-space:nowrap;">✅ Completar</button>
            ` : ''}
            <button class="btn-eliminar-rec" data-id="${r.id}" style="padding:8px 12px; background:#f44336; color:white; border:none; border-radius:6px; cursor:pointer; font-size:12px; font-weight:600;">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }
  
  renderizarRecordatorios();
  modal.appendChild(contenido);
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Marcar recordatorio como completado
function marcarRecordatorioCompletado(recordatorioId) {
  const recordatorios = obtenerRecordatorios();
  const recordatorio = recordatorios.find(r => r.id === recordatorioId);
  if (recordatorio) {
    recordatorio.completado = true;
    recordatorio.fechaCompletado = new Date().toISOString();
    guardarRecordatorios(recordatorios);
    mostrarNotificacion('✅ Recordatorio marcado como completado', 2000);
  }
}

// Eliminar recordatorio
function eliminarRecordatorio(recordatorioId) {
  if (confirm('¿Eliminar este recordatorio?')) {
    const recordatorios = obtenerRecordatorios();
    const nuevosRecordatorios = recordatorios.filter(r => r.id !== recordatorioId);
    guardarRecordatorios(nuevosRecordatorios);
    mostrarNotificacion('🗑️ Recordatorio eliminado', 2000);
  }
}

// Event listeners
if (guardarInforme) {
  guardarInforme.addEventListener('click', guardarInformeDiario);
}

if (verConsolidado) {
  verConsolidado.addEventListener('click', abrirListaInformesGuardados);
}

if (verEstadisticas) {
  verEstadisticas.addEventListener('click', verEstadisticasInformes);
}

if (verRecordatorios) {
  verRecordatorios.addEventListener('click', verPanelRecordatorios);
}

window.addEventListener('DOMContentLoaded', () => {
  // Aplicar zoom inicial al 90% para toda la aplicación
  try {
    document.body.style.zoom = '90%';
  } catch (e) {
    // fallback para navegadores sin soporte de zoom en body
    document.body.style.transform = 'scale(0.9)';
    document.body.style.transformOrigin = 'top left';
  }

  const exportarPDF = document.getElementById('exportarPDF');
  if (exportarPDF) {
    exportarPDF.addEventListener('click', exportarInformeAPDF);
  }
});

// Botón Nuevo Informe - limpia todo pero mantiene la bitácora
if (nuevoInforme) {
  nuevoInforme.addEventListener('click', () => {
    if (confirm('¿Crear un nuevo informe? Esto limpiará el contenido actual pero mantendrá los datos de la bitácora.')) {
      // Guardar la bitácora actual antes de limpiar
      guardarBitacora();

      // Limpiar únicamente las hojas adicionales, manteniendo la bitácora principal
      const bitacoraPrincipal = document.getElementById('bitacora-principal');
      if (bitacoraPrincipal) {
        panelLineas.innerHTML = '';
        panelLineas.appendChild(bitacoraPrincipal);
      } else {
        panelLineas.innerHTML = '';
        asegurarBitacoraAlFinal();
      }

      // Restaurar los datos de la bitácora (fechas y valores) y volver a bloquear filas usadas
      setTimeout(() => {
        restaurarBitacora();
        bloquearFilasBitacoraUsadas();
      }, 100);
      
      // Resetear el modo de edición si estaba activo
      if (guardarInforme.dataset.editandoIdx !== undefined) {
        delete guardarInforme.dataset.editandoIdx;
        guardarInforme.textContent = '💾 Guardar';
        guardarInforme.style.background = '';
      }
      
      alert('✅ Nuevo informe iniciado. Los datos de la bitácora se han preservado.');
    }
  });
}

// ================== LISTA Y EDICIÓN DE INFORMES ==================
async function abrirListaInformesGuardados() {
  try {
    const indice = JSON.parse(localStorage.getItem('informesGuardados') || '[]');
    if (!indice.length) {
      alert('No hay informes guardados.');
      return;
    }

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';

    const contenido = document.createElement('div');
    contenido.style.cssText = 'background:#fff; padding:24px; border-radius:12px; max-width:900px; width:100%; max-height:80vh; overflow:auto; box-shadow:0 4px 16px rgba(0,0,0,0.2);';

    const filas = indice
      .slice()
      .sort((a,b) => (b.timestamp||0) - (a.timestamp||0))
      .map((inf, idx) => {
        const fecha = inf.fecha || new Date(inf.timestamp || Date.now()).toISOString().split('T')[0];
        return `
          <tr data-idx="${idx}">
            <td>${idx + 1}</td>
            <td>${fecha}</td>
            <td>${inf.nombre || 'Sin nombre'}</td>
            <td>${new Date(inf.timestamp || Date.now()).toLocaleString()}</td>
            <td style="text-align:right;">
              <button class="btn-editar-inf" data-idx="${idx}" style="margin-right:6px; padding:4px 10px;">✏️ Editar</button>
              <button class="btn-eliminar-inf" data-idx="${idx}" style="padding:4px 10px;">🗑️ Eliminar</button>
            </td>
          </tr>`;
      }).join('');

    contenido.innerHTML = `
      <h2 style="margin:0 0 16px 0; color:#1976d2;">📁 Informes guardados</h2>
      <p style="margin:0 0 12px 0; color:#555; font-size:13px;">Haz clic en ✏️ Editar para cargar un informe en la bitácora y poder modificarlo.</p>
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px; text-align:left;">#</th>
            <th style="padding:8px; text-align:left;">Fecha</th>
            <th style="padding:8px; text-align:left;">Nombre</th>
            <th style="padding:8px; text-align:left;">Creado/Actualizado</th>
            <th style="padding:8px; text-align:right;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>
      <div style="margin-top:16px; text-align:right;">
        <button id="cerrarListaInformes" style="padding:8px 16px; background:#757575; color:#fff; border:none; border-radius:6px; cursor:pointer;">Cerrar</button>
      </div>
    `;

    modal.appendChild(contenido);
    document.body.appendChild(modal);

    contenido.querySelector('#cerrarListaInformes').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    // Manejar edición
    contenido.querySelectorAll('.btn-editar-inf').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx, 10);
        const item = indice[idx];
        if (!item || !item.timestamp) {
          alert('No se encontró la referencia del informe.');
          return;
        }
        const informe = await getInformeByTimestampIndexedDB(item.timestamp);
        if (!informe || !informe.contenido) {
          alert('No se pudo cargar el contenido del informe desde IndexedDB.');
          return;
        }

        // Guardar bitácora actual y limpiar panel
        guardarBitacora();
        panelLineas.innerHTML = '';
        asegurarBitacoraAlFinal();

        // Cargar contenido del informe
        panelLineas.innerHTML = informe.contenido;
        restaurarEventListenersInforme();

        // Al editar un informe, permitir editar nuevamente las filas ya usadas
        const tablaBitacora = document.querySelector('.tabla-bitacora tbody');
        if (tablaBitacora) {
          tablaBitacora.querySelectorAll('tr').forEach(tr => {
            tr.classList.remove('fila-bloqueada');
            tr.querySelectorAll('.editable-cell').forEach(td => {
              td.setAttribute('contenteditable', 'true');
            });
          });
        }

        // Marcar modo edición
        if (guardarInforme) {
          guardarInforme.dataset.editandoIdx = idx.toString();
          guardarInforme.textContent = '🔄 Actualizar';
          guardarInforme.style.background = '#1976d2';
          guardarInforme.style.color = '#fff';
        }

        modal.remove();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Manejar eliminación
    contenido.querySelectorAll('.btn-eliminar-inf').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx, 10);
        const item = indice[idx];
        if (!item) return;
        if (!confirm('¿Eliminar este informe guardado? Esta acción no se puede deshacer.')) return;

        // Eliminar del índice en localStorage
        const nuevoIndice = indice.filter((_, i) => i !== idx);
        localStorage.setItem('informesGuardados', JSON.stringify(nuevoIndice));

        // Opcional: eliminar también de IndexedDB
        try {
          const db = await openDB();
          const tx = db.transaction(STORE_INFORMES, 'readwrite');
          const store = tx.objectStore(STORE_INFORMES);
          const indexTS = store.index('timestamp');
          const req = indexTS.get(item.timestamp);
          req.onsuccess = () => {
            const rec = req.result;
            if (rec && rec.id != null) {
              store.delete(rec.id);
            }
          };
        } catch (_) {
          // si falla, al menos ya se eliminó del índice
        }

        modal.remove();
        abrirListaInformesGuardados();
      });
    });
  } catch (e) {
    console.error(e);
    alert('❌ Error al cargar la lista de informes guardados.');
  }
}

// ================== ESTADÍSTICAS DE INFORMES ==================
async function verEstadisticasInformes() {
  try {
    const indice = JSON.parse(localStorage.getItem('informesGuardados') || '[]');
    if (!indice.length) {
      alert('No hay informes guardados para calcular estadísticas.');
      return;
    }

    // Cargar contenido completo de cada informe desde IndexedDB
    const informesCompletos = [];
    for (const item of indice) {
      if (!item.timestamp) continue;
      const inf = await getInformeByTimestampIndexedDB(item.timestamp);
      if (inf && inf.contenido) {
        inf.fecha = item.fecha;
        inf.nombre = item.nombre;
        informesCompletos.push(inf);
      }
    }

    if (!informesCompletos.length) {
      alert('No se pudo leer el contenido de los informes desde IndexedDB.');
      return;
    }

    const stats = analizarDatosInformes(informesCompletos);

    const totalIncidencias = stats.totalRoturas + stats.totalAnomalias;
    const pctRotReparadas = stats.totalRoturas > 0 ? Math.round((stats.roturasReparadas / stats.totalRoturas) * 100) : 0;
    const pctAnomReparadas = stats.totalAnomalias > 0 ? Math.round((stats.anomaliasReparadas / stats.totalAnomalias) * 100) : 0;

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';

    const contenido = document.createElement('div');
    contenido.style.cssText = 'background:#fff; padding:24px; border-radius:12px; max-width:960px; width:100%; max-height:85vh; overflow:auto; box-shadow:0 4px 16px rgba(0,0,0,0.2);';

    const filasTendencia = (stats.tendenciaDias || []).map(d => `
      <tr>
        <td style="padding:4px 8px; border-bottom:1px solid #eee;">${d.fecha}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${d.roturas}</td>
      </tr>
    `).join('');

    const filasAreas = (stats.areasMasProblematicas || []).slice(0, 5).map(a => `
      <tr>
        <td style="padding:4px 8px; border-bottom:1px solid #eee;">${a.nombre}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${a.incidencias}</td>
      </tr>
    `).join('') || '<tr><td colspan="2" style="padding:8px; text-align:center; color:#888;">Sin datos suficientes</td></tr>';

    const filasDetalleAreas = Object.entries(stats.detallePorArea || {}).map(([area, det]) => `
      <tr>
        <td style="padding:4px 8px; border-bottom:1px solid #eee;">${area}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${det.rotInf}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${det.rotRep}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${det.rotPen}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${det.objInf}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${det.objRep}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eee; text-align:right;">${det.objPen}</td>
      </tr>
    `).join('') || '<tr><td colspan="7" style="padding:8px; text-align:center; color:#888;">Sin datos por área</td></tr>';

    contenido.innerHTML = `
      <h2 style="margin:0 0 16px 0; color:#1976d2; display:flex; align-items:center; gap:10px;">
        <span style="font-size:26px;">📊</span>
        Estadísticas de inspecciones
      </h2>
      <p style="margin:0 0 16px 0; color:#555; font-size:13px;">Resumen basado en los informes guardados de la bitácora de inspección.</p>

      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:18px;">
        <div style="flex:1 1 200px; background:#e3f2fd; border-radius:10px; padding:12px 14px;">
          <div style="font-size:12px; color:#1565c0; font-weight:600;">Roturas informadas</div>
          <div style="font-size:22px; font-weight:700; color:#0d47a1;">${stats.totalRoturas}</div>
          <div style="font-size:11px; color:#666;">Reparadas: ${stats.roturasReparadas} • Pendientes: ${stats.roturasPendientes}</div>
        </div>
        <div style="flex:1 1 200px; background:#ffebee; border-radius:10px; padding:12px 14px;">
          <div style="font-size:12px; color:#c62828; font-weight:600;">Anomalías informadas</div>
          <div style="font-size:22px; font-weight:700; color:#b71c1c;">${stats.totalAnomalias}</div>
          <div style="font-size:11px; color:#666;">Reparadas: ${stats.anomaliasReparadas} • Pendientes: ${stats.anomaliasPendientes}</div>
        </div>
        <div style="flex:1 1 200px; background:#e8f5e9; border-radius:10px; padding:12px 14px;">
          <div style="font-size:12px; color:#2e7d32; font-weight:600;">Cumplimiento</div>
          <div style="font-size:14px; color:#1b5e20;">Roturas: <strong>${pctRotReparadas}%</strong></div>
          <div style="font-size:14px; color:#1b5e20;">Anomalías: <strong>${pctAnomReparadas}%</strong></div>
          <div style="font-size:11px; color:#666; margin-top:4px;">Promedio roturas/día: ${stats.promedioRoturas}</div>
        </div>
        <div style="flex:1 1 200px; background:#fafafa; border-radius:10px; padding:12px 14px;">
          <div style="font-size:12px; color:#424242; font-weight:600;">Visión general</div>
          <div style="font-size:20px; font-weight:700; color:#212121;">${totalIncidencias}</div>
          <div style="font-size:11px; color:#666;">Total de incidencias (roturas + anomalías)</div>
        </div>
      </div>

      <div style="display:flex; flex-wrap:wrap; gap:20px; margin-bottom:12px;">
        <div style="flex:1 1 260px;">
          <h3 style="margin:0 0 8px 0; font-size:14px; color:#1976d2;">Tendencia de roturas por día</h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:6px 8px; text-align:left;">Fecha</th>
                <th style="padding:6px 8px; text-align:right;">Roturas</th>
              </tr>
            </thead>
            <tbody>
              ${filasTendencia || '<tr><td colspan="2" style="padding:8px; text-align:center; color:#888;">Sin datos de fechas</td></tr>'}
            </tbody>
          </table>
        </div>
        <div style="flex:1 1 260px;">
          <h3 style="margin:0 0 8px 0; font-size:14px; color:#1976d2;">Áreas más problemáticas</h3>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:6px 8px; text-align:left;">Área</th>
                <th style="padding:6px 8px; text-align:right;">Incidencias</th>
              </tr>
            </thead>
            <tbody>
              ${filasAreas}
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-top:12px;">
        <h3 style="margin:0 0 8px 0; font-size:14px; color:#1976d2;">Detalle por área</h3>
        <table style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:6px 8px; text-align:left;">Área</th>
              <th style="padding:6px 8px; text-align:right;">Roturas inf.</th>
              <th style="padding:6px 8px; text-align:right;">Roturas rep.</th>
              <th style="padding:6px 8px; text-align:right;">Roturas pend.</th>
              <th style="padding:6px 8px; text-align:right;">Anom. inf.</th>
              <th style="padding:6px 8px; text-align:right;">Anom. rep.</th>
              <th style="padding:6px 8px; text-align:right;">Anom. pend.</th>
            </tr>
          </thead>
          <tbody>
            ${filasDetalleAreas}
          </tbody>
        </table>
      </div>

      <div style="margin-top:16px; text-align:right;">
        <button id="cerrarEstadisticas" style="padding:8px 16px; background:#757575; color:#fff; border:none; border-radius:6px; cursor:pointer;">Cerrar</button>
      </div>
    `;

    modal.appendChild(contenido);
    document.body.appendChild(modal);

    contenido.querySelector('#cerrarEstadisticas').onclick = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  } catch (e) {
    console.error('Error al mostrar estadísticas', e);
    alert('No se pudieron calcular las estadísticas. Revisa la consola para más detalles.');
  }
}

// Botón Agregar Texto al Esquema
if (agregarTextoEsquema) {
  agregarTextoEsquema.addEventListener('click', () => {
    const lineaFinal = document.querySelector('.linea-final');
    
    if (!lineaFinal) {
      alert('⚠️ Primero debes crear un informe con un esquema');
      return;
    }
    
    const cajaTexto = document.createElement('div');
    cajaTexto.className = 'caja-texto-esquema';
    cajaTexto.contentEditable = true;
    cajaTexto.textContent = 'Texto';
    cajaTexto.style.cssText = `
      position: absolute;
      top: 50px;
      left: 50px;
      background: rgba(255, 255, 255, 0.95);
      border: 2px solid #1976d2;
      border-radius: 4px;
      padding: 4px 8px;
      min-width: 60px;
      max-width: 200px;
      font-size: 12px;
      cursor: move;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 100;
      word-wrap: break-word;
    `;
    
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '×';
    btnEliminar.className = 'btn-eliminar-texto-esquema';
    btnEliminar.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #d32f2f;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 14px;
      cursor: pointer;
      display: none;
      line-height: 1;
      padding: 0;
    `;
    
    btnEliminar.addEventListener('click', (e) => {
      e.stopPropagation();
      cajaTexto.remove();
    });
    
    cajaTexto.appendChild(btnEliminar);
    
    // Mostrar/ocultar botón eliminar
    cajaTexto.addEventListener('mouseenter', () => {
      btnEliminar.style.display = 'block';
    });
    
    cajaTexto.addEventListener('mouseleave', () => {
      btnEliminar.style.display = 'none';
    });
    
    // Seleccionar todo el texto al hacer doble clic
    cajaTexto.addEventListener('dblclick', () => {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(cajaTexto);
      selection.removeAllRanges();
      selection.addRange(range);
    });
    
    // Hacer la caja arrastrable
    let isDragging = false;
    let offsetX, offsetY;
    
    cajaTexto.addEventListener('mousedown', (e) => {
      if (e.target === btnEliminar) return;
      
      // Si no está editando, permitir arrastre
      if (!cajaTexto.matches(':focus')) {
        isDragging = true;
        // Calcular offset relativo a la caja
        const rect = cajaTexto.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        cajaTexto.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });
    
    const handleMouseMove = (e) => {
      if (isDragging) {
        const parentRect = lineaFinal.getBoundingClientRect();
        
        // Calcular nueva posición basada en la posición del mouse menos el offset
        let newLeft = e.clientX - parentRect.left - offsetX;
        let newTop = e.clientY - parentRect.top - offsetY;
        
        // Limitar dentro del contenedor
        newLeft = Math.max(0, Math.min(newLeft, parentRect.width - cajaTexto.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, parentRect.height - cajaTexto.offsetHeight));
        
        cajaTexto.style.left = newLeft + 'px';
        cajaTexto.style.top = newTop + 'px';
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        cajaTexto.style.cursor = 'move';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevenir arrastre cuando está en modo edición
    cajaTexto.addEventListener('focus', () => {
      cajaTexto.style.cursor = 'text';
    });
    
    cajaTexto.addEventListener('blur', () => {
      cajaTexto.style.cursor = 'move';
      if (cajaTexto.textContent.trim() === '') {
        cajaTexto.textContent = 'Texto';
      }
    });
    
    // Hacer la caja posicionable en toda la hoja (no solo dentro del esquema)
    const hojaContenedor = lineaFinal.closest('.hoja-fotos');
    if (hojaContenedor) {
      // Cambiar el contenedor padre para permitir posicionamiento en toda la hoja
      cajaTexto.remove();
      hojaContenedor.style.position = 'relative';
      hojaContenedor.appendChild(cajaTexto);
      
      // Actualizar el manejador de movimiento para el nuevo contenedor
      const handleMouseMoveGlobal = (e) => {
        if (isDragging) {
          const parentRect = hojaContenedor.getBoundingClientRect();
          const cajaRect = cajaTexto.getBoundingClientRect();
          
          let newLeft = e.clientX - parentRect.left - offsetX;
          let newTop = e.clientY - parentRect.top - offsetY;
          
          // Limitar dentro del contenedor de la hoja completa
          newLeft = Math.max(0, Math.min(newLeft, parentRect.width - cajaRect.width));
          newTop = Math.max(0, Math.min(newTop, parentRect.height - cajaRect.height));
          
          cajaTexto.style.left = newLeft + 'px';
          cajaTexto.style.top = newTop + 'px';
        }
      };
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousemove', handleMouseMoveGlobal);
    } else {
      lineaFinal.appendChild(cajaTexto);
    }
  });
}

// Botón Cargar Fotos desde el Menú
if (cargarFotosMenu) {
  cargarFotosMenu.addEventListener('click', () => {
    // Buscar el input de fotos más reciente (el que tiene multiple y está dentro de contenedor-cargar-fotos)
    const inputFotos = document.querySelector('.contenedor-cargar-fotos .input-file-hidden[multiple]');
    
    if (!inputFotos) {
      alert('⚠️ Primero debes crear un informe con un esquema');
      return;
    }
    
    // Simular click en el input de archivos
    inputFotos.click();
  });
}

// ========== FUNCIÓN DE EXPORTACIÓN USANDO VENTANA DE IMPRESIÓN ==========
function exportarInformeAPDF() {
  // Cerrar paneles si están abiertos
  cerrarPaneles();

  const menuLateral = document.querySelector('.menu-lateral');
  const mainContent = document.getElementById('mainContent');
  const contenidoPrincipal = document.getElementById('panelLineas');

  if (!contenidoPrincipal || !mainContent || !menuLateral) {
    alert('No se encontró el panel de hojas para imprimir.');
    return;
  }

  const mainContentDisplay = mainContent.style.display;
  const menuDisplay = menuLateral.style.display;
  const originalMargin = contenidoPrincipal.style.marginLeft;

  mainContent.style.display = '';
  menuLateral.style.display = 'none';
  contenidoPrincipal.style.marginLeft = '0';

  window.print();

  // Restaurar estado original después de abrir la ventana de impresión
  mainContent.style.display = mainContentDisplay;
  menuLateral.style.display = menuDisplay || 'flex';
  contenidoPrincipal.style.marginLeft = originalMargin || '60px';
}

// ========== EDITOR DE RECORTE DE IMAGEN ==========
function mostrarEditorRecorte(imagenSrc, callback) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;';
  
  const controles = document.createElement('div');
  controles.style.cssText = 'background:#fff; padding:16px; border-radius:8px; margin-bottom:16px; display:flex; gap:12px; align-items:center;';
  controles.innerHTML = `
    <button id="usarCompleta" style="padding:10px 16px; background:#4caf50; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">✓ Usar imagen completa</button>
    <button id="recortarBtn" style="padding:10px 16px; background:#1976d2; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">✂️ Aplicar recorte</button>
    <button id="cancelarBtn" style="padding:10px 16px; background:#f44336; color:#fff; border:none; border-radius:6px; cursor:pointer;">✕ Cancelar</button>
    <span style="margin-left:16px; color:#fff; font-weight:600;">Arrastra para seleccionar el área a usar</span>
  `;
  
  const contenedorCanvas = document.createElement('div');
  contenedorCanvas.style.cssText = 'position:relative; max-width:90%; max-height:70vh; overflow:auto; background:#333; border-radius:8px; display:flex; align-items:center; justify-content:center;';
  
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block; cursor:crosshair; max-width:100%; max-height:70vh; object-fit:contain;';
  const ctx = canvas.getContext('2d');
  
  contenedorCanvas.appendChild(canvas);
  modal.appendChild(controles);
  modal.appendChild(contenedorCanvas);
  document.body.appendChild(modal);
  
  // Cargar imagen
  const img = new Image();
  img.onload = () => {
    // Escalar la imagen para que quepa en la pantalla
    const maxWidth = window.innerWidth * 0.85;
    const maxHeight = window.innerHeight * 0.65;
    let escala = 1;
    
    if (img.width > maxWidth || img.height > maxHeight) {
      const escalaAncho = maxWidth / img.width;
      const escalaAlto = maxHeight / img.height;
      escala = Math.min(escalaAncho, escalaAlto);
    }
    
    const anchoCanvas = img.width * escala;
    const altoCanvas = img.height * escala;
    
    canvas.width = anchoCanvas;
    canvas.height = altoCanvas;
    canvas.style.width = anchoCanvas + 'px';
    canvas.style.height = altoCanvas + 'px';
    
    ctx.drawImage(img, 0, 0, anchoCanvas, altoCanvas);
    
    // Variables de selección
    let seleccionando = false;
    let startX, startY, endX, endY;
    const imgOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Dibujar selección
    function dibujarSeleccion() {
      ctx.putImageData(imgOriginal, 0, 0);
      if (startX !== undefined && startY !== undefined && endX !== undefined && endY !== undefined) {
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);
        const w = Math.abs(endX - startX);
        const h = Math.abs(endY - startY);
        
        // Oscurecer área no seleccionada
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, y); // Arriba
        ctx.fillRect(0, y, x, h); // Izquierda
        ctx.fillRect(x + w, y, canvas.width - (x + w), h); // Derecha
        ctx.fillRect(0, y + h, canvas.width, canvas.height - (y + h)); // Abajo
        
        // Marco de selección
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);
      }
    }
    
    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      startX = (e.clientX - rect.left) * (canvas.width / rect.width);
      startY = (e.clientY - rect.top) * (canvas.height / rect.height);
      seleccionando = true;
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (!seleccionando) return;
      const rect = canvas.getBoundingClientRect();
      endX = (e.clientX - rect.left) * (canvas.width / rect.width);
      endY = (e.clientY - rect.top) * (canvas.height / rect.height);
      dibujarSeleccion();
    });
    
    canvas.addEventListener('mouseup', () => {
      seleccionando = false;
    });
    
    // Botón usar completa
    controles.querySelector('#usarCompleta').addEventListener('click', () => {
      modal.remove();
      callback(imagenSrc);
    });
    
    // Botón recortar
    controles.querySelector('#recortarBtn').addEventListener('click', () => {
      if (startX === undefined || endX === undefined) {
        alert('Por favor selecciona un área primero');
        return;
      }
      
      const x = Math.min(startX, endX);
      const y = Math.min(startY, endY);
      const w = Math.abs(endX - startX);
      const h = Math.abs(endY - startY);
      
      if (w < 10 || h < 10) {
        alert('El área seleccionada es muy pequeña');
        return;
      }
      
      // Calcular coordenadas en imagen original
      const factorX = img.width / anchoCanvas;
      const factorY = img.height / altoCanvas;
      const xOriginal = x * factorX;
      const yOriginal = y * factorY;
      const wOriginal = w * factorX;
      const hOriginal = h * factorY;
      
      // Crear canvas temporal con el recorte en resolución original
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = wOriginal;
      tempCanvas.height = hOriginal;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(img, xOriginal, yOriginal, wOriginal, hOriginal, 0, 0, wOriginal, hOriginal);
      
      const imagenRecortada = tempCanvas.toDataURL('image/png');
      modal.remove();
      callback(imagenRecortada);
    });
    
    // Botón cancelar
    controles.querySelector('#cancelarBtn').addEventListener('click', () => {
      modal.remove();
    });
  };
  
  img.src = imagenSrc;
}

// ========== AUTOGUARDADO CADA 5 MINUTOS ==========
let autoguardadoActivo = true;
let ultimoAutoguardado = Date.now();

function autoguardarDatos() {
  if (!autoguardadoActivo) return;
  
  try {
    // Guardar bitácora automáticamente
    sincronizarBitacoraAlDOM();
    guardarBitacora();
    
    // Guardar estado actual del panel (borrador)
    const borrador = {
      contenido: panelLineas.innerHTML,
      timestamp: Date.now(),
      piloto: settings.pilotoDefault,
      fecha: settings.fechaDefault
    };
    
    localStorage.setItem('borradorAutoguardado', JSON.stringify(borrador));
    ultimoAutoguardado = Date.now();
    
    // Mostrar indicador visual discreto
    mostrarNotificacion('💾 Autoguardado', 2000);
    
    console.log('✅ Autoguardado completado:', new Date().toLocaleTimeString());
  } catch (e) {
    console.error('Error en autoguardado:', e);
  }
}

// Ejecutar autoguardado cada 5 minutos (300000 ms)
setInterval(autoguardarDatos, 300000);

// Función para mostrar notificaciones discretas
function mostrarNotificacion(mensaje, duracion = 3000) {
  const notif = document.createElement('div');
  notif.textContent = mensaje;
  notif.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, duracion);
}

// Agregar estilos de animación
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(styleSheet);

// Recuperar borrador al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const panelLineas = document.getElementById('panelLineas');
  if (panelLineas) {
    const pruebaDiv = panelLineas.querySelector('div');
    if (pruebaDiv && pruebaDiv.textContent.includes('PRUEBA PDF')) {
      pruebaDiv.remove();
    }
  }
  
  const borrador = localStorage.getItem('borradorAutoguardado');
  if (borrador) {
    try {
      const datos = JSON.parse(borrador);
      const tiempoTranscurrido = Date.now() - datos.timestamp;
      
      // Si el borrador tiene menos de 24 horas
      if (tiempoTranscurrido < 86400000) {
        const recuperar = confirm('📋 Se detectó un borrador autoguardado. ¿Deseas recuperarlo?');
        if (recuperar && datos.contenido) {
          panelLineas.innerHTML = datos.contenido;
          restaurarBitacora();
          mostrarNotificacion('✅ Borrador recuperado', 3000);
        }
      } else {
        // Limpiar borradores antiguos
        localStorage.removeItem('borradorAutoguardado');
      }
    } catch (e) {
      console.error('Error al recuperar borrador:', e);
    }
  }
});

// ========== INICIALIZACIÓN ==========
// Actualizar badge de recordatorios al cargar
actualizarBadgeRecordatorios();

// Generar recordatorios automáticamente cada vez que se carga la página
setTimeout(() => {
  const nuevos = generarRecordatoriosAutomaticos();
  if (nuevos > 0) {
    mostrarNotificacion(`🔔 ${nuevos} nuevo${nuevos > 1 ? 's' : ''} recordatorio${nuevos > 1 ? 's' : ''} generado${nuevos > 1 ? 's' : ''}`, 4000);
  }
}, 2000);

// ========== MODO OFFLINE AVANZADO - PWA ==========

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration.scope);
        
        // Verificar actualizaciones del Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Nueva versión del Service Worker disponible');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nueva versión disponible
              if (confirm('📦 Nueva versión disponible. ¿Recargar para actualizar?')) {
                newWorker.postMessage({ action: 'skipWaiting' });
                window.location.reload();
              }
            }
          });
        });
        
        // Mostrar notificación de PWA lista
        setTimeout(() => {
          mostrarPWAStatus();
        }, 1000);
      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });
  });
  
  // Escuchar cambios en el controller (nuevo SW activo)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker actualizado');
  });
}

// Detectar estado online/offline
const offlineIndicator = document.getElementById('offlineIndicator');

function actualizarEstadoConexion() {
  if (!offlineIndicator) return;
  
  if (navigator.onLine) {
    offlineIndicator.classList.add('online');
    offlineIndicator.classList.remove('oculto');
    offlineIndicator.querySelector('.offline-icon').textContent = '✅';
    offlineIndicator.querySelector('.offline-text').textContent = 'Modo Online';
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      offlineIndicator.classList.add('oculto');
    }, 3000);
  } else {
    offlineIndicator.classList.remove('online');
    offlineIndicator.classList.remove('oculto');
    offlineIndicator.querySelector('.offline-icon').textContent = '⚠️';
    offlineIndicator.querySelector('.offline-text').textContent = 'Modo Offline';
  }
}

window.addEventListener('online', () => {
  console.log('✅ Conexión restaurada');
  actualizarEstadoConexion();
  mostrarNotificacion('✅ Conexión restaurada', 3000);
});

window.addEventListener('offline', () => {
  console.log('⚠️ Sin conexión - Modo Offline');
  actualizarEstadoConexion();
  mostrarNotificacion('⚠️ Trabajando sin conexión', 3000);
});


// Verificar estado inicial
if (!navigator.onLine && offlineIndicator) {
  actualizarEstadoConexion();
}

// Mostrar panel de estado PWA
function mostrarPWAStatus() {
  const pwaStatus = document.getElementById('pwaStatus');
  if (!pwaStatus) return;
  
  pwaStatus.classList.remove('oculto');
  
  const closeBtn = document.getElementById('closePwaStatus');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      pwaStatus.classList.add('oculto');
    });
  }
  
  // Auto-ocultar después de 8 segundos
  setTimeout(() => {
    pwaStatus.classList.add('oculto');
  }, 8000);
}

// Instalación de PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📱 PWA puede ser instalada');
  e.preventDefault();
  deferredPrompt = e;
  
  // Mostrar botón de instalación
  mostrarBotonInstalar();
});

function mostrarBotonInstalar() {
  const btnInstalar = document.createElement('button');
  btnInstalar.id = 'installPwaBtn';
  btnInstalar.className = 'install-pwa-btn';
  btnInstalar.innerHTML = '📱 Instalar Aplicación';
  btnInstalar.style.display = 'block';
  
  btnInstalar.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);
    
    if (outcome === 'accepted') {
      mostrarNotificacion('✅ Aplicación instalada correctamente', 3000);
    }
    
    deferredPrompt = null;
    btnInstalar.style.display = 'none';
  });
  
  document.body.appendChild(btnInstalar);
  
  // Auto-ocultar después de 15 segundos
  setTimeout(() => {
    btnInstalar.style.display = 'none';
  }, 15000);
}

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA instalada exitosamente');
  mostrarNotificacion('✅ Aplicación instalada - Ahora puedes usarla offline', 4000);
  deferredPrompt = null;
});

// Gestión de cache desde la interfaz
function obtenerEstadoCache() {
  if (!navigator.serviceWorker.controller) {
    return Promise.resolve({ cached: 0, total: 0 });
  }
  
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };
    
    navigator.serviceWorker.controller.postMessage(
      { action: 'getCacheStatus' },
      [messageChannel.port2]
    );
  });
}

function limpiarCache() {
  if (!navigator.serviceWorker.controller) {
    alert('⚠️ Service Worker no está activo');
    return;
  }
  
  if (confirm('¿Limpiar toda la caché de la aplicación?\n\nEsto eliminará los recursos guardados para uso offline.')) {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.success) {
        mostrarNotificacion('✅ Caché limpiada correctamente', 3000);
        setTimeout(() => {
          if (confirm('Se recomienda recargar la página. ¿Recargar ahora?')) {
            location.reload();
          }
        }, 1000);
      }
    };
    
    navigator.serviceWorker.controller.postMessage(
      { action: 'clearCache' },
      [messageChannel.port2]
    );
  }
}

// ========== SISTEMA DE SINCRONIZACIÓN EN SEGUNDO PLANO ==========

// Cola de sincronización
let colaSincronizacion = JSON.parse(localStorage.getItem('colaSincronizacion') || '[]');

// Guardar cola en localStorage
function guardarColaSincronizacion() {
  try {
    // Limitar tamaño máximo de la cola para evitar QuotaExceededError
    const MAX_ITEMS_COLA = 50;
    if (colaSincronizacion.length > MAX_ITEMS_COLA) {
      // Mantener solo las últimas operaciones más recientes
      colaSincronizacion = colaSincronizacion.slice(-MAX_ITEMS_COLA);
    }

    localStorage.setItem('colaSincronizacion', JSON.stringify(colaSincronizacion));
  } catch (e) {
    console.warn('No se pudo guardar colaSincronizacion, limpiando cola:', e);
    // Si se excede la cuota, vaciar cola para no bloquear el guardado del informe
    colaSincronizacion = [];
    try {
      localStorage.removeItem('colaSincronizacion');
    } catch (_) {
      // ignorar
    }
  }
  actualizarContadorColaSincronizacion();
}

// Agregar operación a la cola de sincronización
function agregarAColaSincronizacion(operacion) {
  const item = {
    id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    intentos: 0,
    maxIntentos: 3,
    ...operacion
  };
  
  colaSincronizacion.push(item);
  guardarColaSincronizacion();
  
  console.log('📝 Operación agregada a cola de sincronización:', item.type);
  
  // Intentar sincronizar inmediatamente si hay conexión
  if (navigator.onLine) {
    registrarSincronizacion();
  }
  
  return item.id;
}

// Registrar sincronización con Service Worker
async function registrarSincronizacion() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-informes');
      console.log('✅ Sincronización registrada');
    } catch (error) {
      console.error('❌ Error al registrar sincronización:', error);
      // Fallback: intentar sincronizar directamente
      procesarColaSincronizacionDirecta();
    }
  } else {
    // Fallback para navegadores sin Background Sync
    procesarColaSincronizacionDirecta();
  }
}

// Procesar cola de sincronización directamente (fallback)
async function procesarColaSincronizacionDirecta() {
  if (!navigator.onLine) {
    console.log('⚠️ Sin conexión - sincronización pospuesta');
    return;
  }
  
  if (colaSincronizacion.length === 0) {
    console.log('✅ No hay operaciones pendientes de sincronización');
    return;
  }
  
  console.log(`📤 Procesando ${colaSincronizacion.length} operaciones pendientes...`);
  
  const operacionesProcesadas = [];
  const operacionesFallidas = [];
  
  for (const item of colaSincronizacion) {
    try {
      await procesarOperacionSincronizacion(item);
      operacionesProcesadas.push(item);
      console.log('✅ Operación sincronizada:', item.id);
    } catch (error) {
      console.error('❌ Error al sincronizar operación:', item.id, error);
      item.intentos++;
      
      if (item.intentos >= item.maxIntentos) {
        operacionesFallidas.push(item);
        console.error('❌ Operación descartada tras múltiples intentos:', item.id);
      }
    }
  }
  
  // Remover operaciones procesadas y fallidas
  colaSincronizacion = colaSincronizacion.filter(
    item => !operacionesProcesadas.includes(item) && !operacionesFallidas.includes(item)
  );
  
  guardarColaSincronizacion();
  
  // Mostrar resultado
  if (operacionesProcesadas.length > 0) {
    mostrarNotificacion(`✅ ${operacionesProcesadas.length} operación(es) sincronizada(s)`, 3000);
  }
  
  if (operacionesFallidas.length > 0) {
    mostrarNotificacion(`⚠️ ${operacionesFallidas.length} operación(es) fallaron`, 3000);
  }
}

// Procesar una operación individual
async function procesarOperacionSincronizacion(operacion) {
  // Simulación de envío a servidor
  // En producción, aquí iría la llamada real a la API
  
  console.log('📤 Enviando al servidor:', operacion.type, operacion.data);
  
  // Ejemplo de cómo sería con backend real:
  /*
  const response = await fetch('https://tu-api.com/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer tu-token'
    },
    body: JSON.stringify(operacion)
  });
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  return await response.json();
  */
  
  // Simulación de éxito
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, syncedAt: new Date().toISOString() });
    }, 500);
  });
}

// Actualizar contador de cola de sincronización
function actualizarContadorColaSincronizacion() {
  const contador = document.getElementById('contadorColaSinc');
  if (contador) {
    const pendientes = colaSincronizacion.length;
    if (pendientes > 0) {
      contador.textContent = pendientes;
      contador.style.display = 'inline-block';
    } else {
      contador.style.display = 'none';
    }
  }
}

// Ver estado de sincronización
function verEstadoSincronizacion() {
  const pendientes = colaSincronizacion.length;
  const ultimaSinc = localStorage.getItem('ultimaSincronizacion');
  
  let mensaje = `📊 Estado de Sincronización\n\n`;
  mensaje += `📝 Operaciones pendientes: ${pendientes}\n`;
  
  if (ultimaSinc) {
    const fecha = new Date(ultimaSinc);
    mensaje += `✅ Última sincronización: ${fecha.toLocaleString()}\n`;
  } else {
    mensaje += `✅ Última sincronización: Nunca\n`;
  }
  
  mensaje += `\n🌐 Estado de conexión: ${navigator.onLine ? '✅ Online' : '⚠️ Offline'}`;
  
  if (pendientes > 0) {
    mensaje += `\n\n📋 Operaciones en cola:\n`;
    colaSincronizacion.slice(0, 5).forEach((op, idx) => {
      mensaje += `\n${idx + 1}. ${op.type} (${op.intentos}/${op.maxIntentos} intentos)`;
    });
    
    if (pendientes > 5) {
      mensaje += `\n... y ${pendientes - 5} más`;
    }
  }
  
  alert(mensaje);
}

// Forzar sincronización manual
async function forzarSincronizacion() {
  if (!navigator.onLine) {
    alert('⚠️ No hay conexión a internet.\n\nLa sincronización se ejecutará automáticamente cuando se recupere la conexión.');
    return;
  }
  
  if (colaSincronizacion.length === 0) {
    alert('✅ No hay operaciones pendientes de sincronización.');
    return;
  }
  
  if (confirm(`¿Sincronizar ${colaSincronizacion.length} operación(es) pendiente(s)?`)) {
    mostrarNotificacion('📤 Sincronizando...', 2000);
    await procesarColaSincronizacionDirecta();
    
    if (colaSincronizacion.length === 0) {
      localStorage.setItem('ultimaSincronizacion', new Date().toISOString());
    }
  }
}

// Limpiar cola de sincronización
function limpiarColaSincronizacion() {
  if (confirm('¿Eliminar todas las operaciones pendientes de sincronización?\n\n⚠️ Esta acción no se puede deshacer.')) {
    colaSincronizacion = [];
    guardarColaSincronizacion();
    mostrarNotificacion('🗑️ Cola de sincronización limpiada', 2000);
  }
}

// Interceptar guardado de informes para agregar a cola
const guardarInformeDiarioOriginal = guardarInformeDiario;

// Escuchar mensajes del Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('📨 Mensaje del Service Worker:', event.data);
    
    if (event.data.type === 'SYNC_COMPLETE') {
      console.log('✅ Sincronización completada:', event.data.count, 'elementos');
      localStorage.setItem('ultimaSincronizacion', new Date().toISOString());
      mostrarNotificacion(`✅ ${event.data.count} operación(es) sincronizada(s)`, 3000);
      
      // Limpiar cola local después de sincronización exitosa
      colaSincronizacion = [];
      guardarColaSincronizacion();
    }
    
    if (event.data.type === 'OPERATIONS_SYNCED') {
      console.log('✅ Operaciones procesadas:', event.data.count);
    }
  });
}

// Sincronizar automáticamente cuando vuelve la conexión
window.addEventListener('online', () => {
  console.log('✅ Conexión restaurada - iniciando sincronización automática');
  
  setTimeout(() => {
    if (colaSincronizacion.length > 0) {
      mostrarNotificacion(`📤 Sincronizando ${colaSincronizacion.length} operación(es) pendiente(s)...`, 2000);
      registrarSincronizacion();
    }
  }, 1000);
});

// Actualizar contador al cargar
actualizarContadorColaSincronizacion();

// Solicitar permisos de notificaciones (opcional)
function solicitarPermisoNotificaciones() {
  if (!('Notification' in window)) {
    console.log('❌ Este navegador no soporta notificaciones');
    return;
  }
  
  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('✅ Permiso de notificaciones concedido');
        mostrarNotificacion('✅ Notificaciones activadas', 3000);
      }
    });
  }
}

// Llamar después de unos segundos (opcional, no intrusivo)
setTimeout(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    // No solicitar automáticamente, dejar que el usuario lo active si lo desea
  }
}, 5000);

console.log('🚀 Sistema de modo offline avanzado inicializado');


