import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import GenerateImage from "./pages/GenerateImage";
import Rewrite from "./pages/Rewrite";
import ImageHistory from "./pages/ImageHistory";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
      <Routes>
        <Route path="/" element={<div>home</div>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<SignUp />}></Route>
        <Route path="/image/generate" element={<GenerateImage />}></Route>
        <Route path="/content/rewrite" element={<Rewrite />}></Route>
        <Route path="/image/history" element={<ImageHistory />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
