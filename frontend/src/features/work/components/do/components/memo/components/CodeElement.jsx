import React, { useEffect, useState, useRef } from "react";
import "../memo.css";
import { createHighlighter } from "shiki";

//FIX :: カーソルの位置が合わない
//文字を削除してもheightが戻らない
//Codeelement自体消した後にtext入力ができない。
const CodeElement = ({ children }) => {
  const [code, setCode] = useState("");
  const [highlightedCode, setHighlightedCode] = useState("");
  const [highlighter, setHighlighter] = useState(null);

  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const parentRef = useRef(null);

  useEffect(() => {
    createHighlighter({
      langs: ["javascript"],
      themes: ["solarized-light"],
    }).then((h) => setHighlighter(h));

    return () => {
      if (highlighter) {
        highlighter.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (highlighter) {
      setHighlightedCode(
        highlighter.codeToHtml(code, {
          lang: "javascript",
          theme: "solarized-light",
        })
      );
    }
  }, [code, highlighter]);

  useEffect(() => {
    if (textareaRef) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      highlightRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      parentRef.current.style.height = `${
        textareaRef.current.scrollHeight + 10
      }px`;
    }
  }, [code]);

  return (
    <div
      ref={parentRef}
      style={{ width: "100%", position: "relative", minHeight: "100px" }}
      contentEditable={false}
      className="element"
    >
      <div
        ref={highlightRef}
        className="highlighted-code"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          translate: "-50% -50%",
          width: "calc(100% - 10px)",
          minHeight: "calc(100% - 10px)",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          zIndex: 10,
        }}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
      <textarea
        value={code}
        ref={textareaRef}
        onChange={(e) => setCode(e.target.value)}
        style={{
          zIndex: 12,
          border: "none",
          position: "absolute",
          top: "50%",
          left: "50%",
          translate: "-50% -50%",
          width: "calc(100% - 10px)",
          minHeight: "calc(100% - 10px)",
          color: "#000",
          backgroundColor: "transparent",
          caretColor: "black", // カーソルを見えるようにする
          resize: "none",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;",
        }}
      />
      {children}
    </div>
  );
};

export default CodeElement;
