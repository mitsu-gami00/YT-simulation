// =====================================================
// VARIABLES PRINCIPALES
// =====================================================

const videoPrincipal = document.getElementById("video-reproducido");
const lista = document.getElementById("lista");
const recomendados = document.getElementById("recomendados");


// =====================================================
// LIKE
// =====================================================

const botonLike = document.querySelector(".like");
const contadorLike = document.getElementById("like-count");

let liked = false;

if (botonLike) {

    botonLike.addEventListener("click", () => {

        let cantidad = parseInt(contadorLike.textContent);

        if (!liked) {
            cantidad++;
            liked = true;

            botonLike.classList.add("activo");

            mostrarMensaje("👍 Te gusta este video");

        } else {
            cantidad--;
            liked = false;

            botonLike.classList.remove("activo");

            mostrarMensaje("Ya no te gusta este video");
        }

        contadorLike.textContent = cantidad;
    });

}


// =====================================================
// DISLIKE
// =====================================================

const botonDislike = document.querySelector(".dislike");
const contadorDislike = document.getElementById("dislike-count");

let disliked = false;

if (botonDislike) {

    botonDislike.addEventListener("click", () => {

        let cantidad = parseInt(contadorDislike.textContent);

        if (!disliked) {

            cantidad++;
            disliked = true;

            botonDislike.classList.add("activo");

            // Si estaba dado like, lo quitamos
            if (liked) {
                let likes = parseInt(contadorLike.textContent);

                likes--;

                contadorLike.textContent = likes;

                liked = false;

                botonLike.classList.remove("activo");
            }

            mostrarMensaje("👎 No te gusta este video");

        } else {

            cantidad--;
            disliked = false;

            botonDislike.classList.remove("activo");

            mostrarMensaje("Dislike eliminado");
        }

        contadorDislike.textContent = cantidad;

    });

}


// =====================================================
// SUSCRIBIRSE
// =====================================================

const botonSuscribirse = document.querySelector(".Creador button");

let suscrito = false;

if (botonSuscribirse) {

    botonSuscribirse.addEventListener("click", () => {

        if (!suscrito) {

            botonSuscribirse.textContent = "Suscrito";

            botonSuscribirse.classList.add("suscrito");

            suscrito = true;

            mostrarMensaje("🔔 Te has suscrito al canal");

        } else {

            botonSuscribirse.textContent = "Suscribirse";

            botonSuscribirse.classList.remove("suscrito");

            suscrito = false;

            mostrarMensaje("Te has dado de baja del canal");
        }

    });

}


// =====================================================
// COMPARTIR
// =====================================================

const botonCompartir = document.querySelector(".share-btn");

if (botonCompartir) {

    botonCompartir.addEventListener("click", async () => {

        const url = window.location.href;

        // Si el navegador permite compartir
        if (navigator.share) {

            try {

                await navigator.share({
                    title: "VideoStream",
                    text: "Mira este video",
                    url: url
                });

            } catch (error) {

                // El usuario canceló el menú
                console.log("Compartir cancelado");

            }

        } else {

            // Alternativa: copiar al portapapeles
            try {

                await navigator.clipboard.writeText(url);

                mostrarMensaje("🔗 Enlace copiado al portapapeles");

            } catch (error) {

                mostrarMensaje("No se pudo copiar el enlace");

            }

        }

    });

}


// =====================================================
// AGREGAR VIDEOS A LA COLA
// =====================================================

const botonesAgregar = document.querySelectorAll(
    "#recomendados .video-info button"
);

botonesAgregar.forEach((boton) => {

    boton.addEventListener("click", () => {

        const videoOriginal = boton.closest(".video");

        if (!videoOriginal) {
            return;
        }

        // =================================================
        // CREAR COPIA
        // =================================================

        const videoNuevo = videoOriginal.cloneNode(true);

        // =================================================
        // CAMBIAR EL BOTÓN + POR ❌
        // =================================================

        const botonEliminar = videoNuevo.querySelector("button");

        if (botonEliminar) {

            botonEliminar.textContent = "❌";

            botonEliminar.removeAttribute("id");

        }

        // =================================================
        // AGREGAR A LA COLA
        // =================================================

        const contenedorCola = lista.querySelector(
            ".lista-botones + div"
        );

        if (contenedorCola) {

            contenedorCola.appendChild(videoNuevo);

        }

        // =================================================
        // OCULTAR EL RECOMENDADO
        // =================================================

        videoOriginal.style.display = "none";

        mostrarMensaje("➕ Video agregado a la cola");

        // =================================================
        // ACTIVAR FUNCIONES DEL NUEVO VIDEO
        // =================================================

        activarVideoMiniatura(videoNuevo);

        activarBotonEliminar(videoNuevo);

    });

});


// =====================================================
// ELIMINAR VIDEOS DE LA COLA
// =====================================================

const botonesBorrar = document.querySelectorAll(
    "#lista .video-info button"
);

botonesBorrar.forEach((boton) => {

    boton.addEventListener("click", () => {

        const video = boton.closest(".video");

        if (!video) {
            return;
        }

        video.remove();

        mostrarMensaje("❌ Video eliminado de la cola");

    });

});


// =====================================================
// LIMPIAR COLA
// =====================================================

const botonLimpiar = document.querySelector(".lista-botones button");

if (botonLimpiar) {

    botonLimpiar.addEventListener("click", () => {

        const videosCola = lista.querySelectorAll(
            ".video-info button"
        );

        if (videosCola.length === 0) {

            mostrarMensaje("La cola ya está vacía");

            return;
        }

        videosCola.forEach((boton) => {

            const video = boton.closest(".video");

            if (video) {
                video.remove();
            }

        });

        mostrarMensaje("🧹 Cola limpiada");

    });

}


// =====================================================
// FUNCIÓN PARA ELIMINAR VIDEOS AGREGADOS
// =====================================================

function activarBotonEliminar(videoElemento) {

    const boton = videoElemento.querySelector(
        ".video-info button"
    );

    if (!boton) {
        return;
    }

    boton.addEventListener("click", () => {

        videoElemento.remove();

        mostrarMensaje("❌ Video eliminado de la cola");

    });

}


// =====================================================
// REPRODUCIR VIDEO PRINCIPAL AL HACER CLIC
// =====================================================

function activarClickVideo(videoElemento) {

    const video = videoElemento.querySelector("video");

    if (!video) {
        return;
    }

    video.addEventListener("click", () => {

        const ruta = video.getAttribute("src");

        if (!ruta || !videoPrincipal) {
            return;
        }

        // Cambiar video principal
        videoPrincipal.src = ruta;

        // Reiniciar
        videoPrincipal.load();

        // Reproducir
        videoPrincipal.play().catch(() => {
            console.log("El navegador bloqueó la reproducción automática");
        });

        // Subir al reproductor
        videoPrincipal.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        mostrarMensaje("▶️ Reproduciendo video");

    });

}


// =====================================================
// HOVER: REPRODUCCIÓN AUTOMÁTICA
// =====================================================

function activarVideoMiniatura(contenedor) {

    const video = contenedor.querySelector("video");

    if (!video) {
        return;
    }

    video.muted = true;

    video.addEventListener("mouseenter", () => {

        video.muted = true;

        video.play().catch(() => {

            console.log(
                "El navegador bloqueó la reproducción automática"
            );

        });

    });

    video.addEventListener("mouseleave", () => {

        video.pause();

        video.currentTime = 0;

    });

    // También permitir hacer clic
    activarClickVideo(contenedor);

}


// =====================================================
// ACTIVAR HOVER EN VIDEOS DE COLA
// =====================================================

const videosCola = document.querySelectorAll(
    "#lista .video"
);

videosCola.forEach((video) => {

    activarVideoMiniatura(video);

});


// =====================================================
// ACTIVAR HOVER EN RECOMENDADOS
// =====================================================

const videosRecomendados = document.querySelectorAll(
    "#recomendados .video"
);

videosRecomendados.forEach((video) => {

    activarVideoMiniatura(video);

});


// =====================================================
// ACTIVAR HOVER EN "MÁS VIDEOS"
// =====================================================

const videosMas = document.querySelectorAll(
    ".video-div"
);

videosMas.forEach((contenedor) => {

    const video = contenedor.querySelector("video");

    if (!video) {
        return;
    }

    video.muted = true;

    video.addEventListener("mouseenter", () => {

        video.muted = true;

        video.play().catch(() => {
            console.log("Reproducción bloqueada");
        });

    });

    video.addEventListener("mouseleave", () => {

        video.pause();

        video.currentTime = 0;

    });

    // Click para reproducirlo en el reproductor principal
    video.addEventListener("click", () => {

        const ruta = video.getAttribute("src");

        if (!ruta || !videoPrincipal) {
            return;
        }

        videoPrincipal.src = ruta;

        videoPrincipal.load();

        videoPrincipal.play().catch(() => {
            console.log("Reproducción bloqueada");
        });

        videoPrincipal.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        mostrarMensaje("▶️ Reproduciendo video");

    });

});


// =====================================================
// MENSAJES
// =====================================================

function mostrarMensaje(texto) {

    // Si ya existe un mensaje, eliminarlo
    const mensajeAnterior = document.querySelector(".mensaje-js");

    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    // Crear mensaje
    const mensaje = document.createElement("div");

    mensaje.className = "mensaje-js";

    mensaje.textContent = texto;

    document.body.appendChild(mensaje);

    // Mostrar
    setTimeout(() => {

        mensaje.classList.add("mostrar");

    }, 10);

    // Ocultar después de 2 segundos
    setTimeout(() => {

        mensaje.classList.remove("mostrar");

        setTimeout(() => {

            mensaje.remove();

        }, 300);

    }, 2000);

}


// =====================================================
// BÚSQUEDA
// =====================================================

const buscador = document.getElementById("search");

if (buscador) {

    buscador.addEventListener("input", () => {

        const texto = buscador.value.toLowerCase().trim();

        const videos = document.querySelectorAll(
            ".video, .video-div"
        );

        videos.forEach((elemento) => {

            const contenido = elemento.textContent.toLowerCase();

            if (contenido.includes(texto)) {

                elemento.style.display = "";

            } else {

                elemento.style.display = "none";

            }

        });

    });

}


// =====================================================
// BOTÓN "MOSTRAR MÁS"
// =====================================================

const botonMas = document.querySelector(".mas");

const descripcion = document.querySelector(".descripcion");

if (botonMas && descripcion) {

    botonMas.addEventListener("click", (event) => {

        event.preventDefault();

        descripcion.classList.toggle("expandida");

        if (descripcion.classList.contains("expandida")) {

            botonMas.textContent = "Mostrar menos";

        } else {

            botonMas.textContent = "Mostrar más";

        }

    });

}