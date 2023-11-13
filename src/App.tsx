import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import "./App.css"
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/utils/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import Home from './pages/Home'
import UserTableView from './pages/Tables/UserTableView';
import MainLayout from './components/Layouts/MainLayout';
import AccountTableView from './pages/Tables/AccountTableView';
import TransactionTableView from './pages/Tables/TransactionTableView';
import InstrumentTableView from './pages/Tables/InstrumentTableView';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <MainLayout>
            <Routes>
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/home" element={<PrivateRoute element={<Home />} />} />
              <Route path="/users" element={<PrivateRoute element={<UserTableView />} />} />
              <Route path="/user/:id" element={<PrivateRoute element={<UserDashboard />} />} />
              <Route path="/accounts" element={<PrivateRoute element={<AccountTableView />} />} />
              <Route path="/transactions" element={<PrivateRoute element={<TransactionTableView />} />} />
              <Route path="/instruments" element={<PrivateRoute element={<InstrumentTableView />} />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
