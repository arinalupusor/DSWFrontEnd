import React, { useState, useEffect } from 'react';
import "./Todos.css"

function TodoTable() {
    const [todos, setTodos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newTodo, setNewTodo] = useState({ title: '', text: '', userId: "6454eea3bb5baecdf545d4aa" });
    const [edit, setEdit] = useState({});  // Holds the currently editing todo's data

    // Fetch Todos on component mount
    useEffect(() => {
        fetch('http://localhost:8888/todos')
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => console.error('Error fetching Todos:', error));
    }, []);

    // Handle input changes for both new and edited Todos
    function handleChange(event) {
        const { name, value } = event.target;
        if (edit._id) {
            // Update edit state if editing
            setEdit(prev => ({ ...prev, [name]: value }));
        } else {
            // Update newTodo state if adding a new todo
            setNewTodo(prevTodo => ({
                ...prevTodo,
                [name]: value
            }));
        }
    }

    // Handle form submission for adding Todos
    function handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:8888/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        })
            .then(response => response.json())
            .then(data => {
                setTodos([...todos, data]); // Add new todo to the list
                setShowForm(false); // Hide form
                setNewTodo({ title: '', text: '', userId: "6454eea3bb5baecdf545d4aa" }); // Reset form
            })
            .catch(error => console.error('Error adding Todo:', error));
    }

    // Handle delete operation
    function handleDelete(id) {
        fetch(`http://localhost:8888/todos?id=${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setTodos(todos.filter(todo => todo._id !== id));
                } else {
                    throw new Error('Failed to delete the todo');
                }
            })
            .catch(error => console.error('Error deleting Todo:', error));
    }

    // Start edit operation
    function startEdit(todo) {
        setEdit(todo);
    }

    // Handle edit changes submission
    function submitEdit() {
        fetch(`http://localhost:8888/todos?id=${edit._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(edit)
        })
            .then(response => response.json())
            .then(data => {
                setTodos(todos.map(todo => (todo._id === edit._id ? data : todo)));
                setEdit({}); // Clear edit state
            })
            .catch(error => console.error('Error updating Todo:', error));
    }

    // Cancel edit
    function cancelEdit() {
        setEdit({}); // Clear edit state
    }

    return (
        <div>
            <button className="button" onClick={() => setShowForm(!showForm)}>Add Todo</button>
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Text</th>
                    <th>User ID</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {todos.map(todo => (
                    <tr key={todo._id}>
                        <td>{todo._id}</td>
                        <td>
                            {edit._id === todo._id ? (
                                <input className="form-control"
                                       name="title"
                                       value={edit.title}
                                       onChange={handleChange}
                                       required
                                />
                            ) : (
                                todo.title
                            )}
                        </td>
                        <td>
                            {edit._id === todo._id ? (
                                <input className="form-control"
                                       name="text"
                                       value={edit.text}
                                       onChange={handleChange}
                                       required
                                />
                            ) : (
                                todo.text
                            )}
                        </td>
                        <td>{todo.userId}</td>
                        <td>
                            {edit._id === todo._id ? (
                                <>
                                    <button className="button" onClick={submitEdit}>Save</button>
                                    <button className="button" onClick={cancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button className="button" onClick={() => startEdit(todo)}>Edit</button>
                                    <button className="button" onClick={() => handleDelete(todo._id)}>Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showForm && (
                <form onSubmit={handleSubmit} className="form-group">
                    <input className="form-control"
                           name="title"
                           value={newTodo.title}
                           onChange={handleChange}
                           placeholder="Title"
                           required
                    />
                    <input className="form-control"
                           name="text"
                           value={newTodo.text}
                           onChange={handleChange}
                           placeholder="Text"
                           required
                    />
                    <input className="form-control"
                           name="userId"
                           value={newTodo.userId}
                           onChange={handleChange}
                           placeholder="User ID"
                           required
                    />
                    <button className="button" type="submit">Submit</button>
                </form>
            )}
        </div>

    );
}

export default TodoTable;
