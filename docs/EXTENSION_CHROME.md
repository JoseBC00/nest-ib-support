# Extensión de Chrome (complemento opcional)

Se conserva la idea de un acceso rápido a NEST IB original y NEST IB SUPPORT. Esta extensión v0.2 incluye atajos a la nueva web y biblioteca, un campo para guardar la URL real de Vercel y la opción de guardar páginas de investigación **localmente** en Chrome.

**No sincroniza los favoritos del NEST IB original**: el repositorio original pertenece a un compañero y no tenemos su API ni autorización de escritura. No es correcto simular esa sincronización.

Para probarla gratis: Chrome → `chrome://extensions` → activar **Modo desarrollador** → **Cargar descomprimida** → seleccionar exclusivamente la carpeta `extension/`. En la ventana emergente cambia la URL de SUPPORT a tu despliegue real y pulsa Guardar. No pagas hasta que decidas publicar en Chrome Web Store.

La extensión no solicita acceso a todas las páginas web; utiliza `activeTab` solo cuando pulsas el icono para guardar la página actual. Almacena como máximo 100 enlaces en el navegador sin servidores.
