document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-btn');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');

    // Hämtar alla todos från API
    async function fetchTodos() {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const todos = await response.json();
        renderTodos(todos);
    }

    // Rendera todos på sidan
    function renderTodos(todos) {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.toggle('completed', todo.completed);
            li.setAttribute('data-id', todo.id);
            li.textContent = todo.title;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id, checkbox.checked));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Ta bort';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                if (todo.completed) {
                    deleteTodo(todo.id);
                } else {
                    openModal();
                }
            });

            li.prepend(checkbox);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }

    // Uppdaterar status för en todo till completed eller ej completed
    async function toggleTodoCompletion(todoId, completed) {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'PUT',
            body: JSON.stringify({ completed }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Uppdatera DOM
        const todoItem = document.querySelector(`[data-id="${todoId}"]`);
        todoItem.classList.toggle('completed', completed);
    }

    // Lägger till en ny todo
    async function addTodo() {
        const newTodo = todoInput.value.trim();
        if (!newTodo) return;

        const todoData = {
            title: newTodo,
            completed: false,
            userId: 1,
        };

        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todoData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const newTodoResponse = await response.json();
        renderTodos([newTodoResponse]); // Rendera den nya todo
        todoInput.value = ''; // Rensa input-fältet
    }

    // Tar bort en todo
    async function deleteTodo(todoId) {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'DELETE',
        });

        // Ta bort todo från DOM
        const todoItem = document.querySelector(`[data-id="${todoId}"]`);
        todoItem.remove();
    }

    // Öppnar modal om en ej klarmarkerad todo försöker tas bort
    function openModal() {
        modal.style.display = 'block';
    }

    // Stänger modalen
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Eventlyssnare för att lägga till ny todo
    addButton.addEventListener('click', addTodo);

    // Hämta todos vid sidladdning
    fetchTodos();
});