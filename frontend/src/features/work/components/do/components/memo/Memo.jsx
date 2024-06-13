import React, { useState } from "react";
import "./memo.css";
import { useInteract } from "../../../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";
// Import the Slate editor factory.
import { Editor, createEditor, Text } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const Memo = ({ myKey, removeThisTool }) => {
  const interact_ = useInteract();

  const [editor] = useState(() => withReact(createEditor()));

  const initialElement = [
    {
      type: "paragraph",
      children: [{ text: "sample text" }],
    },
  ];

  //インライン要素(フォント等)をレンダリングする関数。
  //ブロック要素(liやh1等)とは区別してレンダリングされる。
  const renderLeaf = ({ children, leaf, attributes }) => {
    console.log(leaf);
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
  const applyFont = (font) => {
    const isNeedApply = !isActiveThisMark(font);
    console.log(isNeedApply);
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
          onClick={() => applyFont("bold")}
        >
          B
        </strong>
        <em
          className="memo-menu__tool-item"
          onClick={() => applyFont("italic")}
        >
          I
        </em>
        <u
          className="memo-menu__tool-item"
          onClick={() => applyFont("underline")}
        >
          U
        </u>
      </FlexBox>
      <Slate editor={editor} initialValue={initialElement}>
        <Editable className="memo__editor" renderLeaf={renderLeaf}></Editable>
      </Slate>
    </FlexBox>
  );
};

export default Memo;
