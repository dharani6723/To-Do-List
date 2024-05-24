document.addEventListener('DOMContentLoaded', function() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskList = document.getElementById('taskList');

    loadTasksFromLocalStorage();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const task = {
            text: taskText,
            priority: priority
        };

        addTaskToDOM(task);
        saveTaskToLocalStorage(task);

        taskInput.value = '';
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.className = task.priority;

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;
        li.appendChild(taskTextSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit';
        editBtn.textContent = 'Edit';
        actionsDiv.appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove';
        removeBtn.textContent = 'Remove';
        actionsDiv.appendChild(removeBtn);

        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    }

    function handleTaskActions(event) {
        const action = event.target.className;
        const li = event.target.closest('li');
        
        if (action.includes('remove')) {
            taskList.removeChild(li);
            removeTaskFromLocalStorage(li.querySelector('.task-text').textContent);
        } else if (action.includes('edit')) {
            editTask(li);
        } else if (action.includes('save')) {
            saveEditedTask(li);
        }
    }

    function editTask(li) {
        const taskTextSpan = li.querySelector('.task-text');
        const taskText = taskTextSpan.textContent;
        taskTextSpan.innerHTML = `<input type="text" value="${taskText}" class="edit-input">`;

        const editBtn = li.querySelector('.edit');
        editBtn.textContent = 'Save';
        editBtn.className = 'save';
    }

    function saveEditedTask(li) {
        const editInput = li.querySelector('.edit-input');
        const newText = editInput.value.trim();
        
        if (newText === '') {
            alert('Task text cannot be empty.');
            return;
        }

        const taskTextSpan = li.querySelector('.task-text');
        taskTextSpan.textContent = newText;

        const saveBtn = li.querySelector('.save');
        saveBtn.textContent = 'Edit';
        saveBtn.className = 'edit';

        updateTaskInLocalStorage(taskTextSpan.dataset.oldText, newText);
    }

    function saveTaskToLocalStorage(task) {
        let tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasksFromLocalStorage() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => addTaskToDOM(task));
    }

    function removeTaskFromLocalStorage(taskText) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTaskInLocalStorage(oldText, newText) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.map(task => {
            if (task.text === oldText) {
                task.text = newText;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
