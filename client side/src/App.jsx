import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./components/signin";
import Signup from "./components/signup";
import Profile from "./components/profile";
import User from "./context/user";
function App() {
  return (
    <div>
      <User>
        <BrowserRouter>
          <Routes>
            <Route exact path="/signin" element={<Signin />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to={"/signin"} />} />
          </Routes>
        </BrowserRouter>
      </User>
    </div>
  );
}

export default App;
