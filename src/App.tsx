import { useEffect, useRef, useState } from "preact/hooks";
import { HexColorInput, HexColorPicker } from "react-colorful";
import "./App.css";
import type { FunctionComponent } from "preact";

const App: FunctionComponent = () => {
  const thisRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (!thisRef.current) {
      return;
    }

    window.parent.postMessage(
      {
        type: "requestSize",
        size: thisRef.current.offsetHeight,
      },
      "*"
    );
  }, []);

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "setValue",
        value: color,
      },
      "*"
    );
  }, [color]);

  return (
    <div class="app-root" ref={thisRef}>
      <div class="custom-layout">
        <HexColorInput color={color} onChange={setColor} prefixed />
        <HexColorPicker color={color} onChange={setColor} />
      </div>
    </div>
  );
};

export default App;
