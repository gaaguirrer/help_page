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

    // Normaliza nombres de carpeta (evitar acentos/espacios)
    const categoriaToPath = (nombre) => {
        const mapa = {
            'Categoría': 'categoria'
        };
        if (mapa[nombre]) return mapa[nombre];
        return nombre
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    // Función para actualizar el título y cargar acciones según la categoría seleccionada
    window.updateTitle = function (categoria) {
        document.querySelector("#titulo-secundario").innerText = categoria;
        cargarAcciones(categoria);
        // Actualiza hash para enlaces profundos
        const params = new URLSearchParams(location.hash.replace(/^#/, ''));
        params.set('categoria', categoria);
        params.delete('accion');
        location.hash = params.toString();
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
                document.querySelectorAll("#acciones button").forEach(btn => {
                    btn.classList.remove("activo");
                    btn.removeAttribute('aria-current');
                });
                boton.classList.add("activo");
                boton.setAttribute('aria-current', 'true');

                // Construir la ruta del archivo HTML que se cargará en el iframe
                const ruta = `contenido/${categoriaToPath(categoria)}/${accion.toLowerCase()}.html`;
                cargarContenidoIframe(ruta);

                // Añade acción al hash
                const params = new URLSearchParams(location.hash.replace(/^#/, ''));
                params.set('accion', accion);
                location.hash = params.toString();
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
            botonesMenuPrincipal.forEach(btn => {
                btn.classList.remove('activo');
                btn.removeAttribute('aria-current');
            });
            boton.classList.add('activo');
            boton.setAttribute('aria-current', 'true');
        });
    });

    // Cargar contenido en iframe e inyectar CSS dentro del documento del iframe
    function cargarContenidoIframe(path) {
        const iframe = document.querySelector('#area-ayuda iframe');

        // Indicador simple de carga accesible
        iframe.setAttribute('title', 'Área de ayuda (cargando...)');

        const onLoad = () => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                    // Inyecta la hoja de estilos en el head del iframe si no está
                    const cssPath = "estilos/help-styles.css";
                    if (!doc.querySelector(`link[href="${cssPath}"]`)) {
                        const link = doc.createElement("link");
                        link.rel = "stylesheet";
                        link.href = cssPath;
                        doc.head.appendChild(link);
                    }
                    // Inyecta Bootstrap Icons para permitir <i class="bi ..."> en contenidos de ayuda
                    const biHref = "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
                    if (!doc.querySelector(`link[href="${biHref}"]`)) {
                        const bi = doc.createElement('link');
                        bi.rel = 'stylesheet';
                        bi.href = biHref;
                        doc.head.appendChild(bi);
                    }
                    // Envolver contenido en .help-content si no existe
                    const root = doc.body;
                    if (root && !doc.querySelector('.help-content')) {
                        const wrapper = doc.createElement('div');
                        wrapper.className = 'help-content';
                        while (root.firstChild) wrapper.appendChild(root.firstChild);
                        root.appendChild(wrapper);
                    }
                }
            } catch (e) {
                console.warn('No se pudo inyectar estilos en el iframe:', e);
            } finally {
                iframe.setAttribute('title', 'Área de ayuda');
            }
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };

        const onError = () => {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write('<!DOCTYPE html><html><head><link rel="stylesheet" href="estilos/help-styles.css"></head><body><div class="help-content"><h2>Error</h2><p>No se pudo cargar la ayuda.</p></div></body></html>');
                doc.close();
            }
            iframe.setAttribute('title', 'Área de ayuda (error)');
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };

        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);
        iframe.src = path;
    }

    // Restaurar desde hash al cargar la página
    (function restaurarDesdeHash() {
        const params = new URLSearchParams(location.hash.replace(/^#/, ''));
        const categoria = params.get('categoria');
        const accion = params.get('accion');
        if (categoria && accionesPorCategoria[categoria]) {
            updateTitle(categoria);
            requestAnimationFrame(() => {
                const btn = Array.from(document.querySelectorAll('#acciones button'))
                    .find(b => b.textContent === accion);
                if (btn) btn.click();
            });
        }
    })();
});
