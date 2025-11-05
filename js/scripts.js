// ================================================================
// LÓGICA PRINCIPAL DE LA PÁGINA (NO ES NECESARIO SABER JS AVANZADO)
// - Puedes CAMBIAR nombres de categorías y acciones abajo.
// - Conserva las funciones y la estructura para que todo siga funcionando.
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1) Lista de acciones por cada categoría del menú.
    //    Para agregar/quitar, edita los textos entre comillas.
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

    // 2) Convierte el nombre de la categoría a una RUTA de carpeta válida.
    //    No cambies esta función; solo ajusta el mapa si creas carpetas nuevas.
    const categoriaToPath = (nombre) => {
        const mapa = {
            'Categoría': 'categoria'
        };
        if (mapa[nombre]) return mapa[nombre];
        return nombre
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    // 3) Cuando haces clic en el menú izquierdo, cambiamos el título
    //    y dibujamos los botones de acciones de esa categoría.
    window.updateTitle = function (categoria) {
        document.querySelector("#titulo-secundario").innerText = categoria;
        cargarAcciones(categoria);
        // Guardamos la categoría en la URL (hash) para poder compartir enlace.
        const params = new URLSearchParams(location.hash.replace(/^#/, ''));
        params.set('categoria', categoria);
        params.delete('accion');
        location.hash = params.toString();
    };

    // 4) Crea los botones (Agregar, Buscar, etc.) y define qué hacen.
    function cargarAcciones(categoria) {
        const contenedorAcciones = document.querySelector("#acciones");
        const areaAyuda = document.querySelector("#area-ayuda iframe");
        contenedorAcciones.innerHTML = "";

        accionesPorCategoria[categoria]?.forEach(accion => {
            const boton = document.createElement("button");
            boton.innerText = accion;

            boton.addEventListener("click", () => {
                // Marcamos visualmente qué acción está seleccionada
                document.querySelectorAll("#acciones button").forEach(btn => {
                    btn.classList.remove("activo");
                    btn.removeAttribute('aria-current');
                });
                boton.classList.add("activo");
                boton.setAttribute('aria-current', 'true');

                // Construimos la ruta del archivo de ayuda que vamos a mostrar.
                const ruta = `contenido/${categoriaToPath(categoria)}/${accion.toLowerCase()}.html`;
                cargarContenidoIframe(ruta);

                // Guardamos también la acción en la URL para compartir enlace directo.
                const params = new URLSearchParams(location.hash.replace(/^#/, ''));
                params.set('accion', accion);
                location.hash = params.toString();
            });

            contenedorAcciones.appendChild(boton);
        });

        // Limpiamos el iframe cuando se cambia de categoría.
        areaAyuda.src = "";
    }

    // 5) Pinta el botón activo en el menú izquierdo.
    const botonesMenuPrincipal = document.querySelectorAll('.nav button');
    botonesMenuPrincipal.forEach(boton => {
        boton.addEventListener('click', () => {
            // Quitamos el estado activo del resto y lo aplicamos al clicado.
            botonesMenuPrincipal.forEach(btn => {
                btn.classList.remove('activo');
                btn.removeAttribute('aria-current');
            });
            boton.classList.add('activo');
            boton.setAttribute('aria-current', 'true');
        });
    });

    // 6) Carga la página de ayuda en el iframe y asegura los estilos dentro del iframe.
    function cargarContenidoIframe(path) {
        const iframe = document.querySelector('#area-ayuda iframe');

        // Indicamos al lector de pantalla que está cargando.
        iframe.setAttribute('title', 'Área de ayuda (cargando...)');

        const onLoad = () => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                    // A) Asegura la hoja de estilos para el contenido de ayuda.
                    const cssPath = "estilos/help-styles.css";
                    if (!doc.querySelector(`link[href="${cssPath}"]`)) {
                        const link = doc.createElement("link");
                        link.rel = "stylesheet";
                        link.href = cssPath;
                        doc.head.appendChild(link);
                    }
                    // B) Agrega biblioteca de iconos para poder usar <i class="bi ...">.
                    const biHref = "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
                    if (!doc.querySelector(`link[href="${biHref}"]`)) {
                        const bi = doc.createElement('link');
                        bi.rel = 'stylesheet';
                        bi.href = biHref;
                        doc.head.appendChild(bi);
                    }
                    // C) Si el HTML cargado no tiene el contenedor esperado, lo creamos.
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

    // 7) Si la URL ya trae #categoria=...&accion=..., la restauramos al abrir.
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
