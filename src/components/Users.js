import React, { useState, useEffect } from 'react';
import "./Users.css"

function UserTable() {
    const [users, setUsers] = useState([]);
    const [edit, setEdit] = useState({});
    const [newUser, setNewUser] = useState({ firstName: '', lastName: '' });
    const [showForm, setShowForm] = useState(false);

    // Fetch Users on component mount
    useEffect(() => {
        fetch('http://localhost:8888/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching Users:', error));
    }, []);

    // Handle input changes for both new and edited Users
    function handleChange(event) {
        const { name, value } = event.target;
        if (edit._id) {
            setEdit(prev => ({ ...prev, [name]: value }));
        } else {
            setNewUser(prevUser => ({
                ...prevUser,
                [name]: value
            }));
        }
    }

    // Handle form submission for adding Users
    function handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:8888/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => response.json())
            .then(data => {
                setUsers([...users, data]); // Add new user to the list
                setShowForm(false); // Hide form
                setNewUser({ firstName: '', lastName: '' }); // Reset form
            })
            .catch(error => console.error('Error adding User:', error));
    }

    // Handle delete operation
    function handleDelete(id) {
        fetch(`http://localhost:8888/users?id=${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setUsers(users.filter(user => user._id !== id));
                } else {
                    throw new Error('Failed to delete the user');
                }
            })
            .catch(error => console.error('Error deleting User:', error));
    }

    // Start edit operation
    function startEdit(user) {
        setEdit(user);
    }

    // Handle edit changes submission
    function submitEdit() {
        fetch(`http://localhost:8888/users?id=${edit._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(edit)
        })
            .then(response => response.json())
            .then(data => {
                setUsers(users.map(user => (user._id === edit._id ? data : user)));
                setEdit({}); // Clear edit state
            })
            .catch(error => console.error('Error updating User:', error));
    }

    // Cancel edit
    function cancelEdit() {
        setEdit({});
    }

    return (
        <div>
            <button className="button" onClick={() => setShowForm(!showForm)}>Add User</button>
            {showForm && (
                <form onSubmit={handleSubmit} className="form-group">
                    <input
                        className="input-field"
                        name="firstName"
                        value={newUser.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                    />
                    <input
                        className="input-field"
                        name="lastName"
                        value={newUser.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                    />
                    <button className="form-button" type="submit">Submit</button>
                </form>
            )}
            <table className="user-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>
                            {edit._id === user._id ? (
                                <input
                                    className="input-field"
                                    name="firstName"
                                    value={edit.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            ) : (
                                user.firstName
                            )}
                        </td>
                        <td>
                            {edit._id === user._id ? (
                                <input
                                    className="input-field"
                                    name="lastName"
                                    value={edit.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            ) : (
                                user.lastName
                            )}
                        </td>
                        <td>
                            {edit._id === user._id ? (
                                <>
                                    <button className="button" onClick={submitEdit}>Save</button>
                                    <button className="button" onClick={cancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button className="button" onClick={() => startEdit(user)}>Edit</button>
                                    <button className="button" onClick={() => handleDelete(user._id)}>Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;
