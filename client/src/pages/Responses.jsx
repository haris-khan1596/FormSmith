import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const Responses = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/forms/responses/${formId}`)
      .then(res => setResponses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load responses.'))
      .finally(() => setLoading(false));
  }, [formId]);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Responses</h1>
          <Link to="/" className="btn-secondary">← Back</Link>
        </div>

        {loading && <p className="status-text">Loading...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && responses.length === 0 && (
          <div className="empty-state">
            <p>No responses yet.</p>
          </div>
        )}

        {responses.map((resp, index) => (
          <div className="response-card" key={resp._id || index}>
            <h3 className="response-title">Response #{index + 1}</h3>
            <table className="response-table">
              <tbody>
                {Object.entries(resp.data || {}).map(([key, val]) => (
                  <tr key={key}>
                    <td className="response-key">{key}</td>
                    <td className="response-val">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Responses;
