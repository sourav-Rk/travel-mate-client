// import { Toaster } from "react-hot-toast";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
// } from "react-router-dom";
// import UnauthorizedPage from "./components/UnAuthorizedPage";
// import ClientRouter from "./routes/ClientRouter";
// import AdminRouter from "./routes/AdminRouter";
// import VendorRouter from "./routes/VendorRouter";
// import NotFoundPage from "./components/NotFound";
// import GuideRouter from "./routes/GuideRouter";
// import { useSocketConnection } from "./hooks/socket/useSocketConnection";

// function App() {
//   const {isSocketConnected} =  useSocketConnection();

//   return (
//     <div>
//       <Toaster />
//        {/* Optional: Show connection status for debugging */}
//       {import.meta.env.VITE_NODE_ENV === 'development' && (
//         <div style={{
//           position: 'fixed',
//           top: 10,
//           left: 1000,
//           padding: '5px 10px',
//           background: isSocketConnected ? 'green' : 'red',
//           color: 'white',
//           borderRadius: '5px',
//           fontSize: '12px',
//           zIndex: 9999
//         }}>
//           Socket: {isSocketConnected ? 'Connected' : 'Disconnected'}
//         </div>
//       )}
//       <Router>
//         <Routes>
//           <Route path="/*" element={<ClientRouter />} />
//           <Route path="/admin/*" element={<AdminRouter />} />
//           <Route path="/vendor/*" element={<VendorRouter />} />
//           <Route path="/guide/*" element={<GuideRouter />} />
//           <Route path="*" element={<NotFoundPage />} />
//           <Route path="/unauthorized" element={<UnauthorizedPage />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;


import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import UnauthorizedPage from "./components/UnAuthorizedPage";
import ClientRouter from "./routes/ClientRouter";
import AdminRouter from "./routes/AdminRouter";
import VendorRouter from "./routes/VendorRouter";
import NotFoundPage from "./components/NotFound";
import GuideRouter from "./routes/GuideRouter";
import { SocketProvider, useSocket } from "./context/SocketContext";

// Debug component that uses the socket context
function SocketDebugIndicator() {
  const { isConnected } = useSocket(); // ✅ Now this is INSIDE the provider
  
  if (import.meta.env.VITE_NODE_ENV !== 'development') return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 1000,
      padding: '5px 10px',
      background: isConnected ? 'green' : 'red',
      color: 'white',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Socket: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}

// Main app content
function AppContent() {
  return (
    <div>
      <Toaster />
      <SocketDebugIndicator />
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

// Main App component
function App() {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
}

export default App;