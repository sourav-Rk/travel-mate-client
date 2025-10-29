import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UnauthorizedPage from "./components/UnAuthorizedPage";
import ClientRouter from "./routes/ClientRouter";
import AdminRouter from "./routes/AdminRouter";
import VendorRouter from "./routes/VendorRouter";
import NotFoundPage from "./components/NotFound";
import GuideRouter from "./routes/GuideRouter";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";


function AppContent() {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/*" element={<ClientRouter />} />
          <Route path="/admin/*" element={<AdminRouter />} />
          <Route path="/vendor/*" element={<VendorRouter />} />
          <Route path="/guide/*" element={<GuideRouter />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </SocketProvider>
  );
}

export default App;
