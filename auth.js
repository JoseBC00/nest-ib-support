
/* ========================================
   NEST IB SUPPORT - AUTENTICACIÓN
   ======================================== */

// 1. CONFIGURACIÓN DE SUPABASE

const SUPABASE_URL = window.NEST_CONFIG?.url;
const SUPABASE_KEY = window.NEST_CONFIG?.publishableKey;

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// 2. ELEMENTOS DEL FORMULARIO

const formulario = document.getElementById("formAuth");
const email = document.getElementById("email");
const password = document.getElementById("password");
const mensaje = document.getElementById("mensaje");

const panel = document.getElementById("panelUsuario");
const usuarioActual = document.getElementById("usuarioActual");

const btnLogin = document.getElementById("btnLogin");
const btnRegistro = document.getElementById("btnRegistro");
const btnSalir = document.getElementById("btnSalir");

const nicknameInput = document.getElementById("nickname");
const campoNickname = document.getElementById("campoNickname");

const btnMostrarRegistro =
  document.getElementById("btnMostrarRegistro");

const editarNickname =
  document.getElementById("editarNickname");

const btnGuardarNickname =
  document.getElementById("btnGuardarNickname");

// 3. ESTADO

let modoRegistro = false;

// 4. FUNCIONES GENERALES

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}

function trabajando(activo) {
  btnLogin.disabled = activo;
  btnRegistro.disabled = activo;
  btnMostrarRegistro.disabled = activo;
}

function actualizarPantalla(usuario) {
  const conectado = Boolean(usuario);

  formulario.hidden = conectado;
  btnMostrarRegistro.hidden = conectado;
  panel.hidden = !conectado;

  usuarioActual.textContent = conectado
    ? `Cuenta: ${usuario.email}`
    : "";
}

function validarNickname(nombre) {
  return nombre.length >= 3 && nombre.length <= 30;
}

// 5. MOSTRAR FORMULARIO DE REGISTRO

btnMostrarRegistro.addEventListener("click", () => {
  modoRegistro = !modoRegistro;

  campoNickname.hidden = !modoRegistro;

  btnMostrarRegistro.textContent = modoRegistro
    ? "Volver al inicio de sesión"
    : "Registrarme con un seudónimo";

  mostrarMensaje(
    modoRegistro
      ? "Escribe un seudónimo y selecciona Crear cuenta."
      : ""
  );
});

// 6. INICIAR SESIÓN

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  trabajando(true);
  mostrarMensaje("");

  try {
    const { error } = await db.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value
    });

    if (error) {
      throw error;
    }

    password.value = "";

    mostrarMensaje("Sesión iniciada correctamente.");

  } catch (error) {
    mostrarMensaje("Error: " + error.message);

  } finally {
    trabajando(false);
  }
});

// 7. CREAR CUENTA

btnRegistro.addEventListener("click", async () => {

  if (!formulario.reportValidity()) {
    return;
  }

  if (!modoRegistro) {
    mostrarMensaje(
      "Primero selecciona 'Registrarme con un seudónimo'."
    );
    return;
  }

  const nombre = nicknameInput.value.trim();

  if (!validarNickname(nombre)) {
    mostrarMensaje(
      "El seudónimo debe tener entre 3 y 30 caracteres."
    );
    return;
  }

  trabajando(true);
  mostrarMensaje("");

  try {
    const { data, error } = await db.auth.signUp({
      email: email.value.trim(),
      password: password.value,

      options: {
        emailRedirectTo:
          window.location.origin + window.location.pathname,

        data: {
          nickname: nombre
        }
      }
    });

    if (error) {
      throw error;
    }

    password.value = "";

    if (data.session) {
      mostrarMensaje(
        "Cuenta creada correctamente. ¡Bienvenido!"
      );
    } else {
      mostrarMensaje(
        "Registro recibido. Revisa tu correo para confirmar tu cuenta."
      );
    }

  } catch (error) {
    mostrarMensaje("Error al registrarse: " + error.message);

  } finally {
    trabajando(false);
  }
});

// 8. CARGAR SEUDÓNIMO

async function cargarNickname(usuario) {
  if (!usuario) {
    return;
  }

  const { data, error } = await db
    .from("profiles")
    .select("nickname")
    .eq("id", usuario.id)
    .single();

  if (error) {
    mostrarMensaje(
      "No se pudo cargar el perfil: " + error.message
    );
    return;
  }

  editarNickname.value = data.nickname;
}

// 9. ACTUALIZAR SEUDÓNIMO

btnGuardarNickname.addEventListener("click", async () => {

  const nuevoNombre = editarNickname.value.trim();

  if (!validarNickname(nuevoNombre)) {
    mostrarMensaje(
      "El seudónimo debe tener entre 3 y 30 caracteres."
    );
    return;
  }

  btnGuardarNickname.disabled = true;
  mostrarMensaje("");

  try {
    const { data: authData, error: authError } =
      await db.auth.getUser();

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Debes iniciar sesión nuevamente.");
    }

    const { data, error } = await db
      .from("profiles")
      .update({ nickname: nuevoNombre })
      .eq("id", authData.user.id)
      .select("nickname")
      .single();

    if (error) {
      throw error;
    }

    editarNickname.value = data.nickname;

    mostrarMensaje(
      "¡Tu seudónimo se actualizó correctamente!"
    );

  } catch (error) {
    mostrarMensaje("Error: " + error.message);

  } finally {
    btnGuardarNickname.disabled = false;
  }
});

// 10. CERRAR SESIÓN

btnSalir.addEventListener("click", async () => {

  const { error } = await db.auth.signOut();

  if (error) {
    mostrarMensaje("Error: " + error.message);
    return;
  }

  actualizarPantalla(null);
  editarNickname.value = "";

  mostrarMensaje("Sesión cerrada correctamente.");
});

// 11. ESCUCHAR CAMBIOS DE SESIÓN

db.auth.onAuthStateChange((_evento, sesion) => {

  const usuario = sesion?.user ?? null;

  actualizarPantalla(usuario);

  if (!usuario) {
    editarNickname.value = "";
  }
});

// 12. CARGAR SESIÓN AL INICIAR

async function iniciar() {
  try {
    const { data, error } = await db.auth.getUser();

    if (error) {
      if (error.name !== "AuthSessionMissingError") {
        throw error;
      }
    }

    const usuario = data?.user ?? null;

    actualizarPantalla(usuario);

    if (usuario) {
      await cargarNickname(usuario);
    }

  } catch (error) {
    mostrarMensaje(
      "Error al recuperar la sesión: " + error.message
    );
  }
}

iniciar();
