import { Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import RouteProtector from './components/authentication/RouteProtector';
import './App.css'

function App() {
  return (
    <div className="App" >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<RouteProtector />}>
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
