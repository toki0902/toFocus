//右矢印キー,左矢印キーが押されたときに、次、もしくは前のページに行く関数
export const changePageWhenKeyDown = (event, prevFunc, nextFunc) => {
  console.log(event, nextFunc, prevFunc);
  if (event.key === "ArrowLeft") {
    prevFunc();
  }
  if (event.key === "ArrowRight") {
    nextFunc();
  }
};
