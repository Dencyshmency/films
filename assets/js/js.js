fetch(
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=DECEMBER",
  {
    method: "GET",
    headers: {
      "X-API-KEY": "afad8687-496e-4161-9dd6-d96bd7c3f793",
      "Content-Type": "application/json",
    },
  }
)
  .then((res) => res.json())
  .then((json) => localStorage.setItem("films", JSON.stringify(json)))
  .catch((err) => console.log(err));

// Загрузить все фильмы на страницу
const locale = localStorage.getItem("films");

function showFilms() {
  let filmsData = JSON.parse(localStorage.getItem("films")).items;
  let fimsWarpper = document.querySelector(".films-wrapper");

  filmsData.forEach((el) => {
    let film = `
        <button class="film-item" data-name="${el.nameRu}" data-id="${el.kinopoiskId}">
            <div>
                <img src="${el.posterUrl}">
            </div>
        </button>
    `;
    fimsWarpper.insertAdjacentHTML("afterbegin", film);
  });
}

showFilms();

let data = new Date();
let day = data.getDate();
const currentDate = new Date();

const getDatesInRange = (currentDate) => {
  const dates = [];
  for (let i = -7; i <= 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    dates.push(date.toISOString().split("T")[0].split("-").reverse().join("."));
  }
  return dates;
};

const datesRange = getDatesInRange(currentDate);

const isPastDate = (dateString) => {
  const [day, month, year] = dateString.split(".").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return date < today;
};

const pastDates = datesRange.filter(isPastDate);

const dateItems = document.querySelector(".date-items");

datesRange.forEach((el) => {
  let status;

  if (pastDates.includes(el)) {
    status = "past";
  } else {
    status = "active";
  }

  let item = `<li class="${status}" data-item="${el}">${el}</li>`;

  dateItems.insertAdjacentHTML("beforeEnd", item);
});

// Закрыть модальное окно

const closeModal = document.querySelector(".close-modal-btn");

closeModal.addEventListener("click", () => {
  modal.classList.remove("open-modal");
});

const placePanelClose = document.querySelector(".place-panel-close");

placePanelClose.addEventListener("click", () => {
  document.querySelector(".places-wrapper").classList.remove("open-wrap");
  clearPlaceAndDate();
});

// Открыть модальное окно
const modal = document.querySelector(".modal");

function openModal(el) {
  modal.classList.add("open-modal");
  bookedItem.name = el.getAttribute("data-name");
  bookedItem.id = el.getAttribute("data-id");
}

const films = document.querySelectorAll(".film-item");

films.forEach((el) => {
  el.addEventListener("click", () => {
    document.querySelector(".film-name-title").textContent =
      el.getAttribute("data-name");

    let img = el.children[0].children[0].getAttribute("src");
    document.querySelector(".modal-current-film-img").setAttribute("src", img);

    openModal(el);
  });
});

// Открытие окна бронирования места

let bookedItem = {
  id: "",
  name: "",
  data: [],
};

let currentData = {
  date: "",
  timePlace: [],
};

let timeAndPlace = {
  time: "10:00",
  place: [],
};

const dates = document.querySelectorAll(".date-items li");
let cd;
let allPlaceTime = document.querySelectorAll(".place");

dates.forEach((el) => {
  el.addEventListener("click", () => {
    let date = el.textContent;
    currentData.date = date;
    document.querySelector(".places-wrapper").classList.add("open-wrap");

    if (isPastDate(date.replace(":", "."))) {
      placeItems.forEach((el) => {
        el.classList.add("no-active");
      });
    } else {
      placeItems.forEach((el) => {
        el.classList.remove("no-active");
      });
    }

    let getItem = JSON.parse(localStorage.getItem("data"));

    if (getItem !== null) {
      let currentItem = getItem.find((el) => el.id === bookedItem.id);

      console.log(currentItem.data);

      current = currentItem.data.find((it) => it.date === el.textContent);

      let currentTimeAndPlace = current.timePlace;

      console.log(currentTimeAndPlace);

      currentTimeAndPlace.forEach((c) => {
        let tt = c.time;
        let rr = c.place;

        allPlaceTime.forEach((e) => {
          let tu = e.getAttribute("data-time");

          if (tt === tu) {
            e.childNodes.forEach((i) => {
              rr.forEach((q) => {
                if (i.textContent === q) {
                  i.classList.add("sold");
                }
              });
            });
          }
        });
      });
    }
  });
});

const time = document.querySelectorAll(".time li");

time.forEach((el) => {
  el.addEventListener("click", () => {
    time.forEach((it) => {
      it.classList.remove("checked");
      allPlaceTime.forEach((item) => {
        item.style = "display: none;";
      });
    });
    el.classList.add("checked");
    let times = el.textContent;
    allPlaceTime.forEach((item) => {
      let tm = item.getAttribute("data-time");

      if (tm === times) {
        item.style = "display: flex;";
      }
    });

    timeAndPlace.time = el.textContent;
  });
});

const placeItems = document.querySelectorAll(".place li");
let places = [];

placeItems.forEach((el) => {
  el.addEventListener("click", () => {
    let place = el.textContent;

    el.classList.toggle("checked");

    if (places.includes(place)) {
      let filteredPlaces = places.filter((el) => el !== place);

      places = filteredPlaces;
    } else {
      places.push(place);
    }
    timeAndPlace.place = places;
    activeBtn();
  });
});

const acceptBtn = document.querySelector(".accept-btn");

acceptBtn.addEventListener("click", () => {
  currentData.timePlace.push(timeAndPlace);
  bookedItem.data.push(currentData);

  saveDate();
});

function saveDate() {
  if (localStorage.getItem("data") !== null) {
    let currentFilms = JSON.parse(localStorage.getItem("data"));

    let currentFilm = currentFilms.find((el) => el.id === bookedItem.id);

    if (!currentFilm) {
      currentFilms.push(bookedItem);
      localStorage.setItem("data", JSON.stringify(currentFilms));
      console.log("Тут 5");
    } else {
      let currentDataFilm = currentFilm.data.find(
        (el) => el.date === bookedItem.data[0].date
      );

      if (currentDataFilm) {
        let currentTime = currentDataFilm.timePlace;

        currentTime.forEach((el) => {
          if (bookedItem.data[0].timePlace[0].time === el.time) {
            el.place.push(...bookedItem.data[0].timePlace[0].place);
            const updatedFilms = currentFilms.map((item) =>
              item.id === currentFilm.id ? currentFilm : item
            );
            localStorage.setItem("data", JSON.stringify(updatedFilms));
            console.log("Тут");
          } else {
            const exists = currentTime.some(
              (item) => item.time === bookedItem.data[0].timePlace[0].time
            );
            if (!exists) {
              currentTime.push(bookedItem.data[0].timePlace[0]);
              console.log(currentFilm);
              const updatedFilms = currentFilms.map((item) =>
                item.id === currentFilm.id ? currentFilm : item
              );
              localStorage.setItem("data", JSON.stringify(updatedFilms));
              console.log("Тут 2");
            }
          }
        });
      } else {
        currentFilm.data.push(bookedItem.data[0]);

        const updatedFilms = currentFilms.map((item) =>
          item.id === currentFilm.id ? currentFilm : item
        );
        localStorage.setItem("data", JSON.stringify(updatedFilms));
        console.log("Тут 3");
      }
    }
  } else {
    localStorage.setItem("data", JSON.stringify([bookedItem]));
    console.log("Тут 4");
  }

  document.querySelector(".message-seccesfull").classList.add("open");
  setTimeout(() => {
    document.querySelector(".message-seccesfull").classList.remove("open");
  }, 1500);
}

let timesAndPlaece;

const cancelBtn = document.querySelector(".cancel-btn");

cancelBtn.addEventListener("click", () => {
  const placeLi = document.querySelectorAll(".place li");

  placeLi.forEach((el) => {
    el.classList.remove("checked");
  });
  acceptBtn.classList.remove("active-btn");
});

function activeBtn() {
  if (timeAndPlace.place.length !== 0) {
    acceptBtn.classList.add("active-btn");
  } else {
    acceptBtn.classList.remove("active-btn");
  }
}

function clearPlaceAndDate() {
  placeItems.forEach((el) => {
    el.classList.remove("sold");
  });

  time.forEach((el, index) => {
    el.classList.remove("checked");

    if (index === 0) {
      el.classList.add("checked");
    }
  });
}
