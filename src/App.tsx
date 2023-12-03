import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import "./App.css"
import Dashboard from './Pages/Dashboard';
import PrivateRoute from './common/utils/PrivateRoute';
import UserDashboard from './Pages/UserDashboard';
import Home from './Pages/Home'
import UserTableView from './Pages/TablePages/UserTableView';
import MainLayout from '../src/common/utils/MainLayout';
import AccountTableView from './Pages/TablePages/AccountTableView';
import TransactionTableView from './Pages/TablePages/TransactionTableView';
import InstrumentTableView from './Pages/TablePages/InstrumentTableView';
import OrderTableView from './Pages/TablePages/OrderTableView';

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
              <Route path="/orders" element={<PrivateRoute element={<OrderTableView />} />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
