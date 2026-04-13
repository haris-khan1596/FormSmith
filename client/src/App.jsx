import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import FormBuilder from './pages/FormBuilder';
import FormViewer from './pages/FormViewer';
import Responses from './pages/Responses';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forms/view/:formId" element={<FormViewer />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/forms/new" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
          <Route path="/forms/edit/:formId" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
          <Route path="/forms/responses/:formId" element={<PrivateRoute><Responses /></PrivateRoute>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
