async function cargarNoticias() {
  try {
    const res = await fetch("http://localhost:3000/api/publicaciones");
    const publicaciones = await res.json();

    const principal = publicaciones.find(pub => pub.tipo === "principal");
    const secundarias = publicaciones.filter(pub => pub.tipo === "secundaria");

    const contenedor = document.getElementById("contenedor-noticias");
    contenedor.innerHTML = "";

    // Noticia principal (grande a la izquierda)
    if (principal) {
      contenedor.innerHTML += `
        <div class="col-md-8">
          <div class="card" style="font-family:${principal.fuente};">
            <img src="${principal.imagen_url || "assets/images/noticias/placeholder.jpg"}" class="img-responsive" alt="Noticia principal">
            <div class="caption">
              <h2><b>${principal.titulo}</b></h2>
              <p><small><i class="fa fa-calendar"></i> ${new Date(principal.fecha_publicacion).toLocaleDateString()}</small></p>
                <p class="descripcion-corta">${principal.descripcion}</p>
                <button class='btn btn-contacto2' style='border-radius:2em;' onclick='mostrarNoticiaModal(${JSON.stringify(principal)})'>Ver más</button>
            </div>
          </div>
        </div>
      `;
    }

    // Contenedor para noticias secundarias (al lado derecho en columna)
    let htmlSecundarias = `<div class="col-md-4">`;
    secundarias.forEach(pub => {
      htmlSecundarias += `
        <div class="thumbnail" style="font-family:${pub.fuente}; margin-bottom:15px;">
          <img src="${pub.imagen_url || "assets/images/noticias/placeholder.jpg"}" class="img-responsive" alt="Noticia secundaria">
          <div class="caption">
            <h4><b>${pub.titulo}</b></h4>
            <p><small><i class="fa fa-calendar"></i> ${new Date(pub.fecha_publicacion).toLocaleDateString()}</small></p>
              <p class="descripcion-corta">${pub.descripcion}</p>
              <button class='btn btn-contacto2' style='border-radius:2em;' onclick='mostrarNoticiaModal(${JSON.stringify(pub)})'>Ver más</button>
          </div>
        </div>
      `;
    });
    htmlSecundarias += `</div>`;

    contenedor.innerHTML += htmlSecundarias;

  } catch (error) {
    console.error("Error al cargar noticias:", error);
  }
}

// Llamar al cargar la página
// Función para mostrar la noticia en el modal
function mostrarNoticiaModal(pub) {
  document.getElementById('modalNoticiaLabel').innerHTML = `<b>${pub.titulo}</b>`;

  let imagenes = [];

  // Caso: varias URLs separadas por coma en la columna imagen_url
  if (pub.imagen_url && pub.imagen_url.includes(',')) {
    imagenes = pub.imagen_url.split(',').map(img => img.trim());
  } 
  // Caso: una sola URL
  else if (pub.imagen_url) {
    imagenes = [pub.imagen_url];
  } 
  // Caso: sin imágenes
  else {
    imagenes = ['assets/images/noticias/placeholder.jpg'];
  }

 let carruselHtml = '';
if (imagenes.length > 1) {
  let indicators = '<ol class="carousel-indicators">';
  for (let i = 0; i < imagenes.length; i++) {
    indicators += `<li data-target="#carruselNoticia" data-slide-to="${i}"${i===0?' class="active"':''}></li>`;
  }
  indicators += '</ol>';

  let slides = imagenes.map((img,i)=>
    `<div class="item${i===0?' active':''}">
      <img src="${img}" alt="Imagen noticia" />
    </div>`).join('');

  carruselHtml = `
    <div id="carruselNoticia" class="carousel slide" data-ride="carousel">
      ${indicators}
      <div class="carousel-inner">
        ${slides}
      </div>
      <a class="left carousel-control" href="#carruselNoticia" data-slide="prev">
  <span style="font-size:20px;color:none;">&#10094;</span>
</a>
<a class="right carousel-control" href="#carruselNoticia" data-slide="next">
  <span style="font-size:20px;color:none;">&#10095;</span>
</a>
    </div>`;
  setTimeout(()=>$('#carruselNoticia').carousel(0),300);
} else {
  carruselHtml = `<img src="${imagenes[0]}" alt="Imagen noticia" class="img-responsive" />`;
}


  document.getElementById('modalNoticiaBody').innerHTML = `
    ${carruselHtml}
    <p><small><i class='fa fa-calendar'></i> ${new Date(pub.fecha_publicacion).toLocaleDateString()}</small></p>
    <p style='font-family:${pub.fuente};'>${pub.descripcion}</p>
  `;
  $('#modalNoticia').modal('show');
}

cargarNoticias();