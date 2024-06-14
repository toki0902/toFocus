import React, { useState } from "react";
import "./memo.css";
import { useInteract } from "../../../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";
import lockIcon from "@images/lock.svg";
import unlockIcon from "@images/unlock.svg";
// Import the Slate editor factory.
import { Editor, createEditor, Text, Element, Transforms } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const Memo = ({ myKey, removeThisTool }) => {
  const interact_ = useInteract();

  //要素を動かせるかどうかを管理するStateと、

  //要素可動を切り替える関数
  const [isInteract, setIsInteract] = useState(true);

  const toggleInteract = () => {
    if (isInteract) {
      interact_.disable();
      setIsInteract(false);
    } else {
      interact_.enable();
      setIsInteract(true);
    }
  };

  const [editor] = useState(() => withReact(createEditor()));

  const { selection } = editor;

  const initialElement = [
    {
      type: "paragraph",
      children: [{ text: "sample text" }],
    },
  ];

  //インライン要素(フォント等)をレンダリングする関数。
  //ブロック要素(liやh1等)とは区別してレンダリングされる。
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

    return <span {...attributes}>{children}</span>;
  };

  //特定のインライン要素を適応させる関数
  //textノードは{text:"value", bold:true, italic:true}のように定義される。
  const applyFont = (event, font) => {
    event.preventDefault();
    const isNeedApply = !isActiveThisMark(font);
    if (isNeedApply) {
      Editor.addMark(editor, font, true);
    } else {
      Editor.removeMark(editor, font, true);
    }
  };

  //特定のインライン要素が適応してるかどうかを判別する関数。
  //現在選択している箇所が、複数のテキストノードをまたぐ場合、
  //すべてのテキストノードが適応している場合trueを返す
  //ex) children[{text:"value1", bold:true}, {text:"value2", bold:true, italic:true}]
  //↑の場合isActiveThisMark("bold")はtrueを返しisActiveThisMark("italic")はfalseを返す
  const isActiveThisMark = (mark) => {
    const selectedNodes = Editor.nodes(editor, {
      match: (n) => Text.isText(n),
    });
    return selectedNodes.every((item) => {
      //markは文字列なので、obj内のmark keyを持つプロパティには[]でアクセスする。
      return item[0][mark];
    });
  };

  const renderElement = ({ children, attributes, element }) => {
    switch (element.type) {
      case "paragraph": {
        return <p {...attributes}>{children}</p>;
      }
      case "h1": {
        return (
          <h1 style={{ fontSize: 28 }} {...attributes}>
            {children}
          </h1>
        );
      }
      case "h2": {
        return (
          <h2 style={{ fontSize: 24 }} {...attributes}>
            {children}
          </h2>
        );
      }
      case "list": {
        return (
          <li style={{ listStyleType: "disc" }} {...attributes}>
            {children}
          </li>
        );
      }
    }
  };

  const applyElement = (element) => {
    const isNeedApply = !isActiveThisElement(element);
    if (isNeedApply) {
      Transforms.setNodes(
        editor,
        { type: element },
        { match: (n) => Element.isElement(n) }
      );
    } else {
      Transforms.setNodes(
        editor,
        { type: "paragraph" },
        { match: (n) => Element.isElement(n) }
      );
    }
  };

  const isActiveThisElement = (element) => {
    const selectedNodes = Editor.nodes(editor, {
      match: (n) => Element.isElement(n),
    });

    return selectedNodes.every((item) => {
      return item[0].type === element;
    });
  };

  const element_arr = ["h1", "h2", "list", "paragraph"];
  const leaf_arr = ["bold", "italic", "underline"];
  //現在の選択範囲に何の要素が適応しているかを配列で管理するState
  //使用用途はtoolのスタイル適応
  const [currentState, setCurrentState] = useState(["paragraph"]);
  console.log(currentState);

  //現在の選択範囲の要素を更新する用の関数
  //fix : いつ実行したらよいかが定まっていない。
  //ボタン押したときの更新が遅れている
  //フォントの境目の時の更新が遅れている
  const checkSelection = () => {
    const newState = [];
    element_arr.forEach((element) => {
      const isNeedPush = isActiveThisElement(element);
      if (isNeedPush) {
        newState.push(element);
      }
    });
    leaf_arr.forEach((leaf) => {
      const isNeedPush = isActiveThisMark(leaf);
      if (isNeedPush) {
        newState.push(leaf);
      }
    });
    setCurrentState(newState);
  };

  return (
    <FlexBox
      className="Memo"
      width="200px"
      height="200px"
      pb="10px"
      pl="10px"
      pr="10px"
      pt="10px"
      top
      ref={interact_.ref}
    >
      <img
        onClick={() => {
          removeThisTool(myKey);
        }}
        className="memo__remove-icon"
        src={removeIcon}
        alt="remove"
      />
      <FlexBox className="memo__menu" width="100%" height="18%">
        <strong
          className="memo-menu__tool-item"
          onClick={(event) => applyFont(event, "bold")}
          style={currentState.includes("bold") ? { opacity: 1 } : null}
        >
          B
        </strong>
        <em
          className="memo-menu__tool-item"
          onClick={(event) => applyFont(event, "italic")}
          style={currentState.includes("italic") ? { opacity: 1 } : null}
        >
          I
        </em>
        <u
          className="memo-menu__tool-item"
          onClick={(event) => applyFont(event, "underline")}
          style={currentState.includes("underline") ? { opacity: 1 } : null}
        >
          U
        </u>
        <div
          className="memo-menu__tool-item"
          onClick={toggleInteract}
          style={isInteract ? null : { opacity: 1 }}
        >
          <img
            src={isInteract ? unlockIcon : lockIcon}
            alt={isInteract ? "unlock" : "lock"}
          />
        </div>
        <div
          className="memo-menu__tool-item"
          onClick={() => applyElement("h1")}
          style={currentState.includes("h1") ? { opacity: 1 } : null}
        >
          h1
        </div>
        <div
          className="memo-menu__tool-item"
          onClick={() => applyElement("h2")}
          style={currentState.includes("h2") ? { opacity: 1 } : null}
        >
          h2
        </div>
        <div
          className="memo-menu__tool-item"
          onClick={() => applyElement("list")}
          style={currentState.includes("list") ? { opacity: 1 } : null}
        >
          li
        </div>
        <div className="memo-menu__tool-item" onClick={checkSelection}>
          c
        </div>
      </FlexBox>
      <Slate editor={editor} initialValue={initialElement}>
        <Editable
          className="memo__editor"
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={checkSelection}
          onMouseDown={checkSelection}
          onMouseUp={checkSelection}
        ></Editable>
      </Slate>
    </FlexBox>
  );
};

export default Memo;
