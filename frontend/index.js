const URI = "http://localhost:8007/mascota";
const URIvacuna = "http://localhost:8007/vacuna";

const tableNombre = document.getElementById("table-nombre");
const tableAnimal = document.getElementById("table-animal");
const tableEdad = document.getElementById("table-edad");
const tablehistorial = document.getElementById("table-historial");
const tableButtons = document.getElementById("table-buttons");

const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editForm = document.getElementById("editForm");
let selectedMascota = null;


const openEditModal = (mascota) => {
    selectedMascota = mascota;
    document.getElementById("editNombre").value = mascota.nombre;
    document.getElementById("editAnimal").value = mascota.animal;
    document.getElementById("editEdad").value = mascota.edad;
    editModal.style.display = "block";
};

closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
});

editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const updatedMascota = {
        ...selectedMascota,
        nombre: document.getElementById("editNombre").value,
        animal: document.getElementById("editAnimal").value,
        edad: document.getElementById("editEdad").value,
    };

    fetch(URI + "/" + selectedMascota.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMascota),
    })
    .then(response => {
        if (response.ok) {
            alert("Editado con éxito");
            editModal.style.display = "none";
            location.reload();
        } else {
            alert("Error al editar");
        }
    });
});
function mostrarHistorial(mascota){
    const responseValue = JSON.stringify(mascota);
    const encodedResponse = encodeURIComponent(responseValue);
    console.log(encodedResponse)
    window.location.href="./navigation/vacunas/index.html?response="+encodedResponse
}

const showMascota = (dataMascota) => {
    dataMascota.forEach((mascota) => {
        const nombreDiv = document.createElement("div");
        nombreDiv.classList.add("tile");
        nombreDiv.textContent = mascota.nombre;

        const animalDiv = document.createElement("div");
        animalDiv.classList.add("tile");
        animalDiv.textContent = mascota.animal;

        const edadDiv = document.createElement("div");
        edadDiv.classList.add("tile");
        edadDiv.textContent = mascota.edad;

        const historialDiv = document.createElement("div");
        historialDiv.classList.add("tile");
        historialDiv.textContent = mascota.historial;

        const historialButton = document.createElement("button");
        historialButton.textContent = "Mostrar historial";
        historialButton.classList.add("show-btn");
        historialButton.onclick = () => mostrarHistorial(mascota);

        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("tile");

        const editButton = document.createElement("button");
        editButton.classList.add("table-btn", "edit-btn");
        editButton.addEventListener("click", () => openEditModal(mascota));

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("table-btn", "delete-btn");
        deleteButton.addEventListener("click", () => deleteMascota(mascota.id));

        tableNombre.appendChild(nombreDiv);
        tableAnimal.appendChild(animalDiv);
        tableEdad.appendChild(edadDiv);
        historialDiv.appendChild(historialButton);
        tablehistorial.appendChild(historialDiv);
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        tableButtons.appendChild(actionsDiv);
    });
};


fetch(URI)
  .then((response) => response.json())
  .then(showMascota)
  .catch((error) => console.error(error));

  const deleteMascota = (id) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(URI + "/" + id, {
                method: "DELETE",
            })
            .then((response) => {
                if (response.ok) {
                    Swal.fire("¡Eliminado!", "Mascota eliminada con éxito", "success");
                    location.reload();
                } else {
                    Swal.fire("Error", "No se pudo eliminar la mascota", "error");
                }
            })
            .catch((error) => {
                console.error("Error al eliminar la mascota:", error);
                Swal.fire("Error", "Hubo un problema en la solicitud", "error");
            });
        }
    });
};
