// FECHA: 05.07.2024
// CLAN: Gates
// CODERS: David Blandon
//         Luisa Ramirez
//         Daniel Alejandro
//         Juan Pablo

// ------------------------------------------ TS PROJECT USING AN API: POKEMON API ------------------------------------------

import { listPokemons, pokemons } from './interfaces/interfaces';

async function index(pokemonApi: string = "https://pokeapi.co/api/v2/pokemon"): Promise<void> {
    // Elementos DOM
    let card = document.querySelector(".card-container") as HTMLDivElement;
    let linksPaginacion = document.querySelector(".links-paginacion") as HTMLElement;

    let fragment = document.createDocumentFragment() as DocumentFragment;

    let content = document.createElement('div') as HTMLDivElement;

    try {
        setTimeout(() => {
            // Mostrar página de carga
            card.innerHTML = `
                <div class="w-100 d-flex justify-content-center align-items-center">
                    <img class="loader" src="../assets/svg/loader.svg" alt="Cargando...">
                </div>
            `;
        }, 1);

        // Obtener datos de la API
        let response = await fetch(pokemonApi);

        // Manejar errores de respuesta HTTP
        if (!response.ok) throw { status: response.status, statusText: response.statusText };

        // Obtener datos JSON
        let data: listPokemons = await response.json();
        console.log(data);

        // Simular tiempo de carga o animación antes de mostrar datos
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mostrar los datos en el DOM
        for (const pokemon of data.results) {
            try {
                const div = document.createElement('div') as HTMLDivElement;
                const img = document.createElement('img') as HTMLImageElement;
                const figure = document.createElement('figure') as HTMLElement;
                const h4 = document.createElement('h4') as HTMLHeadingElement;
                const p = document.createElement('p') as HTMLParagraphElement;
                const small = document.createElement('small') as HTMLElement;
                
                // Agregar datos al DOM
                let res = await fetch(pokemon.url);
                if (!res.ok) throw { status: res.status, statusText: res.statusText };

                let pokemonData: pokemons = await res.json();
                console.log(pokemonData);
                 
                figure.classList.add("card", "border-dark", "p-4");
                img.src = pokemonData.sprites.other['official-artwork'].front_default;
                img.alt = "pokemon-img";
                img.classList.add("card-img-top");
                div.classList.add("card-body");
                h4.textContent = pokemon.name;
                h4.classList. add("card-title", "text-capitalize", "fw-bold")
                p.textContent = "Main ability: ";
                p.classList.add("card-text", "fw-bold");
                small.textContent = `⭐ ${pokemonData.abilities[0].ability.name}`;
                small.classList.add("card-text", "text-secondary")

                div.appendChild(h4);
                div.appendChild(p);
                div.appendChild(small);
                figure.appendChild(img);
                figure.appendChild(div);

                content.appendChild(figure);

            } catch (err: any) {
                console.error('Error fetching individual Pokémon:', err);
            }

            content.classList.add("d-flex", "flex-wrap", "gap-5","justify-content-center");
            
            fragment.appendChild(content);
        }
        // Limpiar contenido anterior
        card.innerHTML = ""

        card.appendChild(fragment);

        // Mostrar enlaces de paginación
        let prevLink:string = data.previous ? `<a class="text-secondary" href="${data.previous}">⬅︎</a>` : "";
        let nextLink:string = data.next ? `<a class="text-secondary" href="${data.next}">➡︎</a>` : "";
        linksPaginacion.innerHTML = prevLink + " " + nextLink;
        
    } catch (error: any) {
        console.error('Error fetching Pokémon list:', error);
    }
}

// Event listener para cargar la página inicial
document.addEventListener("DOMContentLoaded", async (e: Event) => {
    await index(); // Cargar datos al inicio
});

// Event listener para manejar la paginación
document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.matches(".links-paginacion a")) {
        e.preventDefault();
        let nextPageUrl = (target as HTMLAnchorElement).getAttribute("href") ?? "https://pokeapi.co/api/v2/pokemon/";
        index(nextPageUrl); // Cargar datos de la página siguiente al hacer clic en el enlace de paginación
    }
});

