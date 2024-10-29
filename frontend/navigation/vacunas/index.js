const params = new URLSearchParams(window.location.search);
const response = params.get("response");
const mascota = JSON.parse(decodeURIComponent(response));
const URI = "http://localhost:8007/vacuna";
const URIH = "http://localhost:8007/mascota/" + mascota.id + "/historial";
const URIHE = "http://localhost:8007/historial";

const tituloMascota = document.getElementById("titulo-mascota");
tituloMascota.innerText = " " + mascota.animal.toUpperCase() + " " + mascota.nombre.toUpperCase();

const tableVacuna = document.getElementById("table-vacuna");
const tableFecha = document.getElementById("table-fecha");
const tableAcciones = document.getElementById("table-acciones");
const addContainer = document.getElementById("add-container");

const editHistorialModal = document.getElementById("editHistorialModal");
const closeHistorialModal = document.getElementById("closeHistorialModal");
const editHistorialForm = document.getElementById("editHistorialForm");
let selectedHistorial = null;


const openEditHistorialModal = (historial) => {
    selectedHistorial = historial;
    document.getElementById("editFecha").value = formatFecha(historial.fecha);
    editHistorialModal.style.display = "block";
};

closeHistorialModal.addEventListener("click", () => {
    editHistorialModal.style.display = "none";
});


editHistorialForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedHistorial = {
        id: selectedHistorial.id,
        fecha: document.getElementById("editFecha").value,
    };

    fetch(URIHE + "/" + updatedHistorial.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedHistorial),
    })
    .then(response => {
        if (response.ok) {
            Swal.fire("¡Éxito!", "Fecha del historial editada con éxito", "success");
            editHistorialModal.style.display = "none";
            location.reload();
        } else {
            Swal.fire("Error", "Error al editar la fecha del historial", "error");
        }
    })
    .catch(error => {
        console.error("Error al actualizar la fecha del historial:", error);
        Swal.fire("Error", "Hubo un problema en la solicitud", "error");
    });
});


const deleteHistorial = (id) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(URIHE + "/" + id, {
                method: "DELETE",
            })
            .then((response) => {
                if (response.ok) {
                    Swal.fire("¡Eliminado!", "Historial eliminado con éxito", "success");
                    location.reload();
                } else {
                    Swal.fire("Error", "No se pudo eliminar el historial", "error");
                }
            })
            .catch((error) => {
                console.error("Error al eliminar el historial: ", error);
                Swal.fire("Error", "Hubo un problema en la solicitud", "error");
            });
        }
    });
};


function functionAddVacuna(historial) {
    const responseValue = JSON.stringify(historial);
    const encodedResponse = encodeURIComponent(responseValue);
    console.log(encodedResponse);
    window.location.href = "./enlistar/index.html?response=" + encodedResponse;
}
function formatFecha(fecha){
    const date = new Date(fecha)
    const dia = date.getDate();
    const mes = date.getMonth()+1;
    const anio = date.getFullYear();
    return dia+"/"+mes+"/"+anio
}
const showHistorial = (dataHistorial) => {
    const addVacuna = document.createElement("div");
    addVacuna.classList.add("add-pet");
    addVacuna.addEventListener("click", () => functionAddVacuna(mascota));
    addContainer.innerHTML = "";
    addContainer.appendChild(addVacuna);
    if (dataHistorial.length === 0) return;
    dataHistorial.forEach((historial) => {
        fetch(URI + "/" + historial.id_vacuna)
        .then((response) => response.json())
        .then((vacunaData) => {
            const vacunaDiv = document.createElement("div");
            vacunaDiv.textContent = vacunaData[0].nombre;
            vacunaDiv.classList.add("tile");
            tableVacuna.appendChild(vacunaDiv);
    
            const fechaDiv = document.createElement("div");
            fechaDiv.textContent = formatFecha(historial.fecha);
            fechaDiv.classList.add("tile");
            tableFecha.appendChild(fechaDiv);
            
            const actionsDiv = document.createElement("div");
            actionsDiv.classList.add("tile");

            const editButton = document.createElement("button");
            editButton.classList.add("table-btn", "edit-btn");
            editButton.addEventListener("click", () => openEditHistorialModal(historial))

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("table-btn", "delete-btn");
            deleteButton.addEventListener("click", () => deleteHistorial(historial.id));
            
            const addVacuna = document.createElement("div");
            addVacuna.classList.add("add-pet");
            addVacuna.addEventListener("click", () => functionAddVacuna(mascota));

            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);
            tableAcciones.appendChild(actionsDiv);
            addContainer.innerHTML = "";
            addContainer.appendChild(addVacuna);
        });
    });
};



fetch(URIH)
    .then((response) => response.json())
    .then(showHistorial)
    .catch((error) => console.error("Error al cargar el historial:", error));
