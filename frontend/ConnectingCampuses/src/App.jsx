// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AttendenceManager from "./AttendenceManager";
import MainLayout from "./MainLayout";
import SellBuyPage from "./SellBuyPage";
import NewsroomListing from "./NewsroomListing";
import ScrollToTop from "./connectingcomponents/ScrollToTop";
import LostAndFoundListing from "./LostAndFoundListing";
import CarpoolingListing from "./CarpoolingListing";
import { SignupFormDemo } from "./connectingcomponents/Signup";
import ProfileCard from "./ProfileCard";
import Navbar from "./connectingcomponents/Navbar";
import Footer from "./connectingcomponents/Footer";
import UpdateProfileForm from "./UpdateProfileForm";
import DeleteSubjectExample from "./DeleteSubjectExample";
import ClearAttendanceButton from "./clearAllattendencefromdb";
import NewsroomDashboard from "./UserNewsroomList";
import VerifyEmailPage from "./verify-email";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ImagePickerTest from "./ImagePickerTest";


const App = () => {
 return (
  <>
    <Navbar />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/test" element={<h1>Test Page</h1>} />
      <Route path="/attendance" element={<AttendenceManager />} />
      <Route path="/sellBuy" element={<SellBuyPage />} />
      <Route path="/newsroom" element={<NewsroomListing />} />
      <Route path="/lostfound" element={<LostAndFoundListing />} />
      <Route path="/carpooling" element={<CarpoolingListing />} />
      <Route path="/signup" element={<SignupFormDemo />} />
      <Route path="/profile" element={<ProfileCard />} />
      <Route path="/update-profile" element={<UpdateProfileForm />} />
      <Route path="/deleteallAttendance" element={<ClearAttendanceButton />} />
      <Route path="/mynewsroomlistings" element={<NewsroomDashboard />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* ✅ New Image Picker Testing Route */}
      <Route path="/test-image-picker" element={<ImagePickerTest />} />
    </Routes>
    <Footer />
  </>
);
};

export default App;
