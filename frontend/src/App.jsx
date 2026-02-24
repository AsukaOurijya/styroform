import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom"

import Main from "./pages/Main/MainPage";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import FormList from "./pages/FormList/FormListPage";
import CreateForm from "./pages/CreateForm/CreateFormPage";
import FormDetails from "./pages/FormDetails/FormDetailsPage";

export default function App() {
  return (
    <BrowserRouter>

      <nav style = {{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Main</Link>
        <Link to="/Login">Login</Link>
        <Link to="/Register">Register</Link>
        <Link to="/FormList">Form List</Link>
        <Link to="/CreateForm">Create Form</Link>
        <Link to="/FormDetails">Form Details</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/FormList" element={<FormList />} />
        <Route path="/CreateForm" element={<CreateForm />} />
        <Route path="/FormDetails" element={<FormDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  
    </BrowserRouter>
  );
}