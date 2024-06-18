import React, { useMemo, useState } from "react";
import "./memo.css";
import { useInteract } from "../../../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";
// Import the Slate editor factory.
import { Editor, createEditor, Text, Element, Transforms, Range } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";
import MemoMenu from "./MemoMenu";

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
      setCurrentState((prev) => [...prev, font]);
    } else {
      Editor.removeMark(editor, font, true);
      setCurrentState((prev) => prev.filter((item) => item !== font));
    }
  };

  //特定のインライン要素が適応してるかどうかを判別する関数。
  //現在選択している箇所が、複数のテキストノードをまたぐ場合、
  //すべてのテキストノードが適応している場合trueを返す
  //ex) children[{text:"value1", bold:true}, {text:"value2", bold:true, italic:true}]
  //↑の場合isActiveThisMark("bold")はtrueを返しisActiveThisMark("italic")はfalseを返す
  const isActiveThisMark = (mark) => {
    const selectedNodes = Editor.nodes(editor, {
      reverse: true,
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
      setCurrentState((prev) => [...prev, element]);
    } else {
      Transforms.setNodes(
        editor,
        { type: "paragraph" },
        { match: (n) => Element.isElement(n) }
      );
      setCurrentState((prev) => prev.filter((item) => item !== element));
    }
  };

  const isActiveThisElement = (element) => {
    const selectedNodes = Editor.nodes(editor, {
      reverse: true,
      match: (n) => Element.isElement(n),
    });

    return selectedNodes.every((item) => {
      return item[0].type === element;
    });
  };

  //Memoの設定menuが開いているかを管理するState
  //何についてのmenuが開いているのかを管理するState
  const [isOpenMemoMenu, setIsOpenMemoMenu] = useState(false);
  const [whichMemoMenuIsOpen, setWhichMemoMenuIsOpen] = useState("leaf");
  const appearMenu = () => {
    updateSelection();
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      setWhichMemoMenuIsOpen("leaf");
      setIsOpenMemoMenu(true);
    } else {
      setIsOpenMemoMenu(false);
    }
  };

  const element_arr = ["h1", "h2", "list", "paragraph"];
  const leaf_arr = ["bold", "italic", "underline"];
  //現在の選択範囲に何の要素が適応しているかを配列で管理するState
  //使用用途はtoolのスタイル適応
  const [currentState, setCurrentState] = useState(["paragraph"]);

  //現在の選択範囲の要素を更新する用の関数
  //FIX : いつ実行したらよいかが定まっていない。
  //ボタン押したときの更新が遅れている
  //フォントの境目の時の更新が遅れている
  const updateSelection = () => {
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

  //ショートカット設定用onKeyDownイベントを登録する関数
  const onKeyDown = (event) => {
    console.log(`${event.key} is down`);
    switch (event.key) {
      case "/": {
        //appearMenu関数の選択範囲がない時にMenuを閉じる処理の後にMenuを開くためにtimeout使用
        setTimeout(() => {
          setWhichMemoMenuIsOpen("element");
          setIsOpenMemoMenu(true);
        }, 100);

        break;
      }
      case "Backspace": {
        setIsOpenMemoMenu(false);
        break;
      }
    }
  };

  return (
    <>
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

        <Slate
          editor={editor}
          initialValue={initialElement}
          onChange={appearMenu}
        >
          <Editable
            className="memo__editor"
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyDown={(e) => onKeyDown(e)}
          ></Editable>
        </Slate>
        <MemoMenu
          isInteract={isInteract}
          applyFont={applyFont}
          applyElement={applyElement}
          currentState={currentState}
          isOpenMemoMenu={isOpenMemoMenu}
          toggleInteract={toggleInteract}
          whichMemoMenuIsOpen={whichMemoMenuIsOpen}
        />
      </FlexBox>
    </>
  );
};

export default Memo;
