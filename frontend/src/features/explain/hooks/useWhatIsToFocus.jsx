import { useState } from "react";

//toFocusとはのメニューが開いているか、また、南蛮のページが開いているかを定義するカスタムフック。
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
    setWhatIsOpen((prev) => prev + 1);
  };

  const prevPage = () => {
    setWhatIsOpen((prev) => prev - 1);
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
