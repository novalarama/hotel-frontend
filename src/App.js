import {BrowserRouter, Routes, Route} from "react-router-dom"
import DashboardHotel from "./pages/DashboardHotel";
import DashhboardOfficer from "./pages/DashboardOfficer";
import Room from "./pages/RoomData";
import RoomType from "./pages/RoomTypeData";
import Booking from "./pages/BookingData";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardHotel />}></Route>
        <Route path="/management" element={<DashhboardOfficer />}></Route>
        <Route path="/management/room" element={<Room />}></Route>
        <Route path="/management/room-type" element={<RoomType />}></Route>
        <Route path="/management/booking" element={<Booking />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
