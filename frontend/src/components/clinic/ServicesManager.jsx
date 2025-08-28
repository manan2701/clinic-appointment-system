import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner';
import '../../css/Forms.css';
import '../../css/Button.css';

const empty = { name: '', price: '', durationMinutes: '', description: '' };

const ServicesManager = () => {
	const [loading, setLoading] = useState(true);
	const [services, setServices] = useState([]);
	const [form, setForm] = useState(empty);
	const [editingId, setEditingId] = useState(null);

	const load = async () => {
		setLoading(true);
		try { const res = await axios.get('/api/clinic/services'); setServices(res.data); }
		finally { setLoading(false); }
	};
	useEffect(() => { load(); }, []);

	const submit = async (e) => {
		e.preventDefault();
		const payload = { ...form, price: Number(form.price), durationMinutes: Number(form.durationMinutes) };
		if (editingId) { await axios.put(`/api/clinic/services/${editingId}`, payload); }
		else { await axios.post('/api/clinic/services', payload); }
		setForm(empty); setEditingId(null); load();
	};
	const edit = (s) => { setForm({ ...s }); setEditingId(s._id); };
	const remove = async (id) => { await axios.delete(`/api/clinic/services/${id}`); load(); };

	if (loading) return <Spinner />;

	return (
		<div>
			<h3>Manage Services</h3>
			<form onSubmit={submit} className="profile-form">
				<div className="form-group"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
				<div className="form-group"><label>Price ($)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></div>
				<div className="form-group"><label>Duration (minutes)</label><input type="number" value={form.durationMinutes} onChange={e=>setForm({...form,durationMinutes:e.target.value})} required /></div>
				<div className="form-group"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
				<button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add'} Service</button>
				{editingId && <button type="button" className="btn btn-outline" onClick={()=>{setForm(empty); setEditingId(null);}}>Cancel</button>}
			</form>
			<table className="data-table" style={{marginTop:'1rem'}}>
				<thead><tr><th>Name</th><th>Price</th><th>Duration</th><th>Actions</th></tr></thead>
				<tbody>{services.map(s=>(
					<tr key={s._id}><td>{s.name}</td><td>${s.price}</td><td>{s.durationMinutes}m</td>
						<td className="table-actions">
							<button className="btn btn-secondary" onClick={()=>edit(s)}>Edit</button>
							<button className="btn btn-outline" onClick={()=>remove(s._id)}>Delete</button>
						</td>
					</tr>
				))}</tbody>
			</table>
		</div>
	);
};

export default ServicesManager;