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

export default function App() {
  return (
    <BrowserRouter>

      <nav style = {{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Main</Link>
        <Link to="/Login">Login</Link>
        <Link to="/Register">Register</Link>
        <Link to="/FormList">Form List</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/FormList" element={<FormList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  
    </BrowserRouter>
  );
}