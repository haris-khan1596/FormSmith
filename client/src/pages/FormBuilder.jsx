import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';

const FIELD_TYPES = ['text', 'number', 'email', 'textarea', 'select', 'checkbox', 'radio'];

const emptyField = () => ({
  type: 'text',
  label: '',
  required: false,
  placeholder: '',
  values: [],
});

const FormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(formId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([emptyField()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/forms/update/${formId}`)
      .then(res => {
        const form = res.data;
        setTitle(form.title);
        setDescription(form.description || '');
        setFields(form.fields.length ? form.fields : [emptyField()]);
      })
      .catch(() => setError('Failed to load form.'));
  }, [formId]);

  const updateField = (index, key, value) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, [key]: value } : f));
  };

  const addField = () => setFields(prev => [...prev, emptyField()]);

  const removeField = (index) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const moveField = (index, dir) => {
    setFields(prev => {
      const next = [...prev];
      const swap = index + dir;
      if (swap < 0 || swap >= next.length) return next;
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });
  };

  const addOption = (fieldIndex) => {
    const values = [...(fields[fieldIndex].values || []), ''];
    updateField(fieldIndex, 'values', values);
  };

  const updateOption = (fieldIndex, optIndex, value) => {
    const values = fields[fieldIndex].values.map((v, i) => i === optIndex ? value : v);
    updateField(fieldIndex, 'values', values);
  };

  const removeOption = (fieldIndex, optIndex) => {
    const values = fields[fieldIndex].values.filter((_, i) => i !== optIndex);
    updateField(fieldIndex, 'values', values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { title, description, fields };
    try {
      if (isEdit) {
        await api.put(`/forms/update/${formId}`, payload);
      } else {
        await api.post('/forms/create', payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const needsValues = (type) => ['select', 'radio', 'checkbox'].includes(type);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="builder-container">
        <h1>{isEdit ? 'Edit Form' : 'New Form'}</h1>
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="builder-meta">
            <div className="input-group">
              <label>Form Title:</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="My awesome form"
                required
              />
            </div>
            <div className="input-group">
              <label>Description (optional):</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is this form for?"
              />
            </div>
          </div>

          <div className="fields-section">
            <h2>Fields</h2>
            {fields.map((field, index) => (
              <div className="field-card" key={index}>
                <div className="field-card-header">
                  <span className="field-number">Field {index + 1}</span>
                  <div className="field-card-controls">
                    <button type="button" className="btn-icon" onClick={() => moveField(index, -1)} disabled={index === 0}>↑</button>
                    <button type="button" className="btn-icon" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}>↓</button>
                    <button type="button" className="btn-icon btn-icon-danger" onClick={() => removeField(index)} disabled={fields.length === 1}>✕</button>
                  </div>
                </div>

                <div className="field-row">
                  <div className="input-group">
                    <label>Label:</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={e => updateField(index, 'label', e.target.value)}
                      placeholder="Field label"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Type:</label>
                    <select
                      value={field.type}
                      onChange={e => updateField(index, 'type', e.target.value)}
                    >
                      {FIELD_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {!needsValues(field.type) && (
                  <div className="input-group">
                    <label>Placeholder:</label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={e => updateField(index, 'placeholder', e.target.value)}
                      placeholder="Placeholder text"
                    />
                  </div>
                )}

                {needsValues(field.type) && (
                  <div className="input-group">
                    <label>Options:</label>
                    {(field.values || []).map((opt, optIndex) => (
                      <div className="option-row" key={optIndex}>
                        <input
                          type="text"
                          value={opt}
                          onChange={e => updateOption(index, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                        />
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => removeOption(index, optIndex)}
                        >✕</button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-add-option"
                      onClick={() => addOption(index)}
                    >+ Add Option</button>
                  </div>
                )}

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={e => updateField(index, 'required', e.target.checked)}
                  />
                  Required
                </label>
              </div>
            ))}

            <button type="button" className="btn-add-field" onClick={addField}>
              + Add Field
            </button>
          </div>

          <div className="builder-footer">
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormBuilder;
