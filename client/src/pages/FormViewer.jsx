import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FORMS_URL } from '../utils/url_container';

const FormViewer = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${FORMS_URL}/${formId}`)
      .then(res => setForm(res.data))
      .catch(() => setError('Form not found.'))
      .finally(() => setLoading(false));
  }, [formId]);

  const handleChange = (label, value) => {
    setAnswers(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${FORMS_URL}/submit/${formId}`, {
        form_id: formId,
        data: answers,
      });
      setSubmitted(true);
    } catch (err) {
      setError('Submission failed. Please try again.');
    }
  };

  if (loading) return <div className="viewer-container"><p className="status-text">Loading form...</p></div>;
  if (error) return <div className="viewer-container"><p className="error-msg">{error}</p></div>;
  if (submitted) return (
    <div className="viewer-container">
      <div className="login-container">
        <h1>Thank you!</h1>
        <p>Your response has been submitted.</p>
      </div>
    </div>
  );

  return (
    <div className="viewer-container">
      <div className="viewer-card">
        <h1>{form.title}</h1>
        {form.description && <p className="form-card-desc">{form.description}</p>}
        <form onSubmit={handleSubmit}>
          {form.fields.map((field, index) => (
            <div className="input-group" key={index}>
              <label>
                {field.label}
                {field.required && <span className="required-star"> *</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  placeholder={field.placeholder}
                  value={answers[field.label] || ''}
                  onChange={e => handleChange(field.label, e.target.value)}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={answers[field.label] || ''}
                  onChange={e => handleChange(field.label, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {field.values?.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              ) : field.type === 'radio' ? (
                <div className="options-group">
                  {field.values?.map(v => (
                    <label key={v} className="checkbox-label">
                      <input
                        type="radio"
                        name={field.label}
                        value={v}
                        required={field.required}
                        checked={answers[field.label] === v}
                        onChange={() => handleChange(field.label, v)}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              ) : field.type === 'checkbox' ? (
                <div className="options-group">
                  {field.values?.map(v => (
                    <label key={v} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={v}
                        checked={(answers[field.label] || []).includes(v)}
                        onChange={e => {
                          const prev = answers[field.label] || [];
                          handleChange(field.label, e.target.checked
                            ? [...prev, v]
                            : prev.filter(x => x !== v));
                        }}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={answers[field.label] || ''}
                  onChange={e => handleChange(field.label, e.target.value)}
                />
              )}
            </div>
          ))}

          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default FormViewer;
