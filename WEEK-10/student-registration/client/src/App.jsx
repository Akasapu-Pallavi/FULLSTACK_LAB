import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/students';
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
const GENDERS = ['Male', 'Female', 'Other'];
const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil'];
const EMPTY = { name: '', email: '', password: '', gender: '', country: '', languages: [] };

export default function App() {
  const [form, setForm] = useState(EMPTY);        // form data
  const [students, setStudents] = useState([]);   // records shown in the table
  const [editId, setEditId] = useState(null);     // id being edited (null = register mode)
  const [msg, setMsg] = useState(null);           // { type: 'success' | 'error', text }

  // READ
  const loadStudents = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setStudents(await res.json());
    } catch {
      setMsg({ type: 'error', text: 'Cannot load students. Check that the server is running on port 5000.' });
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // One handler for text, email, password, radio, select and checkbox controls
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((f) => ({
        ...f,
        languages: checked ? [...f.languages, value] : f.languages.filter((l) => l !== value),
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm(EMPTY);
    setEditId(null);
  };

  // CREATE (POST) or UPDATE (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: 'success', text: data.message });
      resetForm();
      loadStudents();
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Something went wrong. Try again.' });
    }
  };

  // Fill the form with the selected record
  const handleEdit = (s) => {
    setForm({
      name: s.name,
      email: s.email,
      password: '',
      gender: s.gender,
      country: s.country,
      languages: s.languages,
    });
    setEditId(s._id);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg({ type: 'success', text: data.message });
      if (editId === id) resetForm();
      loadStudents();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <main>
      <h1>Student registration</h1>
      <p className="sub">Register a student, then edit or delete records in the table below.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={editId ? 'Leave blank to keep current password' : ''}
            required={!editId}
            minLength={6}
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <select id="country" name="country" value={form.country} onChange={handleChange} required>
            <option value="">Select a country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend>Gender</legend>
          <div className="options">
            {GENDERS.map((g) => (
              <label key={g}>
                <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={handleChange} required />
                {g}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Languages</legend>
          <div className="options">
            {LANGUAGES.map((l) => (
              <label key={l}>
                <input type="checkbox" name="languages" value={l} checked={form.languages.includes(l)} onChange={handleChange} />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="actions">
          <button type="submit" className="primary">{editId ? 'Update' : 'Register'}</button>
          <button type="button" onClick={resetForm}>Reset</button>
        </div>
      </form>

      {msg && <p className={`msg ${msg.type}`} role="status">{msg.text}</p>}

      <h2>Registered students</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Gender</th><th>Country</th><th>Languages</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan="6" className="empty">No students registered yet. Use the form above to add the first one.</td></tr>
            )}
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.gender}</td>
                <td>{s.country}</td>
                <td>{s.languages.map((l) => <span className="chip" key={l}>{l}</span>)}</td>
                <td className="row-actions">
                  <button onClick={() => handleEdit(s)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
