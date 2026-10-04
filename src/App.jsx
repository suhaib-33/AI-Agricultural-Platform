import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateBatch from "./pages/CreateBatch";
import Analyze from "./pages/Analyze";
import BatchResult from "./pages/BatchResult";
import Verify from "./pages/Verify";
import SavedBatches from "./pages/SavedBatches";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-batch" element={<CreateBatch />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/batch/:id" element={<BatchResult />} />
          <Route path="/saved-batches" element={<SavedBatches />} />
          <Route path="/verify/:id" element={<Verify />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>ChitralDry · A prototype for quality grading and batch traceability</p>
      </footer>
    </div>
  );
}

export default App;