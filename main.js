const apiKey = "AGz1+zSCc2OKTTxiMlO//g==ZhJTmw4oOJWllPP8";

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * bikeImages.length);
    return bikeImages[randomIndex];
}

function populateYearDropdown() {
    const yearSelect = document.getElementById('yearSelect');
    const currentYear = new Date().getFullYear();
    const startYear = 2000;

    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

async function populateTypeDropdown() {
    const typeSelect = document.getElementById('typeSelect');
        const response = await fetch(`https://api.api-ninjas.com/v1/motorcycles?make=BMW`, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const uniqueTypes = new Set();
        data.forEach(moto => {
            if (moto.type) {
                uniqueTypes.add(moto.type);
            }
        });

        const sortedTypes = Array.from(uniqueTypes).sort();

        sortedTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.toLowerCase();
            option.textContent = type;
            typeSelect.appendChild(option);
        });
}

async function buscarMotos() {
    const selectedType = document.getElementById('typeSelect').value.trim().toLowerCase();
    const selectedYear = document.getElementById('yearSelect').value.trim();
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = '<p class="no-results">Cargando la colección...</p>';
       
        const response = await fetch(`https://api.api-ninjas.com/v1/motorcycles?make=BMW${selectedYear ? `&year=${selectedYear}` : ''}`, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();

        
        let filteredBikes = data;
        if (selectedType) {
            filteredBikes = data.filter(moto => moto.type && moto.type.toLowerCase() === selectedType);
        }

        resultsDiv.innerHTML = "";

        if (filteredBikes.length === 0) {
            resultsDiv.innerHTML = "<p class='no-results'><i class='fas fa-exclamation-circle'></i> No se encontraron modelos BMW para tu búsqueda. ¡Intenta con otra combinación!</p>";
            return;
        }

        filteredBikes.forEach(moto => {
            const card = document.createElement('div');
            card.className = 'card';
            const imageUrl = getRandomImage();
            card.innerHTML = `
                        <img src="${imageUrl}" alt="${moto.make} ${moto.model}">
                        <h3>${moto.make} ${moto.model}</h3>
                        <p>Tipo: ${moto.type || 'N/A'}</p>
                        <p>Año: ${moto.year || 'N/A'}</p>
                    `;
            card.addEventListener('click', () => {
                localStorage.setItem('motoSeleccionada', JSON.stringify(moto));
                localStorage.setItem('selectedMotoImage', imageUrl);
                window.location.href = 'detalle.html';
            });
            resultsDiv.appendChild(card);
        });

}

const bikeImages = [
    "/IMG/moto1.png",
    "/IMG/moto2.png",  
    "/IMG/moto3.png",
    "/IMG/moto4.png",
    "/IMG/moto5.png",
    "/IMG/moto6.png",
    "/IMG/moto7.png"
];



window.addEventListener('load', () => {
    populateYearDropdown();
    populateTypeDropdown();
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    preloader.addEventListener('transitionend', () => {
        preloader.remove();
    });
    buscarMotos();
});