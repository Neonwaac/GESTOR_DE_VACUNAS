const URI = "http://localhost:8007/mascota";

document.getElementById('mascota-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const animal = document.getElementById('animal').value;
    const edad = document.getElementById('edad').value;

    const nuevaMascota = {
        nombre: nombre,
        animal: animal,
        edad: parseInt(edad, 10)
    };

    try {
        const response = await fetch(URI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(nuevaMascota),
        });

        if (response.ok) {
            Swal.fire("¡Éxito!", "Mascota registrada con éxito", "success")
                .then(() => window.location.href = "../../index.html");
        } else {
            Swal.fire("Error", "Hubo un error al registrar la mascota", "error");
        }
    } catch (error) {
        console.error("Error al registrar la mascota:", error);
        Swal.fire("Error", "Hubo un problema en la solicitud", "error");
    }
});

