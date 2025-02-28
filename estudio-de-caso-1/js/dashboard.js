document.addEventListener('DOMContentLoaded', function () {


    const tasks = [
        {
            id: 1,
            title: "Complete Project Report",
            description: "Prepare and submit the final project report by the end of the week.",
            due_date: "2024-08-25",
            comments: [
                "This looks great, looking forward to it!",
                "Can you include the new design specs?"
            ]
        },
        {
            id: 2,
            title: "Team Meeting",
            description: "Schedule a team meeting to discuss the next sprint.",
            due_date: "2024-08-26",
            comments: [
                "Let's make sure the whole team is available."
            ]
        },
        {
            id: 3,
            title: "Pizza party planning",
            description: "Plan the pizza party for the team.",
            due_date: "2024-10-28",
            comments: [
                "Would love Papa Johns pizza tbh"
            ]
        }
    ];

    let editingTaskId = null;
    let taskCounter = tasks.length;

function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(function (task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'col-md-4 mb-3';
        taskCard.innerHTML = `
            <div class="card" data-id="${task.id}">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text text-muted">${task.due_date}</p>
                    <hr>

                    <!-- Comments Section -->
                    <div class="comments" style="max-height: 200px; overflow-y: auto; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                        <h6>Comments</h6>
                        ${task.comments.map((comment, index) => `
                            <div class="comment" style="background-color: #ffffff; border: 1px solid #ddd; margin-bottom: 10px; padding: 10px; border-radius: 5px;">
                                <p class="comment-text" data-index="${index}">${comment}</p>
                                <button class="btn btn-danger btn-sm delete-comment" data-task-id="${task.id}" data-comment-index="${index}">Delete</button>
                                <button class="btn btn-warning btn-sm edit-comment" data-task-id="${task.id}" data-comment-index="${index}">Edit</button>
                            </div>
                        `).join('')}
                    </div>

                    <hr>

                    <!-- Comment Input Form -->
                    <div class="comment-form" style="padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                        <textarea class="commentInput" placeholder="Add a comment..." rows="3" class="form-control" style="resize: none;"></textarea>
                        <button class="btn btn-primary mt-2 submit-comment" style="width: 100%;">Submit Comment</button>
                    </div>
                </div>

                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
            </div>
        `;
        taskList.appendChild(taskCard);
    });

    document.querySelectorAll('.submit-comment').forEach(button => {
        button.addEventListener('click', function(event) {
            const card = event.target.closest('.card'); 
            const commentInput = card.querySelector('.commentInput');
            const taskId = parseInt(card.dataset.id); 
            const task = tasks.find(t => t.id === taskId);

            if (commentInput.value.trim()) {
                task.comments.push(commentInput.value.trim()); 
                loadTasks(); 
                commentInput.value = ''; 
            }
        });
    });


    document.querySelectorAll('.delete-comment').forEach(button => {
        button.addEventListener('click', function(event) {
            const taskId = parseInt(event.target.dataset.taskId); 
            const commentIndex = parseInt(event.target.dataset.commentIndex);
            const task = tasks.find(t => t.id === taskId);
            
            task.comments.splice(commentIndex, 1);
            loadTasks(); 
        });
    });

    // Attach the event listener for editing comments
    document.querySelectorAll('.edit-comment').forEach(button => {
        button.addEventListener('click', function(event) {
            const taskId = parseInt(event.target.dataset.taskId); 
            const commentIndex = parseInt(event.target.dataset.commentIndex); 
            const task = tasks.find(t => t.id === taskId); 
            const commentText = task.comments[commentIndex]; 

            const commentElement = event.target.previousElementSibling; 
            commentElement.innerHTML = `
                <textarea class="form-control edit-comment-input" rows="3">${commentText}</textarea>
                <button class="btn btn-primary save-edit-comment" style="width: 100%;">Save</button>
            `;

            const saveButton = commentElement.querySelector('.save-edit-comment');
            saveButton.addEventListener('click', function() {
                const newCommentText = commentElement.querySelector('.edit-comment-input').value.trim();
                if (newCommentText) {
                    task.comments[commentIndex] = newCommentText;
                    loadTasks(); 
                }
            });
        });
    });

    document.querySelectorAll('.edit-task').forEach(btnEdit => {
        btnEdit.addEventListener('click', handleEditTask);
    });

    document.querySelectorAll('.delete-task').forEach(btnDelete => {
        btnDelete.addEventListener('click', handleDeleteTask);
    });
}

    function handleEditTask(event) {
        editingTaskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === editingTaskId);
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('due-date').value = task.due_date;
        document.getElementById('taskModalLabel').textContent = 'Edit task';
        const modal = new bootstrap.Modal(document.getElementById('taskModal'));
        modal.show();
    }

    function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        const taskIndex = tasks.findIndex(t => t.id === id);
        tasks.splice(taskIndex, 1);
        loadTasks();
    }


    window.addComment = function (event) {
        const card = event.target.closest('.card');


        const commentInput = card.querySelector('.commentInput');

       
        const taskId = parseInt(card.querySelector('.edit-task').dataset.id);

        const task = tasks.find(t => t.id === taskId);

        if (commentInput.value.trim()) {
            task.comments.push(commentInput.value.trim());

            loadTasks();

            commentInput.value = '';
        }
    }

    document.getElementById('task-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;

        if (!editingTaskId) {
            taskCounter++;
            const newTask = { id: taskCounter, title, description, due_date: dueDate, comments: [] };
            tasks.push(newTask);
        } else {
            let task = tasks.find(t => t.id === editingTaskId);
            task.title = title;
            task.description = description;
            task.due_date = dueDate;
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();
    });

    document.getElementById('taskModal').addEventListener('hidden.bs.modal', function () {
        editingTaskId = null;
    });

    loadTasks();

});
