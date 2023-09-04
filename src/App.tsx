import { useState } from "react";
import "./App.css";
import Blackjack from "./assets/components/Blackjack";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Blackjack />
    </div>
  );
}

export default App;
