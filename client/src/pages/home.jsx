import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Home = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms/all');
      setForms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load forms.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Delete this form?')) return;
    try {
      await api.delete(`/forms/delete/${formId}`);
      setForms(forms.filter(f => f._id !== formId));
    } catch (err) {
      alert('Failed to delete form.');
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Forms</h1>
          <Link to="/forms/new" className="btn-primary">+ New Form</Link>
        </div>

        {loading && <p className="status-text">Loading...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && forms.length === 0 && (
          <div className="empty-state">
            <p>No forms yet. Create your first one!</p>
            <Link to="/forms/new" className="btn-primary">+ New Form</Link>
          </div>
        )}

        <div className="forms-grid">
          {forms.map(form => (
            <div className="form-card" key={form._id}>
              <h2 className="form-card-title">{form.title}</h2>
              {form.description && <p className="form-card-desc">{form.description}</p>}
              <p className="form-card-meta">{form.fields?.length || 0} field{form.fields?.length !== 1 ? 's' : ''}</p>
              <div className="form-card-actions">
                <Link to={`/forms/edit/${form._id}`} className="btn-secondary">Edit</Link>
                <Link to={`/forms/responses/${form._id}`} className="btn-secondary">Responses</Link>
                <Link to={`/forms/view/${form._id}`} className="btn-outline" target="_blank">View</Link>
                <button className="btn-danger" onClick={() => handleDelete(form._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
