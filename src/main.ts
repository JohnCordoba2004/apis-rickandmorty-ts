interface Character {
  id: number;
  name: string;
  image: string;
}

interface ApiResponse {
  info: {
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

// Seleccionamos el DOM
const contain = document.querySelector("#contain-anime") as HTMLDivElement;
const search = document.querySelector("#buscador") as HTMLInputElement;

const btnPrev = document.querySelector("#btnPrev") as HTMLButtonElement;
const btnNext = document.querySelector("#btnNext") as HTMLButtonElement;

async function buscarPersonajes(texto: string) {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${texto}`,
    );

    //Si falla saltara el error 404 = no hay resultados
    if (!response.ok) {
      contain.innerHTML = `<p class="text-red-500">No hay resultados</p>`;

      btnPrev.disabled = true;
      btnNext.disabled = true;
      delete btnPrev.dataset.url;
      delete btnNext.dataset.url;

      return;
    }

    //Si funciona = hay personajes
    const json = (await response.json()) as ApiResponse;
    const personajes = json.results;

    if (json.info.prev) {
      btnPrev.disabled = false;
      btnPrev.dataset.url = json.info.prev;
    } else {
      btnPrev.disabled = true;
      delete btnPrev.dataset.url;
    }

    if (json.info.next) {
      btnNext.disabled = false;
      btnNext.dataset.url = json.info.next;
    } else {
      btnNext.disabled = true;
      delete btnNext.dataset.url;
    }

    contain.innerHTML = "";

    personajes.forEach((personaje) => {
      const div = document.createElement("div");
      div.className =
        "bg-slate-800 rounded-xl overflow-hidden shadow-lg transition duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl";
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
  const text = (e.target as HTMLInputElement).value.toLocaleLowerCase();

  if (text.length >= 3) {
    buscarPersonajes(text);
  } else if (text.length === 0) {
    getAllCharacters();
  }
});

async function getAllCharacters(
  url: string = "https://rickandmortyapi.com/api/character",
) {
  try {
    const response = await fetch(url);

    //Si falla saltara el error 404 = no hay resultados
    if (!response.ok) {
      throw new Error("Error");
    }

    //Si funciona = hay personajes
    const json = (await response.json()) as ApiResponse;
    const personajes = json.results;

    if (json.info.prev) {
      btnPrev.disabled = false;
      btnPrev.dataset.url = json.info.prev;
    } else {
      btnPrev.disabled = true;
    }

    if (json.info.next) {
      btnNext.disabled = false;
      btnNext.dataset.url = json.info.next;
    } else {
      btnNext.disabled = true;
    }

    contain.innerHTML = "";

    personajes.forEach((personaje) => {
      const div = document.createElement("div");
      div.className =
        "bg-slate-800 rounded-xl overflow-hidden shadow-lg transition duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl";
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

getAllCharacters();

btnPrev.addEventListener("click", () => {
  const url = btnPrev.dataset.url;
  if (url) getAllCharacters(url);
});
btnNext.addEventListener("click", () => {
  const url = btnNext.dataset.url;
  if (url) getAllCharacters(url);
});
