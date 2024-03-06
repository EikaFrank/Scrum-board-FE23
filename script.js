import { getTasks, addTask, updateTask, deleteTask } from './modules/fetching.js';

let tasks = [];

function assignTask(taskId, assigned) {

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].assigned = assigned;

        updateTask(taskId, { assigned: assigned })
            .then(() => {
                renderTasks(tasks);
            })
            .catch(error => {
                console.error('Error assigning task:', error);
            });
    }
}

function markTaskAsDone(taskId) {
    console.log("Marking task as done:", taskId);

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        const task = tasks[taskIndex];
        if (task.assigned) {
            task.status = "done";

            updateTask(taskId, { status: "done" })
                .then(() => {
                    renderTasks(tasks);
                })
                .catch(error => {
                    console.error('Error marking task as done:', error);
                });
        } else {
            console.error('Task cannot be marked as done without assigned');
        }
    } else {
        console.error('Task not found');
    }
}


function removeTask(taskId) {
    console.log('Remove Task - Removing task:', taskId);

    deleteTask(taskId)
        .then(() => {
            tasks = tasks.filter(task => task.id !== taskId);
            console.log('Remove Task - Task removed successfully');
            renderTasks(tasks);
        })
        .catch(error => {
            console.error('Error removing task:', error);
        });
}

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    const category = task.category.replace(/\s/g, '-');

    taskElement.classList.add('task', category);
    taskElement.textContent = task.task + " - " + task.assigned;

    if (task.status === "to do") {
        const assignButton = document.createElement('button');
        assignButton.textContent = 'Assign >>';
        assignButton.addEventListener('click', () => {
            assignTask(task.id, task.assigned);
        });
        taskElement.appendChild(assignButton);

    } else if (task.status === "in progress") {
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done >>';
        doneButton.addEventListener('click', () => {
            markTaskAsDone(task.id);
        });
        taskElement.appendChild(doneButton);

    } else if (task.status === "done") {
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove X';
        removeButton.addEventListener('click', () => {
            removeTask(task.id);
        });
        taskElement.appendChild(removeButton);
    }

    return taskElement;
}


function renderTasks(tasks) {
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);

        switch (task.status) {
            case "to do":
                document.getElementById('todoList').appendChild(taskElement);
                break;
            case "in progress":
                document.getElementById('inProgressList').appendChild(taskElement);
                break;
            case "done":
                document.getElementById('doneList').appendChild(taskElement);
                break;
        }
    });
}

async function loadTasks() {
    try {
        const tasks = await getTasks();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error getting tasks:', error);
    }
}

loadTasks();


const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('task');
    const assignedInput = document.getElementById('assigned');
    const categorySelect = document.getElementById('devArea');
    const task = taskInput.value.trim();
    const assign = assignedInput.value.trim();
    const category = categorySelect.value.toLowerCase();

    if (task !== '' && category !== '' && assign !== '') {
        addTask({ assigned: assign, category:category, status: "to do", task: task })
            .then(() => {
                return getTasks();
            })
            .then(tasks => {
                renderTasks(tasks);

                taskInput.value = '';
                assignedInput.value = '';
                categorySelect.value = '';
            })
            .catch(error => {
                console.error('Error adding task', error);
            });
    } else {
        console.error('Task or category cannot be emty');
    }
});
const todoList = document.getElementById('todoList');
const inProgressList = document.getElementById('inProgressList');
const todoTasks = todoList.querySelectorAll('.task');


todoTasks.forEach(taskElement => {
    const taskIndex = tasks.findIndex(task => taskElement.textContent.includes(task.task));
    if (taskIndex !== -1) {
        const task = tasks[taskIndex];
        task.status = "in progress";
        inProgressList.appendChild(taskElement);
    }
});



document.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.id === 'done') {
        const inProgressList = document.getElementById('inProgressList');
        const doneList = document.getElementById('doneList');
        const inProgressTasks = inProgressList.querySelectorAll('.task');

        inProgressTasks.forEach(taskElement => {
            const taskIndex = tasks.findIndex(task => taskElement.textContent.includes(task.task));
            if (taskIndex !== -1) {
                const task = tasks[taskIndex];
                task.status = "done";
                doneList.appendChild(taskElement);
            }
        });
    }
});


document.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.id === 'remove') {
        const doneList = document.getElementById('doneList');
        const doneTasks = doneList.querySelectorAll('.task');

        doneTasks.forEach(taskElement => {
            const taskIndex = tasks.findIndex(task => taskElement.textContent.includes(task.task));
            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
                taskElement.remove();
            }
        });
    }
});
