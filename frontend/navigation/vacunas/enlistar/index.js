const params = new URLSearchParams(window.location.search);
const response = params.get("response");
const mascota = JSON.parse(decodeURIComponent(response));
console.log(mascota);

const URI = "http://localhost:8007/historial";

document.getElementById('vacunaForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const id_vacuna = document.getElementById('vacunaSelect').value; 
    const fecha = document.getElementById('fechaVacuna').value; 

    const nuevaVacuna = {
        id_mascota: mascota.id,
        id_vacuna: id_vacuna,
        fecha: fecha
    };

    try {
        const response = await fetch(URI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevaVacuna),
        });

        if (response.ok) {
            Swal.fire("¡Éxito!", "Vacuna registrada con éxito", "success")
                .then(() => {
                    const responseValue = JSON.stringify(mascota);
                    const encodedResponse = encodeURIComponent(responseValue);
                    window.location.href = "../index.html?response=" + encodedResponse;
                });
        } else {
            Swal.fire("Error", "Hubo un error al registrar la vacuna", "error");
        }
    } catch (error) {
        console.error("Error al registrar la vacuna:", error);
        Swal.fire("Error", "Hubo un problema en la solicitud", "error");
    }
});


