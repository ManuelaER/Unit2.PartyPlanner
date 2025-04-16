const COHORT = "2502-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

const eventsList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent)

async function render() {
    await getEvents();
    renderEvents();
}
render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        console.log(result.data);
        state.events = result.data;
    } catch (error) {
        console.error(error);
    }
}


async function addEvent(event) {
    event.preventDefault();

    await createEvent(
        addEventForm.name.value,
        addEventForm.date.value,
        addEventForm.location.value,
        addEventForm.description.value,
    );
}

async function createEvent(name, date, location, description) {
    try {
        const isoDate = new Date(date).toISOString();
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, date: isoDate, location, description })
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          render();
        } else {
          console.error(result.error);
        }
    
    } catch (error) {
        console.error(error);
    }        
}

async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        console.log(response);
        render();
    } catch (error) {
        console.error(error);
    }
}
        
    

function renderEvents() {
    if (!state.events.length) {
        eventsList.innerHTML = `<li> No events found. Time to party plan! </li>`;
        return;
}

const eventBoxes = state.events.map((event) => {
    const eventBox = document.createElement("li");
    eventBox.classList.add("event");
    eventBox.innerHTML =
    `<h2>${event.name}</h2>
    <p><strong> Date: </strong> ${event.date} </p>
    <p><strong> location: </strong> ${event.location} </p>
    <p> ${event.description} </p>`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Cancel Event";
    deleteButton.addEventListener("click", () => deleteEvent(event.id));
    eventBox.append(deleteButton)

    return eventBox;
});

eventsList.replaceChildren(...eventBoxes);
}
