const apiKey = "AGz1+zSCc2OKTTxiMlO//g==ZhJTmw4oOJWllPP8";

const motoTypeImages = {
    "custom / cruiser": "./IMG/cruiser.png",
    "sport": "./IMG/sport.png",
    "enduro / offroad": "./IMG/offroad.png",
    "prototype / concept model": "./IMG/standart.png",
    "touring": "./IMG/touring.png",
    "naked bike": "./IMG/naked.png",
    "scooter": "./IMG/scooter.png",
};

function getMotoImageByType(motoType) {
    const normalizedType = motoType ? motoType.toLowerCase() : '';
    if (motoTypeImages[normalizedType]) {
        return motoTypeImages[normalizedType];
    }
}

function anosprincipales() {
    const anoseleccionado = document.getElementById("anoseleccionado");
    const anosre = new Date().getFullYear();
    const anoinicio = 2000;

    anoseleccionado.innerHTML = '<option value="">Todos los años</option>';

    for (let year = anosre; year >= anoinicio; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        anoseleccionado.appendChild(option);
    }
}

async function tiposprincipales() {
    const tipoSeleccionado = document.getElementById("tipoSeleccionado");
    const response = await fetch(`https://api.api-ninjas.com/v1/motorcycles?make=BMW`, {
        headers: { 'X-Api-Key': apiKey }
    });

    const data = await response.json();
    const tipoUnico = new Set();
    data.forEach(moto => {
        if (moto.type) {
            tipoUnico.add(moto.type);
        }
    });

    const tiposor = Array.from(tipoUnico).sort();

    tipoSeleccionado.innerHTML = '<option value="">Todos los tipos</option>';

    tiposor.forEach(type => {
        const option = document.createElement("option");
        option.value = type.toLowerCase();
        option.textContent = type;
        tipoSeleccionado.appendChild(option);
    });
}

async function buscarMotos() {
    const tipoSeleccionado = document.getElementById("tipoSeleccionado").value.trim().toLowerCase();
    const anoseleccionado = document.getElementById("anoseleccionado").value.trim();
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "<p>Cargando motos...</p>";

    const apiUrl = `https://api.api-ninjas.com/v1/motorcycles?make=BMW${anoseleccionado ? `&year=${anoseleccionado}` : ''}`;

    const response = await fetch(apiUrl, {
        headers: { 'X-Api-Key': apiKey }
    });

    let data = await response.json();

    let filtromoto = data;
    if (tipoSeleccionado) {
        filtromoto = data.filter(moto => moto.type && moto.type.toLowerCase() === tipoSeleccionado);
    }

    resultsDiv.innerHTML = "";

    if (filtromoto.length === 0) {
        resultsDiv.innerHTML = "<p>No se encontraron resultados para tu búsqueda.</p>";
        return;
    }

    filtromoto.forEach(moto => {
        const card = document.createElement("div");
        card.className = "card";
        const imageUrl = getMotoImageByType(moto.type);
        card.innerHTML = `
            <img src="${imageUrl}" alt="${moto.make} ${moto.model}">
            <h3>${moto.make} ${moto.model}</h3>
            <p>Tipo: ${moto.type || 'N/A'}</p>
            <p>Año: ${moto.year || 'N/A'}</p>
        `;
        card.addEventListener("click", () => {
            localStorage.setItem("motoSeleccionada", JSON.stringify(moto));
            localStorage.setItem("selectedMotoImage", imageUrl);
            window.location.href = "detalle.html";
        });
        resultsDiv.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const moto = JSON.parse(localStorage.getItem("motoSeleccionada"));
    const imageUrl = localStorage.getItem("selectedMotoImage");
    const contenedor = document.getElementById("detalleMoto");

    if (!moto || !contenedor) {
        console.error("No se encontró la moto seleccionada o el contenedor de detalle.");
        return;
    }

    contenedor.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${moto.make} ${moto.model}">` : ''}
        <h2>${moto.make} ${moto.model}</h2>
        <p><strong>Año:</strong> <span>${moto.year || "Sin Información"}</span></p>
        <p><strong>Tipo:</strong> <span>${moto.type || "Sin Información"}</span></p>
        <p><strong>Motor:</strong> <span>${moto.engine || "Sin Información"}</span></p>
        <p><strong>Válvulas:</strong> <span>${moto.valves_per_cylinder || "Sin Información"}</span></p>
        <p><strong>Caja de Cambios:</strong> <span>${moto.gearbox || "Sin Información"}</span></p>
        <p><strong>Sistema de Combustible:</strong> <span>${moto.fuel_system || "Sin Información"}</span></p>
        <p><strong>Encendido:</strong> <span>${moto.starter || "Sin Información"}</span></p>
        <p><strong>Capacidad del Tanque:</strong> <span>${moto.fuel_capacity || "Sin Información"}</span></p>
    `;
});

window.addEventListener("load", () => {
    if (document.getElementById("anoseleccionado") && document.getElementById("tipoSeleccionado")) {
        anosprincipales();
        tiposprincipales();
        buscarMotos();
    }
});
