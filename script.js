document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const priority = document.getElementById('priority');
    const taskList = document.getElementById('taskList');

    let tasks = [];
    let searchElementsAdded = false;
    let searchInput, filterPriority;

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks
            .filter(task => {
                const matchesPriority = filterPriority.value === 'all' || task.priority === filterPriority.value;
                const matchesSearch = task.text.toLowerCase().includes(searchInput.value.toLowerCase());
                return matchesPriority && matchesSearch;
            });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.draggable = true;
            if (task.completed) {
                li.classList.add('completed');
            }
            li.innerHTML = `
                <div class="checkbox ${task.completed ? 'checked' : ''}"></div>
                <span class="task-text">${task.text} <small>(Due: ${task.dueDate})</small></span>
                <span class="priority ${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                <div class="actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            const checkbox = li.querySelector('.checkbox');
            const deleteBtn = li.querySelector('.delete-btn');
            const editBtn = li.querySelector('.edit-btn');

            checkbox.addEventListener('click', () => {
                task.completed = !task.completed;
                renderTasks();
            });

            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks();
            });

            editBtn.addEventListener('click', () => {
                editTask(task);
            });

            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });

            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });

            taskList.addEventListener('dragover', (e) => {
                e.preventDefault();
                const dragging = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(taskList, e.clientY);
                if (afterElement == null) {
                    taskList.appendChild(dragging);
                } else {
                    taskList.insertBefore(dragging, afterElement);
                }
            });

            taskList.appendChild(li);
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function addSearchElements() {
        if (searchElementsAdded) return;

        searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search';
        searchInput.placeholder = 'Search tasks';

        filterPriority = document.createElement('select');
        filterPriority.id = 'filterPriority';
        filterPriority.innerHTML = `
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        `;

        taskForm.insertAdjacentElement('afterend', searchInput);
        searchInput.insertAdjacentElement('afterend', filterPriority);

        searchInput.addEventListener('input', renderTasks);
        filterPriority.addEventListener('change', renderTasks);

        searchElementsAdded = true;
    }

    function editTask(task) {
        const newText = prompt('Edit task text:', task.text);
        if (newText === null || newText.trim() === '') return;

        const newDueDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate);
        if (newDueDate === null || newDueDate.trim() === '') return;

        const newPriority = prompt('Edit priority (low, medium, high):', task.priority);
        if (newPriority === null || !['low', 'medium', 'high'].includes(newPriority.toLowerCase())) return;

        task.text = newText;
        task.dueDate = newDueDate;
        task.priority = newPriority.toLowerCase();

        renderTasks();
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (priority.value === "" || priority.value === "Add Priority") {
            alert("Please select a valid priority for the task.");
            return;
        }
        const task = {
            id: Date.now(),
            text: taskInput.value,
            dueDate: dueDate.value,
            priority: priority.value,
            completed: false
        };
        tasks.push(task);
        taskInput.value = '';
        dueDate.value = '';
        priority.value = '';
        addSearchElements();
        renderTasks();
    });

    renderTasks();
});








       

       
