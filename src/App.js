import { Route, Routes } from "react-router";
import "./App.css";
import Survey from "./components/Survey";
import Welcome from "./components/Welcome";
import QuestionForm from "./components/QuestionForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Welcome />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/add" element={<QuestionForm />} />
      </Routes>
    </div>
  );
}

export default App;
