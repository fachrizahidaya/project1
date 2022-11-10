import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { RegisterPage } from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import { FrontPage } from "./pages/FrontPage";
import { LoginPage } from "./pages/LoginPage";
import { VerificationPage } from "./pages/VerificationPage";
import NavbarComp from "./components/NavbarComp";
import LargeWithAppLinksAndSocial  from "./components/FooterComp";
import { login } from "./redux/userSlice";

import "./index.css";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const keepLogin = async () => {
    try {
      const result = await Axios.get(`http://localhost:2000/users/keeplogin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(result.data);
      dispatch(login(result.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    keepLogin();
  }, []);

  return (
    <div>
      <NavbarComp />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<FrontPage />} />
        <Route path="/verification/:token" element={<VerificationPage />} />
      </Routes>
      <LargeWithAppLinksAndSocial/>
    </div>
  );
}

export default App;
