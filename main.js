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
    try {
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
    } catch (error) {
        console.error("Error populating types:", error);
    }
}

async function buscarMotos() {
    const selectedType = document.getElementById('typeSelect').value.trim().toLowerCase();
    const selectedYear = document.getElementById('yearSelect').value.trim();
    const resultsDiv = document.getElementById('results');

    resultsDiv.innerHTML = '<p class="no-results">Cargando la colección...</p>';

    try {
        // Fetch all BMW motorcycles, potentially filtered by year
        const response = await fetch(`https://api.api-ninjas.com/v1/motorcycles?make=BMW${selectedYear ? `&year=${selectedYear}` : ''}`, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();

        // Filter by type if a type was selected
        let filteredBikes = data;
        if (selectedType) {
            filteredBikes = data.filter(moto => moto.type && moto.type.toLowerCase() === selectedType);
        }

        resultsDiv.innerHTML = ""; // Clear loading message

        if (filteredBikes.length === 0) {
            resultsDiv.innerHTML = "<p class='no-results'><i class='fas fa-exclamation-circle'></i> No se encontraron modelos BMW para tu búsqueda. ¡Intenta con otra combinación!</p>";
            return;
        }

        filteredBikes.forEach(moto => {
            const card = document.createElement('div');
            card.className = 'card';
            const imageUrl = getRandomImage(); // Use a random image from your collection
            card.innerHTML = `
                        <img src="${imageUrl}" alt="${moto.make} ${moto.model}">
                        <h3>${moto.make} ${moto.model}</h3>
                        <p>Tipo: ${moto.type || 'N/A'}</p>
                        <p>Año: ${moto.year || 'N/A'}</p>
                    `;
            card.addEventListener('click', () => {
                localStorage.setItem('motoSeleccionada', JSON.stringify(moto));
                localStorage.setItem('selectedMotoImage', imageUrl);
                window.location.href = 'detalle.html'; // Assuming you have a detail page
            });
            resultsDiv.appendChild(card);
        });
    } catch (error) {
        resultsDiv.innerHTML = `<p class='no-results'><i class='fas fa-frown'></i> Hubo un problema al cargar los datos. Por favor, revisa tu conexión e inténtalo de nuevo. (${error.message})</p>`;
        console.error("Error:", error);
    }
}

const bikeImages = [
    'https://images.unsplash.com/photo-1606787360230-2f1b3c5d4e6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60'
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