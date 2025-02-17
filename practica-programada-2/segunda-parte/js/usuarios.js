document.addEventListener('DOMContentLoaded', function () {



    //carga las tareas en el DOM
    function loadUsuarios() {
        const usuariosList = document.getElementById('usuarios-list');
        usuariosList.innerHTML = '';

        usuarios.forEach(function (usuario) {
            //aqui vamos a tener un element del arreglo de tareas por cada uno de los elementos
            const usuarioCard = document.createElement('div');
            usuarioCard.className = 'col-md-4 mb-3';
            usuarioCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${usuario.name}</h5>
                    <p class="card-text">${usuario.email}</p>
                    <p class="card-text text-muted" > ${usuario.Rol}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-usuario" data-id="${usuario.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-usuario" data-id="${usuario.id}">Delete</button>
                </div>
            </div>
            `;
            usuariosList.appendChild(usuarioCard);
        });
    }
    loadUsuarios();
    //selecciona todos los botones que tengan la clase edit-task
    document.querySelectorAll('.edit-task').forEach(function (btnEdit) {
        //para cada boton, vamos a manajar el evento click, este evento lo va a manejar la funcion handleEditTask 
        //definida mas abajo.
        btnEdit.addEventListener('click', handleEditTask);
    });

    document.querySelectorAll('.delete-task').forEach(function (btnDelete) {
        //para cada boton, vamos a manajar el evento click, este evento lo va a manejar la funcion handleEditTask 
        //definida mas abajo.
        btnDelete.addEventListener('click', handleDeleteTask);
    });
    document.getElementById('agregarUsuario').addEventListener('submit', function (e) {
        e.preventDefault();
        // Obtener los valores de los inputs
        let nombre = document.getElementById('nombre').value;
        let email = document.getElementById('email').value;
        let rol = document.getElementById('rol').value;

        // Agregar el nuevo usuario al arreglo
        usuarios.push({
            id: usuarios.length + 1,
            name: nombre,
            email: email,
            Rol: rol
        });
        loadUsuarios();
        e.target.reset();

    });
});

// Datos ficticios para tareas
const usuarios = [
    {
        id: 1,
        name: "Cristiano",
        email: "user1@mail.com",
        Rol: "Admin"
    },
    {
        id: 2,
        name: "Salah",
        email: "user2@mail.com",
        Rol: "Editor"
    },
    {
        id: 3,
        name: "Davis",
        email: "user3@mail.com",
        Rol: "Viusualizador"
    }
];


// function agregarUsuario(){
//     const usuariosList = document.getElementById('usuarios-list');
//     // Obtener los valores de los inputs
//     let nombre = document.getElementById('nombre').value;
//     let email = document.getElementById('email').value;
//     let rol = document.getElementById('rol').value;

//     // Agregar el nuevo usuario al arreglo


//     usuarios.push({
//         id: usuarios.length + 1,
//         name: nombre,
//         email: email,
//         Rol: rol
//     });
// }
