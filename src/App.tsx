import type { FunctionComponent } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { HexColorInput, HexColorPicker } from "react-colorful";

import "./App.css";

const ACTION_INIT = "warp.extensions.init";
const ACTION_REQUEST_HEIGHT = "warp.extensions.request_height";
const ACTION_SET_VALUE = "warp.extensions.set_value";

const dispatchEventUpsteam = (action: {
  payload: Record<string, unknown>;
  type: string;
}) => {
  if (window.parent === window) {
    return;
  }

  window.parent.postMessage(action, "*");
};

const App: FunctionComponent = () => {
  const thisRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitizalized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<string>();

  const handleMessageEvent = useCallback((e: MessageEvent) => {
    if (e.data.type === ACTION_SET_VALUE) {
      setColor(e.data.payload.value);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessageEvent);

    return () => {
      window.removeEventListener("message", handleMessageEvent);
    };
  }, []);

  useEffect(() => {
    if (!thisRef.current) {
      return;
    }

    if (isInitialized) {
      return;
    }

    dispatchEventUpsteam({
      payload: { idleHeight: thisRef.current.offsetHeight },
      type: ACTION_INIT,
    });

    setIsInitizalized(true);
  }, [thisRef.current]);

  useEffect(() => {
    if (!thisRef.current) {
      return;
    }

    dispatchEventUpsteam({
      payload: { value: thisRef.current.offsetHeight },
      type: ACTION_REQUEST_HEIGHT,
    });
  }, [isOpen, thisRef.current]);

  useEffect(() => {
    dispatchEventUpsteam({
      payload: { value: color },
      type: ACTION_SET_VALUE,
    });
  }, [color]);

  return (
    <div class="color-picker__root" ref={thisRef}>
      <button
        class="color-picker__trigger"
        style={{ "--color": color }}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {color || "-"}
      </button>
      {isOpen ? (
        <div class="color-picker__pane">
          <button
            class="color-picker__pane__actions"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            Close
          </button>
          <HexColorPicker color={color} onChange={setColor} />
          <HexColorInput color={color} onChange={setColor} prefixed />
        </div>
      ) : null}
    </div>
  );
};

export default App;
