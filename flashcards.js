
const tarjetas = [
  {
    pregunta: "¿Cuál es la derivada de x²?",
    respuesta: "2x"
  },
  {
    pregunta: "¿Qué es una fuente primaria?",
    respuesta: "Una fuente creada en el periodo estudiado o por un testigo directo."
  },
  {
    pregunta: "¿Qué representa el ADN?",
    respuesta: "La molécula que almacena la información genética."
  }
];

let indice = 0;

const pregunta = document.getElementById("pregunta");
const respuesta = document.getElementById("respuesta");
const contador = document.getElementById("contador");
const mostrar = document.getElementById("mostrar");
const siguiente = document.getElementById("siguiente");

function cargarTarjeta() {
  pregunta.textContent = tarjetas[indice].pregunta;
  respuesta.textContent = tarjetas[indice].respuesta;
  respuesta.hidden = true;
  mostrar.textContent = "Mostrar respuesta";

  contador.textContent =
    `Tarjeta ${indice + 1} de ${tarjetas.length}`;
}

mostrar.addEventListener("click", () => {
  respuesta.hidden = !respuesta.hidden;

  mostrar.textContent = respuesta.hidden
    ? "Mostrar respuesta"
    : "Ocultar respuesta";
});

siguiente.addEventListener("click", () => {
  indice = (indice + 1) % tarjetas.length;
  cargarTarjeta();
});

cargarTarjeta();
