import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar, FaMoneyBillWave } from 'react-icons/fa';
import Spinner from '../components/common/Spinner';
import '../css/ClinicList.css';
import '../css/Button.css';
import '../css/Forms.css';

const ClinicCard = ({ clinic }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div variants={cardVariants}>
            <Link to={`/clinic/${clinic._id}`} className="clinic-card">
                <img src={clinic.photo || 'https://placehold.co/600x400/A8D5BA/FFFFFF?text=Clinic'} alt={clinic.name} className="clinic-card-img" />
                <div className="clinic-card-content">
                    <h3>{clinic.name}</h3>
                    <div className="clinic-info"><FaMapMarkerAlt /> <span>{clinic.address?.city || 'N/A'}</span></div>
                    <div className="clinic-rating"><div className="stars"><FaStar /> {clinic.avgRating}</div><span>({clinic.reviewCount} reviews)</span></div>
                    <div className="clinic-info"><FaMoneyBillWave /> <span>Starts at ${clinic.charges}</span></div>
                    <div className="clinic-card-footer">
                        <button className="btn btn-primary btn-full-width">View Details</button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const ClinicsListPage = () => {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const res = await axios.get(`/api/clinics?search=${searchTerm}`);
                setClinics(res.data);
            } catch (error) { console.error("Failed to fetch clinics", error); }
            finally { setLoading(false); }
        };
        const debounceFetch = setTimeout(() => { fetchClinics(); }, 300);
        return () => clearTimeout(debounceFetch);
    }, [searchTerm]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1 // This creates the cascading effect
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <motion.div 
            className="page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="page-header">
                <h1>Find a Clinic</h1>
                <p>Search for top-rated clinics and doctors near you.</p>
            </div>
            <div className="clinics-main">
                <div className="search-bar">
                    <input type="text" placeholder="Search by clinic name, city, or specialization..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button className="btn btn-primary">Search</button>
                </div>
                {clinics.length > 0 ? (
                    <motion.div 
                        className="clinics-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {clinics.map(clinic => <ClinicCard key={clinic._id} clinic={clinic} />)}
                    </motion.div>
                ) : (
                    <p>No clinics found. Try adjusting your search.</p>
                )}
            </div>
        </motion.div>
    );
};

export default ClinicsListPage;
