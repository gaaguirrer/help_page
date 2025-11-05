document.addEventListener('DOMContentLoaded', () => {
    // Definición de acciones por categoría
    const accionesPorCategoria = {
        Factura: ["Agregar", "Actualizar", "Buscar", "Eliminar"],
        Producto: ["Agregar", "Actualizar", "Eliminar"],
        Usuario: ["Registrar", "Actualizar", "Desactivar"],
        Compra: ["Realizar", "Historial"],
        Inventario: ["Revisar", "Actualizar"],
        Categoría: ["Crear", "Eliminar"],
        Reportes: ["Generar", "Descargar"],
        Detalle: ["Agregar", "Quitar"]
    };

    // Función para actualizar el título y cargar acciones según la categoría seleccionada
    window.updateTitle = function (categoria) {
        document.querySelector("#titulo-secundario").innerText = categoria;
        cargarAcciones(categoria);
    };

    // Función para cargar las acciones de cada categoría
    function cargarAcciones(categoria) {
        const contenedorAcciones = document.querySelector("#acciones");
        const areaAyuda = document.querySelector("#area-ayuda iframe");
        contenedorAcciones.innerHTML = "";

        accionesPorCategoria[categoria]?.forEach(accion => {
            const boton = document.createElement("button");
            boton.innerText = accion;

            boton.addEventListener("click", () => {
                // Remover clases activas de otros botones
                document.querySelectorAll("#acciones button").forEach(btn => btn.classList.remove("activo"));
                boton.classList.add("activo");

                // Construir la ruta del archivo HTML que se cargará en el iframe
                const ruta = `contenido/${categoria.toLowerCase()}/${accion.toLowerCase()}.html`;
                cargarContenidoIframe(ruta);
            });

            contenedorAcciones.appendChild(boton);
        });

        // Limpiar el contenido del iframe al cambiar de categoría
        areaAyuda.src = "";
    }

    // Función para manejar los botones del menú principal
    const botonesMenuPrincipal = document.querySelectorAll('.nav button');
    botonesMenuPrincipal.forEach(boton => {
        boton.addEventListener('click', () => {
            // Remover clases activas de otros botones
            botonesMenuPrincipal.forEach(btn => btn.classList.remove('activo'));
            boton.classList.add('activo');
        });
    });

    // Función para cargar contenido en el iframe y verificar la carga del archivo CSS
    function cargarContenidoIframe(path) {
        const areaAyuda = document.querySelector('#area-ayuda iframe');

        // Actualizar la ruta del iframe
        areaAyuda.src = path;

        // Verificar si el archivo CSS está cargado; si no, agregarlo
        const cssPath = "estilos/help-styles.css";
        if (!document.querySelector(`link[href="${cssPath}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cssPath;
            document.head.appendChild(link);
        }
    }
});
