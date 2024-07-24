import React, { useState } from "react";
import "./trackBoard.css";
import { FlexBox } from "@component";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { Node, createEditor } from "slate";

const TrackBoard = ({ initialValue, focusData }) => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const renderLeaf = ({ children, leaf, attributes }) => {
    if (leaf.bold !== undefined) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic !== undefined) {
      children = <em>{children}</em>;
    }
    if (leaf.underline !== undefined) {
      children = <u>{children}</u>;
    }

    return (
      <span style={leaf.color ? { color: leaf.color } : null} {...attributes}>
        {children}
      </span>
    );
  };
  const renderElement = ({ children, attributes, element }) => {
    switch (element.type) {
      case "paragraph": {
        return (
          <p {...attributes} style={{ position: "relative" }}>
            {children}
          </p>
        );
      }
      case "h1": {
        return (
          <h1
            style={{ fontSize: 28, fontWeight: "bold", position: "relative" }}
            {...attributes}
          >
            {children}
          </h1>
        );
      }
      case "h2": {
        return (
          <h2
            style={{ fontSize: 22, fontWeight: "bolder", position: "relative" }}
            {...attributes}
          >
            {children}
          </h2>
        );
      }
      case "list": {
        return (
          <li
            style={{ listStyleType: "disc", position: "relative" }}
            {...attributes}
          >
            {children}
          </li>
        );
      }
    }
  };
  return (
    <FlexBox className="TrackBoard" width="45%" mt="30px">
      <h2 className="trackboard__title">{focusData.dateString}の足跡</h2>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="trackboard__editor"
          spellCheck="false"
          readOnly="true"
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={(e) => onKeyDown(e)}
        ></Editable>
      </Slate>
    </FlexBox>
  );
};

export default TrackBoard;
