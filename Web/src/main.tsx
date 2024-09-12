import { render } from "preact";
import "./index.css";

function App() {
  return (
    <div>
      <h1>API test</h1>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
