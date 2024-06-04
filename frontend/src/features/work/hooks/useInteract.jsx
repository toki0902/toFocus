import interact from "interactjs";
import { useEffect, useRef } from "react";

//要素をドラッグアンドドロップ可能にし、リサイズもできるようにするhooks
//interact.ref を refに設定すると有効になる。
//<Do />に使うツール内で設定する。

export function useInteract() {
  const interactRef = useRef(null);

  const enable = () => {
    interact(interactRef.current)
      .resizable({
        edges: { top: true, left: true, bottom: true, right: true },
        inertia: false,
        listeners: {
          move: function (event) {
            let { x, y } = event.target.dataset;

            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });
          },
        },
      })
      .draggable({
        listeners: {
          move(event) {
            let { x, y } = event.target.dataset;

            x = (parseFloat(x) || 0) + event.dx;
            y = (parseFloat(y) || 0) + event.dy;

            Object.assign(event.target.style, {
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });
          },
        },
      });
  };

  const disable = () => {
    if (interactRef.current) {
      interact(interactRef.current).unset();
    }
  };

  useEffect(() => {
    enable();
    return () => {
      disable();
    };
  }, []);

  return {
    ref: interactRef,
    enable: enable,
    disable: disable,
  };
}
