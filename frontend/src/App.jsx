import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Navbar from "./components/navbar/Navbar";
import Hero from "./pages/Hero/HeroPage";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import FormList from "./pages/FormList/FormListPage";
import CreateForm from "./pages/CreateForm/CreateFormPage";
import FormDetails from "./pages/FormDetails/FormDetailsPage";
import Forgot from "./pages/ForgotPassword/ForgotPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/FormList" element={<FormList />} />
        <Route path="/CreateForm" element={<CreateForm />} />
        <Route path="/FormDetails" element={<FormDetails />} />
        <Route path="/Forgot" element={<Forgot />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  
    </BrowserRouter>
  );
}
