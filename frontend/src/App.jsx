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
import EditForm from "./pages/EditForm/EditFormPage";
import FormDetails from "./pages/FormDetails/FormDetailsPage";
import Forgot from "./pages/ForgotPassword/ForgotPage";
import AccountPreview from "./pages/AccountPreview/AccountPreviewPage";
import EditAccount from "./pages/EditAccount/EditAccountPage";

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
        <Route path="/EditForm" element={<EditForm />} />
        <Route path="/FormDetails" element={<FormDetails />} />
        <Route path="/Forgot" element={<Forgot />} />
        <Route path="/AccountPreview" element={<AccountPreview />} />
        <Route path="/EditAccount" element={<EditAccount />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  
    </BrowserRouter>
  );
}
