interface Character {
  id: number;
  name: string;
  image: string;
}

interface ApiResponse {
  results: Character[];
}

// Seleccionamos el DOM
const contain = document.querySelector("#contain-anime") as HTMLDivElement;
const search = document.querySelector("#buscador") as HTMLInputElement;

async function buscarPersonajes(texto: string) {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${texto}`,
    );

    //Si falla saltara el error 404 = no hay resultados
    if (!response.ok) {
      contain.innerHTML = `<p class="text-red-500">No hay resultados</p>`;
      return;
    }

    //Si funciona = hay personajes
    const json = (await response.json()) as ApiResponse;
    const personajes = json.results;

    contain.innerHTML = "";

    personajes.forEach((personaje) => {
      const div = document.createElement("div");
      div.className = "bg-slate-800 rounded-xl overflow-hidden shadow-lg";
      div.innerHTML = `
        <img src="${personaje.image}" alt="${personaje.name}" class="w-full h-64 object-cover" >
        <div class="p-4">
            <h2 class="text-lg font-bold text-white">${personaje.name}</h2>
        </div>
      `;
      contain.appendChild(div);
    });
  } catch (error) {
    console.log("Error", error);
  }
}

search.addEventListener("input", (e) => {
  const text = (e.target as HTMLInputElement).value;

  if (text.length >= 3) {
    buscarPersonajes(text);
  } else if (text.length === 0) {
    contain.innerHTML = "";
  }
});
