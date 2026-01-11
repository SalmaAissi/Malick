import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProfiles = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/business-profile/');
    setProfiles(response.data);
  } catch (error) {
    console.log('Note: Backend non connecté. Utilisation de données fictives pour le développement.');
    // Données fictives pour développement
    setProfiles([
      { 
        id: 1, 
        company_name: "Exemple Entreprise", 
        sector: "Technologie",
        description: "Une entreprise exemple pour le développement"
      }
    ]);
  }
};

    useEffect(() => { fetchProfiles(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce profil ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/business-profile/${id}`);
                fetchProfiles();
            } catch (err) {
                console.error('Erreur:', err);
                alert('Échec de la suppression.');
            }
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className='error'>{error}</div>;

    return (
        <div className='business-profile-list'>
            <h2>Liste des Profils</h2>
            {profiles.length === 0 ? (
                <p>Aucun profil.</p>
            ) : (
                <ul>
                    {profiles.map((profile) => (
                        <li key={profile.id}>
                            <strong>{profile.business_name}</strong> ({profile.industry})
                            <p>{profile.location} • {profile.employees_count} employés</p>
                            <button onClick={() => handleDelete(profile.id)}>Supprimer</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={fetchProfiles}>Actualiser</button>
        </div>
    );
};

export default BusinessProfileList;
