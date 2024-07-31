import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import "./memo.css";
import { useInteract } from "../../../../hooks/useInteract";
import { FlexBox } from "@component";
import removeIcon from "@images/cross.svg";
// Import the Slate editor factory.
import {
  Editor,
  createEditor,
  Text,
  Element,
  Transforms,
  Range,
  Node,
} from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor, useSlate } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import MemoMenu from "./MemoMenu";
import MemoMask from "./MemoMask";

//fix :: めもが2つ以上あるときの挙動と、
//rectがいつでも出てきてしまう問題を解決したらとりあえずおっけい。
//後は、elementの種類を増やしたい。
//リンクの設定も。
const Memo = ({ myKey, removeThisTool }) => {
  const interact_ = useInteract();
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  //Memoツール用のState
  const [rect, setRect] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState({});

  const handleMouseOut = () => {
    setIsDrawing(false);
    setRect(false);
  };
  const handleMouseDown = async (e) => {
    const allElement = document.querySelectorAll(".element");
    allElement.forEach((item) => {
      return item.classList.remove("selected");
    });

    const rectArea = interact_.ref.current.getBoundingClientRect();
    setStart({
      x: e.clientX - rectArea.left,
      y: e.clientY - rectArea.top,
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    if (isInteract) return;

    //memoコンポーネントの画面に対する位置をtop, left, width, heightの形で取得
    const rectArea = interact_.ref.current.getBoundingClientRect();

    //現在のマウスの位置をmemoコンポーネントから見たtop,leftで取得
    const currentX = e.clientX - rectArea.left;
    const currentY = e.clientY - rectArea.top;

    //最初にクリックした地点と現在のマウスの位置で作成される四角形の形を算出
    const rectWidth = Math.abs(start.x - currentX);
    const rectHeight = Math.abs(start.y - currentY);
    const rectTop = currentY < start.y ? currentY : start.y;
    const rectLeft = currentX < start.x ? currentX : start.x;

    const rectBottom = rectTop + rectHeight;
    const rectRight = rectLeft + rectWidth;

    const allElement = document.querySelectorAll(".element");

    //四角形の中にあるelementクラスを持つ要素にselectedクラスを付与
    const filtered = [...allElement].filter((item) => {
      const top = item.offsetTop;
      const left = item.offsetLeft;
      const bottom = top + item.offsetHeight;
      const right = left + item.offsetWidth;
      return (
        bottom > rectTop &&
        right > rectLeft &&
        rectBottom > top &&
        rectRight > left
      );
    });

    allElement.forEach((item) => {
      item.classList.remove("selected");
    });

    filtered.forEach((item) => {
      item.classList.add("selected");
    });

    //selectedクラスを持つ要素をslate内で選択させる
    const selectedDom = document.querySelectorAll(".element.selected");
    if (selectedDom.length !== 0) {
      const node_arr = [...selectedDom].map((item) => {
        const slateNode = ReactEditor.toSlateNode(editor, item);
        const path = ReactEditor.findPath(editor, slateNode);
        return { node: slateNode, path: path[0] };
      });
      if (node_arr.length > 0) {
        const focusNode = node_arr[node_arr.length - 1];
        const lastChildrenLength = focusNode.node.children.length;
        const endOffset =
          focusNode.node.children[lastChildrenLength - 1].text.length;
        Transforms.select(editor, {
          anchor: { path: [node_arr[0].path, 0], offset: 0 },
          focus: {
            path: [focusNode.path, lastChildrenLength - 1],
            offset: endOffset,
          },
        });
      }
    }

    //四角形の形を反映
    setRect({
      width: rectWidth,
      height: rectHeight,
      top: rectTop,
      left: rectLeft,
    });
  };

  const handleMouseUp = () => {
    setRect(false);
    setIsDrawing(false);
  };

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

  const initialElement = [
    {
      type: "paragraph",
      children: [{ text: "" }],
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

    return (
      <span style={leaf.color ? { color: leaf.color } : null} {...attributes}>
        {children}
      </span>
    );
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

  const applyColor = (color) => {
    Editor.addMark(editor, "color", color);
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

  const whatColorIsActive = () => {
    const [selectedNode] = Editor.nodes(editor, {
      reverse: true,
      match: (n) => Text.isText(n),
    });

    return selectedNode[0].color;
  };

  const renderElement = ({ children, attributes, element }) => {
    //elementとpathと、カーソルの位置のpathが一致するかを判断する
    const editor_ins = useSlate();
    const { selection } = editor;

    const isSelected =
      ReactEditor.findPath(editor_ins, element)[0] ==
      selection?.anchor?.path[0];
    const isEmpty = Node.string(element).length === 0;

    switch (element.type) {
      //fix : 全角入力だとなぜか、placeholderの削除が遅い
      case "paragraph": {
        return (
          <p
            className="element"
            {...attributes}
            style={{ position: "relative", fontWeight: "normal" }}
          >
            {isEmpty && isSelected ? (
              <span
                contentEditable={false}
                style={{
                  opacity: 0.3,
                  pointerEvents: "none",
                  position: "absolute",
                }}
              >
                テキストを入力するか、「/」でコマンドを呼び出しましょう
              </span>
            ) : null}
            {children}
          </p>
        );
      }
      case "h1": {
        return (
          <h1
            className="element"
            style={{
              fontSize: "1.85rem",
              height: "50px",
              fontWeight: "bold",
              position: "relative",
              // fix :: overflowXが折り返してくれない
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
            {...attributes}
          >
            {children}
            {isEmpty ? (
              <span
                contentEditable={false}
                style={{
                  opacity: 0.3,
                  pointerEvents: "none",
                  position: "absolute",
                  top: "50%",
                  translate: "0 -50%",
                }}
              >
                見出し1
              </span>
            ) : null}
          </h1>
        );
      }
      case "h2": {
        return (
          <h2
            className="element"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bolder",
              position: "relative",
            }}
            {...attributes}
          >
            {children}
            {isEmpty ? (
              <span
                contentEditable={false}
                style={{
                  opacity: 0.3,
                  pointerEvents: "none",
                  position: "absolute",
                  top: "50%",
                  translate: "0 -50%",
                }}
              >
                見出し2
              </span>
            ) : null}
          </h2>
        );
      }
      case "list": {
        return (
          <li
            className="element"
            style={{ listStyleType: "disc", position: "relative" }}
            {...attributes}
          >
            {children}
            {isEmpty && isSelected ? (
              <span
                contentEditable={false}
                style={{
                  opacity: 0.3,
                  pointerEvents: "none",
                  position: "absolute",
                  top: "50%",
                  left: "20px",
                  translate: "0 -50%",
                }}
              >
                リスト
              </span>
            ) : null}
          </li>
        );
      }
    }
  };

  const applyElement = (element) => {
    Transforms.setNodes(
      editor,
      { type: element },
      { match: (n) => Element.isElement(n) }
    );
    setCurrentState((prev) => [...prev, element]);
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
  //leafMenuでつかうsubMenuが開いているかを管理するState
  //何についてのmenuが開いているのかを管理するState
  const [isOpenMemoMenu, setIsOpenMemoMenu] = useState(false);
  const [isOpenChoiseElementMenu, setIsOpenChoiseElementMenu] = useState(false);
  const [whichMemoMenuIsOpen, setWhichMemoMenuIsOpen] = useState("leaf");

  const onChangeEditor = async () => {
    const selectedDom = document.querySelectorAll(".element.selected");
    const MemoDom = document.querySelector(".Memo");
    if (selectedDom.length === 0) {
      MemoDom.classList.remove("noneSelection");
    } else {
      MemoDom.classList.add("noneSelection");
    }
    updateSelection();
    appearMenu();
    updateChar();
  };

  //複数の文字が選択されているときに選択されているテキストについてMemoMenuを開く関数
  const appearMenu = () => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      setWhichMemoMenuIsOpen("leaf");
      //MemoMenuを開くときはchoiseElementMenuは初期化動作として閉じることにする
      setIsOpenChoiseElementMenu(false);
      setIsOpenMemoMenu(true);
    } else {
      setIsOpenMemoMenu(false);
    }
  };

  //文字数を管理するためのStateと
  //文字数を更新する関数
  const [char_num, setChar_num] = useState(0);
  const updateChar = () => {
    const allTextNode = Editor.nodes(editor, {
      match: (n) => Text.isText(n),
      at: [],
    });
    const char = allTextNode.reduce((prev, current) => {
      return prev + Number(current[0].text.length);
    }, 0);
    setChar_num(char);
  };

  const element_arr = ["h1", "h2", "list", "paragraph"];
  const leaf_arr = ["bold", "italic", "underline", "color"];
  //現在の選択範囲に何の要素が適応しているかを配列で管理するState
  //使用用途はtoolのスタイル適応
  const [currentState, setCurrentState] = useState(["paragraph"]);

  //現在の選択範囲の要素を更新する用の関数
  const updateSelection = () => {
    const newState = [];
    element_arr.forEach((element) => {
      const isNeedPush = isActiveThisElement(element);
      if (isNeedPush) {
        newState.push(element);
      }
    });
    leaf_arr.forEach((leaf) => {
      if (leaf === "color") {
        const colorToAdd = whatColorIsActive();
        newState.color = colorToAdd;
      } else {
        const isNeedPush = isActiveThisMark(leaf);
        if (isNeedPush) {
          newState.push(leaf);
        }
      }
    });

    setCurrentState(newState);
  };

  //ショートカット設定用onKeyDownイベントを登録する関数
  const onKeyDown = (event) => {
    const [selectedNode] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n),
    });
    const selectedElements = document.querySelectorAll(".element.selected");
    if (event.ctrlKey || event.metaKey) {
      //ctrl or metakeyが押されている場合
      switch (event.key) {
        case "z": {
          HistoryEditor.undo(editor);
          break;
        }
      }
    } else {
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
          if (selectedNode[0].type === "list") {
            const [textnode] = Editor.nodes(editor, {
              match: (n) => Text.isText(n),
            });

            if (textnode[0].text === "") {
              Transforms.insertText(editor, "\n");
              applyElement("paragraph");
            }
          }
          setIsOpenMemoMenu(false);

          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          //elementMenuが開いてるときに、矢印キーで選択できるようにするためのcase
          if (isOpenMemoMenu && whichMemoMenuIsOpen === "element") {
            const [element_menu] =
              document.getElementsByClassName("memo__element-menu");
            const children = element_menu.children;
            const childArray = Array.from(children);
            const selectedItem_index = childArray.findIndex((item) =>
              item.classList.contains("selected")
            );
            if (
              selectedItem_index < 0 ||
              selectedItem_index === childArray.length - 1
            ) {
              children[selectedItem_index]?.classList.remove("selected");
              children[0].classList.add("selected");
            } else if (
              selectedItem_index >= 0 &&
              selectedItem_index < childArray.length - 1
            ) {
              children[selectedItem_index].classList.remove("selected");
              children[selectedItem_index + 1].classList.add("selected");
            }
            //FIX : ここに記述すると、choiseElementMenu内での
            //onKeyDownが発火しないため別の場所に記述しよう。
          } else if (isOpenMemoMenu && isOpenChoiseElementMenu) {
            console.log("open");
            const [choiseElement_menu] =
              document.getElementsByClassName("memo-sub-menu");
            const children = choiseElement_menu.children;
            const childArray = Array.from(children);
            const selectedItem_index = childArray.findIndex((item) => {
              item.classList.contains("selected");
            });
            if (
              selectedItem_index < 0 ||
              selectedItem_index === childArray.length - 1
            ) {
              children[selectedItem_index]?.classList.remove("selected");
              children[0].classList.add("selected");
            } else if (
              selectedItem_index >= 0 &&
              selectedItem_index < childArray.length - 1
            ) {
              children[selectedItem_index].classList.remove("selected");
              children[selectedItem_index + 1].classList.add("selected");
            }
          } else {
            Transforms.move(editor, { unit: "line" });
          }
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          //elementMenuが開いてるときに、矢印キーで選択できるようにするためのcase
          if (isOpenMemoMenu && whichMemoMenuIsOpen === "element") {
            const [element_menu] =
              document.getElementsByClassName("memo__element-menu");
            const children = element_menu.children;
            const childArray = Array.from(children);
            const selectedItem_index = childArray.findIndex((item) =>
              item.classList.contains("selected")
            );

            if (selectedItem_index <= 0) {
              children[selectedItem_index]?.classList.remove("selected");
              children[childArray.length - 1].classList.add("selected");
            } else if (selectedItem_index > 0) {
              children[selectedItem_index].classList.remove("selected");
              children[selectedItem_index - 1].classList.add("selected");
            }
          } else {
            Transforms.move(editor, { unit: "line", reverse: true });
          }
          break;
        }
        case "Enter": {
          if (isOpenMemoMenu && whichMemoMenuIsOpen === "element") {
            event.preventDefault();
            Transforms.delete(editor, { unit: "character", reverse: true });
            const [element_menu] =
              document.getElementsByClassName("memo__element-menu");
            const selectNode = Array.from(element_menu.children).find((item) =>
              item.classList.contains("selected")
            );
            switch (
              selectNode.getElementsByClassName("element-menu__item-title")[0]
                .innerText
            ) {
              case "テキスト": {
                applyElement("paragraph");
                setIsOpenMemoMenu(false);
                break;
              }
              case "見出し1": {
                applyElement("h1");
                setIsOpenMemoMenu(false);
                break;
              }
              case "見出し2": {
                applyElement("h2");
                setIsOpenMemoMenu(false);
                break;
              }
              case "リスト": {
                applyElement("list");
                setIsOpenMemoMenu(false);
                break;
              }
            }
          } else if (selectedElements.length > 0) {
            event.preventDefault();
            const [lastTextNode] = Editor.nodes(editor, {
              reverse: true,
              match: (n) => Text.isText(n),
            });
            Transforms.select(editor, {
              anchor: {
                path: lastTextNode[1],
                offset: lastTextNode[0].text.length,
              },
              focus: {
                path: lastTextNode[1],
                offset: lastTextNode[0].text.length,
              },
            });
            selectedElements.forEach((item) => {
              return item.classList.remove("selected");
            });
          }
          break;
        }
        case "Tab": {
          event.preventDefault();
          Transforms.insertText(editor, "    ");
          break;
        }
      }
    }
  };

  return (
    <FlexBox
      className="Memo"
      width="500px"
      height="800px"
      pb="10px"
      pl="10px"
      pr="10px"
      pt="10px"
      column
      sb
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
        onChange={onChangeEditor}
        initialValue={initialElement}
      >
        <Editable
          className="memo__editor"
          spellCheck="false"
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={(e) => onKeyDown(e)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        ></Editable>
        {isDrawing && (
          <div
            className="rectangle"
            style={{
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
            }}
          />
        )}
      </Slate>
      <MemoMenu
        isInteract={isInteract}
        toggleInteract={toggleInteract}
        applyFont={applyFont}
        applyColor={applyColor}
        applyElement={applyElement}
        currentState={currentState}
        isOpenMemoMenu={isOpenMemoMenu}
        isOpenChoiseElementMenu={isOpenChoiseElementMenu}
        setIsOpenChoiseElementMenu={setIsOpenChoiseElementMenu}
        whichMemoMenuIsOpen={whichMemoMenuIsOpen}
      />
      <FlexBox right width="100%" height="20px" mt="10px">
        <p style={{ color: "#e4e4e4" }}>現在{char_num}文字です</p>
      </FlexBox>
      <MemoMask
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleMouseOut={handleMouseOut}
      ></MemoMask>
    </FlexBox>
  );
};

export default Memo;
