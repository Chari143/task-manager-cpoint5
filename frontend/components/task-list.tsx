"use client";
import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${base}/tasks`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to load tasks");
        return;
      }
      setTasks(data.tasks || []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const next = tasks.filter((t) => {
      if (filter === "all") return true;
      if (filter === "completed") return t.completed;
      return !t.completed;
    });
    setFilteredTasks(next);
  }, [tasks, filter]);

  const addTask = async () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!description){
      setError("Description is required");
      return;
    };
    setLoading(true);
    setError("");
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${base}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to add task");
        return;
      }
      setTasks((prev) => [data.task, ...prev]);
      setTitle("");
      setDescription("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async (task: Task) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${base}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !task.completed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to update task");
        return;
      }
      setError("");
      const newTasks = tasks.map((t) => (t.id === task.id ? data.task : t));
      setTasks(newTasks);
    } catch {
      setError("Network error");
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async (id: number) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${base}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
      setEditingId(null);
      setEditTitle("");
      setEditDescription("");
    } catch {}
  };

  const removeTask = async (id: number) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${base}/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) return;
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {}
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value); error && setError('');
    if (name === "description") setDescription(value); error && setError('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-3">
        <input
          name="title"
          className="border border-gray-300 rounded-md p-2 flex-1 h-12"
          placeholder="Title*"
          required
          value={title}
          onChange={handleInputChange}
        />
        <textarea
          className="border border-gray-300 rounded-md p-2 flex-2 h-12"
          placeholder="Description"
          name="description"
          value={description}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60 hover:opacity-90 hover:cursor-pointer"
          onClick={addTask}
          disabled={loading}
        >
          Add
        </button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && <div className="text-gray-600 text-sm">Loading...</div>}
      <div className="w-full justify-end flex items-center gap-2">
        <select
          name="filter"
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2 bg-white"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <ul className="space-y-3">
        {/* if tasks list empty the display a message*/}
        {(filter === "all" ? tasks : filteredTasks).length === 0 ? (
          <li className="text-gray-600 flex justify-center items-center h-12 text-md">No tasks found</li>
        ) : (
          (filter === "all" ? tasks : filteredTasks).map((t) => (
            <li
              key={t.id}
              className="border rounded-md p-3 flex items-start justify-between gap-3 border-gray-300"
            >
              <div className="flex-1">
                {editingId === t.id ? (
                  <div className="space-y-2">
                    <input
                      className="border border-gray-300 rounded-md p-2 w-full"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="border border-gray-300 rounded-md p-2 w-full"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.description}</div>
                    <div
                      className={`text-xs mt-1 ${
                        t.completed ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.completed ? "Completed" : "Pending"}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingId === t.id ? (
                  <>
                    <button
                      className="bg-green-600 text-white px-3 py-2 rounded-md hover:opacity-90 hover:cursor-pointer"
                      onClick={() => saveEdit(t.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-400 text-white px-3 py-2 rounded-md hover:opacity-90 hover:cursor-pointer"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:opacity-90 hover:cursor-pointer"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-2 rounded-md hover:opacity-90 hover:cursor-pointer"
                      onClick={() => removeTask(t.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:opacity-90 hover:cursor-pointer"
                      onClick={() => toggleCompleted(t)}
                    >
                      {t.completed ? "Mark Pending" : "Mark Done"}
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;
