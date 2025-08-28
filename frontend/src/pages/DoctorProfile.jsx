import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/common/Spinner';

const DoctorProfile = () => {
	const { doctorId } = useParams();
	const [doc, setDoc] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const load = async () => {
			try { const res = await axios.get(`/api/doctors/${doctorId}`); setDoc(res.data); }
			finally { setLoading(false); }
		};
		load();
	}, [doctorId]);
	if (loading) return <Spinner />;
	if (!doc) return <p>Doctor not found</p>;
	return (
		<div className="page-container">
			<div className="page-header"><h1>{doc.name}</h1><p>{doc.specialization}</p></div>
			{doc.photo && <img alt={doc.name} src={doc.photo} style={{maxWidth:300,borderRadius:8}} />}
			<p style={{marginTop:'1rem'}}>{doc.bio}</p>
			{doc.availability && <div style={{marginTop:'1rem'}}><h3>Availability</h3><ul>{Object.entries(doc.availability).map(([d,t])=><li key={d}>{d}: {(t||[]).join(', ')}</li>)}</ul></div>}
		</div>
	);
};
export default DoctorProfile;