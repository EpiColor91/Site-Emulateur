import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "@/pages/HomePage";
import LibraryPage from "@/pages/LibraryPage";
import GameDetailPage from "@/pages/GameDetailPage";
import EmulatorPage from "@/pages/EmulatorPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library/:platform" element={<LibraryPage />} />
          <Route path="/game/:gameId" element={<GameDetailPage />} />
          <Route path="/play/:gameId" element={<EmulatorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;