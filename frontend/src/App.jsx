import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
        <Route
          path="/FormList"
          element={
            <ProtectedRoute>
              <FormList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CreateForm"
          element={
            <ProtectedRoute>
              <CreateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditForm"
          element={
            <ProtectedRoute>
              <EditForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/FormDetails"
          element={
            <ProtectedRoute>
              <FormDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/Forgot" element={<Forgot />} />
        <Route
          path="/AccountPreview"
          element={
            <ProtectedRoute>
              <AccountPreview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditAccount"
          element={
            <ProtectedRoute>
              <EditAccount />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  
    </BrowserRouter>
  );
}
