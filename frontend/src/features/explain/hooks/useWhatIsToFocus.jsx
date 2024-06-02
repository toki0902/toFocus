import { useState } from "react";

//toFocusとはのメニューが開いているか、また、南蛮のページが開いているかを定義するカスタムフック。
//explain内で共通したものを一つ持っていればいいので、hooksディレクトリに入れるべきではないかも？
export const useWhatIsToFocus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [whatIsOpen, setWhatIsOpen] = useState(1);

  const openWhatIsToFocus = () => {
    setIsOpen(true);
  };

  const closeWhatIsToFocus = () => {
    setIsOpen(false);
  };

  const toggleWhatIsToFocus = () => {
    setIsOpen((prev) => !prev);
  };

  const nextPage = () => {
    if (whatIsOpen < 8) {
      setWhatIsOpen((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (whatIsOpen > 0) {
      setWhatIsOpen((prev) => prev - 1);
    }
  };

  const resetPage = () => {
    setWhatIsOpen(0);
  };

  return {
    openWhatIsToFocus,
    closeWhatIsToFocus,
    toggleWhatIsToFocus,
    nextPage,
    prevPage,
    resetPage,
    isOpen,
    whatIsOpen,
  };
};
