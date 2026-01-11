import React, { useState } from 'react';
import axios from 'axios';
import './BusinessProfileForm.css';

const BusinessProfileForm = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    sector: 'Technologie',
    description: '',
    reference_currency: 'EUR',
    fiscal_year: new Date().getFullYear(),
    annual_revenue: 0,
    headquarter_country: '',
    operating_countries: [''],
    responsible_name: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'operating_countries') {
      // Gestion spéciale pour le tableau des pays
      const newCountries = [...formData.operating_countries];
      newCountries[0] = value;
      setFormData(prev => ({ ...prev, operating_countries: newCountries }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Prépare les données pour l'API
      const dataToSend = {
        ...formData,
        fiscal_year: parseInt(formData.fiscal_year),
        annual_revenue: parseFloat(formData.annual_revenue) || null,
        description: formData.description || null,
        responsible_name: formData.responsible_name || null
      };

            const response = await axios.post(
        'http://localhost:8000/api/business-profile/',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // 1. Affiche le message DYNAMIQUE de l'API (corrige l'encodage)
      const successMessage = response.data.message || 'Profil créé avec succès !';
      setMessage({
        type: 'success',
        text: successMessage
      });

      // 2. Affiche la réponse complète dans la console pour le débogage
      console.log('✅ Réponse du backend:', response.data);

      // 3. Réinitialise le formulaire APRÈS un succès confirmé
      setFormData({
        company_name: '',
        sector: 'Technologie',
        description: '',
        reference_currency: 'EUR',
        fiscal_year: new Date().getFullYear(),
        annual_revenue: 0,
        headquarter_country: '',
        operating_countries: [''],
        responsible_name: ''
      });
      
    } catch (error) {
      console.error('Erreur détaillée:', error.response || error);
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Erreur de connexion au serveur'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-profile-form">
      <h2>Créer un Profil d'Entreprise</h2>
      
      {message && (
        <div className={`message ${message.type} visible`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Nom de l'entreprise */}
        <div className="form-group">
          <label>Nom de l'entreprise *</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
            placeholder="Nom légal de l'entreprise"
          />
        </div>
        
        {/* Secteur d'activité */}
        <div className="form-group">
          <label>Secteur d'activité *</label>
          <select
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            required
          >
            <option value="Finance">Finance</option>
            <option value="Santé">Santé</option>
            <option value="Technologie">Technologie</option>
            <option value="Industrie">Industrie</option>
            <option value="Énergie">Énergie</option>
            <option value="Commerce">Commerce</option>
            <option value="Télécommunications">Télécommunications</option>
          </select>
        </div>
        
        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Description des activités..."
          />
        </div>
        
        {/* Devise de référence */}
        <div className="form-group">
          <label>Devise de référence *</label>
          <input
            type="text"
            name="reference_currency"
            value={formData.reference_currency}
            onChange={handleChange}
            required
            pattern="[A-Z]{3}"
            placeholder="EUR, USD, GBP (3 lettres majuscules)"
          />
        </div>
        
        {/* Année fiscale */}
        <div className="form-group">
          <label>Année fiscale *</label>
          <input
            type="number"
            name="fiscal_year"
            value={formData.fiscal_year}
            onChange={handleChange}
            required
            min="2000"
            max="2100"
          />
        </div>
        
        {/* Revenu annuel */}
        <div className="form-group">
          <label>Revenu annuel (en devise de référence)</label>
          <input
            type="number"
            name="annual_revenue"
            value={formData.annual_revenue}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        
        {/* Pays du siège social */}
        <div className="form-group">
          <label>Pays du siège social *</label>
          <input
            type="text"
            name="headquarter_country"
            value={formData.headquarter_country}
            onChange={handleChange}
            required
            placeholder="Ex: France, Belgique..."
          />
        </div>
        
        {/* Pays d'opération */}
        <div className="form-group">
          <label>Pays d'opération * (au moins un)</label>
          <input
            type="text"
            name="operating_countries"
            value={formData.operating_countries[0]}
            onChange={handleChange}
            required
            placeholder="Ex: France"
          />
        </div>
        
        {/* Nom du responsable */}
        <div className="form-group">
          <label>Nom du responsable</label>
          <input
            type="text"
            name="responsible_name"
            value={formData.responsible_name}
            onChange={handleChange}
            placeholder="Nom du contact principal"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer le Profil'}
        </button>
      </form>
    </div>
  );
};

export default BusinessProfileForm;
