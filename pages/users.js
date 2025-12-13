import { useContext, useEffect, useState } from "react";
import GlobalContext from "../store/globalContext";
import classes from "./users.module.css";

export default function UsersPage() {
  const { theGlobalObject } = useContext(GlobalContext);
  const currentUser = theGlobalObject.currentUser;

  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    permissions: "employee",
  });

  const [mode, setMode] = useState("create");
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (currentUser && currentUser.permissions === "admin") {
      loadUsers();
    }
  }, [currentUser]);

  async function loadUsers() {
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:8003/api/users");
      const result = await response.json();

      if (!response.ok) {
        setErrorMsg(result.detail || "Failed to load users");
        return;
      }

      setUsers(result);
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  }

  function handleChange(e) {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  }

  async function handleDelete(userId) {
    setErrorMsg("");

    try {
      const response = await fetch(
        `http://http://localhost:8003/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const result = await response.json();
        setErrorMsg(result.detail || "Failed to delete user");
        return;
      }

      await loadUsers();
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  }

  function setFormFromUser(user) {
    if (!user) return;

    setNewUser({
      name: user.name,
      password: "",
      permissions: user.permissions || "employee",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (mode === "create") {
        const response = await fetch("http://localhost:8003/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        const result = await response.json();

        if (!response.ok) {
          setErrorMsg(result.detail || "Failed to create user");
          return;
        }

        setNewUser({
          name: "",
          password: "",
          permissions: "employee",
        });

        setSelectedUserId("");
        await loadUsers();
      } else {
        if (!selectedUserId) return;

        const response = await fetch(
          `http://localhost:8003/api/users/${selectedUserId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newUser.name,
              password: newUser.password,
              permissions: newUser.permissions,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          setErrorMsg(result.detail || "Failed to update user");
          return;
        }

        await loadUsers();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  }

  if (!currentUser || currentUser.permissions !== "admin") {
    return (
      <div className={classes.pageWrapper}>
        <div className={classes.usersCard}>
          <h1 className={classes.title}>Users</h1>
          <p>Access restricted. Admins only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.pageWrapper}>
      <div className={classes.usersGrid}>
        <div className={classes.usersCard}>
          <h1 className={classes.title}>Users</h1>

          {errorMsg && <p className={classes.error}>{errorMsg}</p>}

          <table className={classes.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Permissions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.permissions}</td>
                  <td>
                    {currentUser.name !== user.name && (
                      <button
                        type="button"
                        className={classes.deleteButton}
                        onClick={() => handleDelete(user.id)}
                      >
                        X
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={classes.usersCard}>
          <h1 className={classes.title}>Add / Edit Users</h1>

          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.inputGroup}>
              <label>Mode</label>
              <select
                value={mode}
                onChange={(e) => {
                  const value = e.target.value;
                  setMode(value);

                  if (value === "edit" && users.length > 0) {
                    setSelectedUserId(users[0].id);
                    setFormFromUser(users[0]);
                  }

                  if (value === "create") {
                    setSelectedUserId("");
                    setNewUser({
                      name: "",
                      password: "",
                      permissions: "employee",
                    });
                  }
                }}
              >
                <option value="create">Create</option>
                <option value="edit">Edit</option>
              </select>
            </div>

            {mode === "edit" && (
              <div className={classes.inputGroup}>
                <label>User to edit</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedUserId(id);
                    const user = users.find((u) => u.id === id);
                    setFormFromUser(user);
                  }}
                >
                  <option value="">-- Select user --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={classes.inputGroup}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                required={mode === "create"}
              />
            </div>

            <div className={classes.inputGroup}>
              <label>Permissions</label>
              <select
                name="permissions"
                value={newUser.permissions}
                onChange={handleChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="employee+">Employee+</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <button type="submit" className={classes.addButton}>
              {mode === "create" ? "Add User" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
