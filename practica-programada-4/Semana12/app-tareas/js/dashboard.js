document.addEventListener('DOMContentLoaded', function () {

    const API_URL = "backend/tasks.php";
    const API_URL_COMMENTS = "backend/comments.php";
    let isEditMode = false;
    let commentIsEditMode = false;
    let edittingId;
    let tasks = [];

    async function loadTasks() {
        //go to the backed to obtain the data
        try {
            const response = await fetch(API_URL, { method: 'GET', credentials: 'include' });
            if (response.ok) {
                tasks = await response.json();
                renderTasks(tasks);
            } else {
                if (response.status == 401) {
                    //estamos tratando de consutlar sin sesion
                    window.location.href = "index.html";
                }
                console.error("Error al obtener tareas");
            }

        } catch (err) {
            console.error(err);
        }
    }
    const loadCommentsForTask = async (taskId) => {
        try {
            const response = await fetch(`${API_URL_COMMENTS}?task_id=${taskId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) throw new Error("Error al obtener comentarios");
            return await response.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    };
    

    async function renderTasks() {
        const taskList = document.getElementById('task-list');
        for (const task of tasks) {
            const comments = await loadCommentsForTask(task.id);
    
            let commentsList = '';
            if (comments.length > 0) {
                commentsList = '<ul class="list-group list-group-flush">';
                comments.forEach((comment) => {
                    commentsList += `
                        <li class="list-group-item">
                            <div class="bg-light p-3 rounded shadow-sm">
                                <p class="mb-2 text-body">${comment.comment}</p>
                                <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-sm btn-outline-primary edit-comment"
                                        data-taskid="${task.id}" data-commentid="${comment.id}" data-text="${comment.comment}">
                                    <i class="fa-solid fa-pen-to-square me-1"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-danger remove-comment"
                                        data-taskid="${task.id}" data-commentid="${comment.id}">
                                    <i class="fa-solid fa-trash me-1"></i>
                                </button>
                                </div>
                            </div>
                            </li>
                    `;
                });
                commentsList += '</ul>';
            }
    
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small></p>
                        <hr>
                        <h6>Comments:</h6>
                        ${commentsList}
                        <hr>
                        <button type="button" class="btn btn-sm btn-link add-comment" data-id="${task.id}">
                        Add Comment
                        </button>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskCard);
        }

      document.querySelectorAll(".edit-task").forEach(function (button) {
        button.addEventListener("click", handleEditTask);
      });

      document.querySelectorAll(".delete-task").forEach(function (button) {
        button.addEventListener("click", handleDeleteTask);
      });

      document.querySelectorAll(".add-comment").forEach(function (button) {
        button.addEventListener("click", function (e) {
          // alert(e.target.dataset.id);
          document.getElementById("comment-task-id").value =
            e.target.dataset.id;
          const modal = new bootstrap.Modal(
            document.getElementById("commentModal")
          );
          modal.show();
        });
      });

      document.querySelectorAll(".edit-comment").forEach(function (button) {
        button.addEventListener("click", function (e) {
            const modal = new bootstrap.Modal(document.getElementById("commentModal"));

          modal.show();
          const button = e.target.closest(".edit-comment");

          const commentId = button.dataset.commentid;
          const commentText  = button.dataset.text;
          commentIsEditMode = true;
          
            // Set comment text in the input field
            document.getElementById("task-comment").value = commentText;
          // Store comment ID in a hidden input or a variable for the update
          document.getElementById("comment-task-id").value = commentId;

          
        });
      });
    
      document.querySelectorAll(".remove-comment").forEach(function (button) {
        button.addEventListener("click", function (e) {
            const commentId = parseInt(e.target.parentNode.dataset.commentid);

            if (!confirm("Are you sure you want to delete this comment?")) return;
    
            fetch(`${API_URL_COMMENTS}?id=${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete comment");
                return response.json();
            })
            .then(data => {
                console.log("Comment deleted:", data);
                renderTasks(); // Refresh task list with comments
            })
            .catch(error => {
                console.error("Error deleting comment:", error);
            });
              loadTasks();
            });
        });
    }

    function handleEditTask(event) {
        try {
            // alert(event.target.dataset.id);
            //localizar la tarea quieren editar
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            //cargar los datos en el formulario 
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.due_date;
            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = taskId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();


        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }


    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        try {
            // API_URL + '?id=' + id; otra forma de concatenar en JS
            const response = await fetch(`${API_URL}?id=${id}`, { credentials: 'include', method: 'DELETE' });
            if (response.ok) {
                loadTasks();
            } else {
                console.error("Problema al eliminar la tarea");
            }
        } catch (err) {
            console.error(err);
        }
    }

    document.getElementById('comment-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const comment = document.getElementById('task-comment').value;

        const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));

        if(commentIsEditMode){
            const commentId = parseInt(document.getElementById('comment-task-id').value);
            const response = await fetch(`${API_URL_COMMENTS}?id=${commentId}`, {
                method: 'PUT',
                headers:{
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    comment: comment,
                    id: commentId
                }),
                credentials: 'include'
            });
            if(!response.ok){
                console.error("No se pudo actualizar el comentario");
            }
            commentIsEditMode = false;
        }else{
            const selectedTask = parseInt(document.getElementById('comment-task-id').value);
            const response = await fetch(API_URL_COMMENTS, {
                method: 'POST',
                headers:{
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    comment: comment,
                    task_id: selectedTask
                }),
                credentials: 'include'
            });
            if(!response.ok){
                console.error("No se pudo agregar el comentario");
            }
        }

        modal.hide();
        loadTasks();

    })

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            const response = await fetch(`${API_URL}?id=${edittingId}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: title, description: description, due_date: dueDate })
                });
            if (!response.ok) {
                console.error("no se pudo actualizar la tarea");
            }

        } else {
            const newTask = {
                title: title,
                description: description,
                due_date: dueDate
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers:{
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });
            if(!response.ok){
                console.error("No se pudo agregar la tarea");
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('commentModal').addEventListener('show.bs.modal', function () {
        document.getElementById('comment-form').reset();
    })

    document.getElementById('taskModal').addEventListener('show.bs.modal', function () {
        if (!isEditMode) {
            document.getElementById('task-form').reset();
            // document.getElementById('task-title').value = "";
            // document.getElementById('task-desc').value = "";
            // document.getElementById('due-date').value = "";
        }
    });

    document.getElementById("taskModal").addEventListener('hidden.bs.modal', function () {
        edittingId = null;
        isEditMode = false;
    })
    loadTasks();

});