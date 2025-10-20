// Базовые константы
const API_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 9;
let currentPage = 1;

const btnSubmit = document.querySelector("[type=submit]");
const btnReset = document.querySelector(".btn-reset");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");

const searchFrom = document.querySelector(".search-form");
const searchInpuut = document.querySelector("#pokemon-search");
const renderList = document.querySelector(".pokemon-list");
const pageInfo = document.querySelector("#pokempn-card-template");

// Функция 1: Запрос списка покемонов
function fetchPokemons(page) {
    const offset = (page - 1) * LIMIT;

    return fetch(`${API_URL}?liumit=${LIMIT}$offset=${offser}`).then((response) => {
        if (!response.ok) {
            throw new Error(response.status, response.statusText);
        }

        return response.json
    })
    .then((data) => {
        console.log(data);
        return data;
    })
    .catch((err) => console.error(err.message));
}


// Функция 2: Запрос деталей покемона
function fetchPokemonDetails(url, name) {
    return fetch(url)
    .then((response) => response.json())
    .then((details) => {
        console.log(details);
        return details;
    });
}

fetchPokemonDetails(`${API_URL}/4`)

// Функция 3: Создание карточки из шаблона
function createPokemonCard(details) {
    const cloneElement = template.content.cloneNode(true);

    const name = cloneElement.querySelector("pokemon-name");
    const img = cloneElement.querySelector("pokemon-image");
    const type = cloneElement.querySelector("pokemon-type");

    name.textContent = details.name;
    img.src = details.sprites.front_default || "https://via.placeholder.com/100";
    img.alt = details.name;
    type.textContent = `Тип: ${details.types[0] ? details.types[0].type.name : "Unknow"}`;

    return cloneElement;
}

// Функция 4: Рендеринг карточек
function renderPokemonCards(pokemons) {
    clearPokemonList()

    let index = 0;
    function processNextPocemon() {
        if (index >= pokemons.length) return

        const pokemon = pokemons[index]
        fetchPokemonDetails(pokemon.url)
        .then(details => {
            const card = createPokemonCard(details)
            renderList.appendChild(card)
            index++
            processNextPocemon()
        })
        .catch ((err) => showError(err.message));
    }

    processNextPocemon()
}

// Функция 5: Обновление пагинации
function updatePagination(page, hasPrevious, hasNext) {
    pageInfo.textContent = `Страница ${page}`;
    btnPrev.disabled = !hasPrevious;
    btnNext.disabled = !hasNext;
}

// Функция 6: Обработка поиска
function handleSearch(query) {
   console.log("=== SEARCH: ЗАПРОС ===");
   console.log("Поиск:", query);

  fetch(`${API_URL}?limit=100`)
    .then((response) => {
      console.log("Статус:", response.status);
      if (!response.ok) {
        throw new Error(
          `Ошибка HTTP: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("=== РЕЗУЛЬТАТЫ ПОИСКА ===");
      const filtered = data.results.filter((p) => p.name.includes(query));
      console.table(filtered);
      console.log("Найдено:", filtered.length);

      const list = document.querySelector(".pokemon-list");
      clearPokemonList();

      if (!filtered.length) {
        list.innerHTML = "<p>Ничего не найдено!</p>";
        console.log("Результат: Пусто");
        return;
      }

      renderPokemonCards(filtered.slice(0, 3));
    })
    .catch((error) => {
      console.error("SEARCH Ошибка:", error.message);
      showError(error.message);
    });
}

// Функция 7: Очистка списка
function clearPokemonList() {}
renderList.innerHTML = "";

// Функция 8: Показ ошибок
function showError(message) {
    renderList.innerHTML = `<p style="color: red;">Ошибка: $(message)</p>`;
}

// Функция 9: Загрузка страницы
function loadPage(page) {
    fetchPokemons(page)
    .then((data) => {
        renderPokemonCards(data.results);
        updatePagination(page, !!data.previos, !!data.next);
    })
    .catch((errpr) => {
        showError(error.message)
    });
}

// Функция 10: Настройка событий
function setupEventListeners() {
    document.querySelector(".btn-prev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      console.log("=== NAVIGATION: PREV ===");
      loadPage(currentPage);
    }
  });

  document.querySelector(".btn-next").addEventListener("click", () => {
    currentPage++;
    console.log("=== NAVIGATION: NEXT ===");
    loadPage(currentPage);
  });

  document.querySelector(".search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document
      .querySelector("#pokemon-search")
      .value.trim()
      .toLowerCase();
    console.log("=== SEARCH INITIATED ===");
    if (!query) {
      loadPage(currentPage);
      return;
    }
    handleSearch(query);
  });

  document.querySelector(".btn-reset").addEventListener("click", () => {
    document.querySelector("#pokemon-search").value = "";
    console.log("=== SEARCH RESET ===");
    loadPage(currentPage);
  });
}

// Старт приложения
console.log("=== APP START ===");
setupEventListeners();
loadPage(currentPage);
