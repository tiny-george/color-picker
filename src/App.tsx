import type { FunctionComponent } from "preact";
import { useCallback, useEffect, useRef, useState} from "preact/hooks";
import { HexColorInput, HexColorPicker } from "react-colorful";

import "./App.css";

const ACTION_INIT = "init";
const ACTION_REQUEST_HEIGHT = "changeHeight";
const ACTION_SET_VALUE = "changeValue";

const sendComponentChange = (id: number, newValue: any) => {
  window.parent.postMessage({
    correlationId: id,
    action: ACTION_SET_VALUE,
    value: newValue
  }, "*");
}

const sendChangeHeight = (id: number, newValue: any) => {
  window.parent.postMessage({
    correlationId: id,
    action: ACTION_REQUEST_HEIGHT,
    value: newValue
  }, "*");
}

const dispatchEventUpsteam = (action: {
  payload: Record<string, unknown>;
  id: number;
  type: string;
}) => {
  if (window.parent === window) {
    return;
  }

  if (action.type === ACTION_SET_VALUE) {
    sendComponentChange(action.id, action.payload.value);
  }
  if (action.type === ACTION_REQUEST_HEIGHT) {
    console.log("Set height: " + action.payload.value);
    sendChangeHeight(action.id, action.payload.value);
  }
  //window.parent.postMessage(action, "*");
};

const App: FunctionComponent = () => {
  const thisRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<string>();
  const [correlationId, setCorrelationId] = useState<number>();

  const handleMessageEvent = useCallback((e: MessageEvent) => {
    //console.log("In color-picker...");
    //console.log(e.data);
    if (e.data.action === ACTION_INIT) {
      const id = e.data.correlationId;
      if (id !== correlationId) {
        setCorrelationId(e.data.correlationId);
        setColor(e.data.state.value || e.data.state.defaultValue);
      }
    }
    if (e.data.action === 'error') {
      //TODO on error
      console.error(e.data);
    }
    if (e.data.action === 'change') {
      setColor(e.data.state.value || e.data.state.defaultValue);
    }
    if (e.data.action === 'restResponse') {
      //TODO ignore
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
      id: correlationId || 0,
      type: ACTION_INIT,
    });

    setIsInitialized(true);
  }, [thisRef.current]);

  useEffect(() => {
    if (!thisRef.current) {
      return;
    }

    dispatchEventUpsteam({
      payload: { value: thisRef.current.offsetHeight },
      id: correlationId || 0,
      type: ACTION_REQUEST_HEIGHT,
    });
  }, [isOpen, thisRef.current]);

  useEffect(() => {
    dispatchEventUpsteam({
      payload: { value: color },
      id: correlationId || 0,
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
