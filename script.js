
const botones = document.querySelectorAll("[data-herramienta]");

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    const herramienta = boton.dataset.herramienta;

    alert(
      `Próximamente: ${herramienta}.\n` +
      "Estamos construyendo esta herramienta."
    );
  });
});

console.log("NEST IB SUPPORT iniciado correctamente.");
