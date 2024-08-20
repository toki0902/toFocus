import React, { useEffect, useRef } from "react";
import "./whatistofocus.css";
import { FlexBox } from "@component";
import { changePageWhenKeyDown } from "./utils";

const WhatIsToFocus = ({
  whatIsOpen,
  nextPage,
  prevPage,
  toggleWhatIsToFocus,
}) => {
  //fix : えぐいくらい冗長性があるので何とかしたい。
  const whatIsToFocusRef = useRef(null);

  useEffect(() => {
    whatIsToFocusRef.current.focus();
  }, []);
  const page0 = (
    <>
      <h2 className="whatIsToFocus__title">toFocusの目的</h2>
      <p className="whatIsToFocus__text--plain">toFocusの究極の目的は</p>
      <p className="whatIsToFocus__text--highlight">
        PCで作業する全人々が最高の集中を手に入れること
      </p>
      <p className="whatIsToFocus__text--plain">である</p>
      <p className="whatIsToFocus__text--plain">
        現代社会では残業であったり
        <br />
        やらなければいけないタスクが蔓延していて
        <br />
        娯楽という人生の本質が欠けていると制作者は感じている。
      </p>
      <p className="whatIsToFocus__text--plain">
        そんなものに時間を割いている場合ではないぞ、、、
        <br />
        人生は有限なのだ。
        <br />
        効率的な業務の遂行が、あなたの豊かな人生を形成するとは思わないかね？
        <br />
        そう思ったなら今がチャンスだ。怠惰な自分を認め集中の世界へ飛び出してやろう
      </p>
    </>
  );

  const page1 = (
    <>
      <h2 className="whatIsToFocus__title">toFocusの提供するもの</h2>
      <p className="whatIsToFocus__text--plain">
        では、集中には何が必要なのか？
        <br />
        toFocusで提供するものは以下の三つである。
      </p>
      <p className="whatIsToFocus__text--highlight">
        ・時間管理の術
        <br />
        ・集中データの分析
        <br />
        ・多種多様なツール
      </p>
      <p className="whatIsToFocus__text--plain">
        名前を聞いただけでは、具体的に何を指しているのかわからないだろう。
        <br />
        これから先のページでそれらを解説していくので、よく目を通してくれ。
      </p>
    </>
  );
  const page2 = (
    <>
      <h2 className="whatIsToFocus__title">時間管理の術</h2>
      <p className="whatIsToFocus__text--highlight">
        人間は、長時間一つのものに集中することはできない。
      </p>
      <p className="whatIsToFocus__text--plain">
        「僕、私はできる。」そう思った人もいるだろう。
        <br />
        だがこれは、本能的なものなのだ。
      </p>
      <p className="whatIsToFocus__text--plain">
        はるか昔、狩猟採集の時代に人類は生存を強いられた。
        <br />
        例えば、目の前に木の実がなっているとしよう。
        <br />
        その木の実を取るために、全集中をする。
        <br />
        背後から迫りくる獣の気配にも気づかないで、、。
      </p>
      <p className="whatIsToFocus__text--plain">
        これでは生存はできない。人類は生存のために、
        <br />
        一つのことに集中することをやめたのだ。
        <br />
      </p>
      <p className="whatIsToFocus__text--plain">
        どうだい？これで分かっただろう？
        <br />
        あなたが業務中についつい可愛い恋人のことを考えてしまうのも
        <br />
        今ハマっているゲームの攻略法を必死に練ってしまうのも
        <br />
        すべて元をたどれば生存のためなのだ。
        <br />
        さぼってしまう自分を許してやってくれ。
      </p>
    </>
  );
  const page3 = (
    <>
      <h2 className="whatIsToFocus__title">時間管理の術</h2>
      <p className="whatIsToFocus__text--plain">
        ここで使用されるのが
        <br />
        フランチェスコ・シリロ氏が発案したポモドーロテクニックである。
      </p>
      <p className="whatIsToFocus__text--plain">
        これは、25分間の作業フェーズと5分間の休憩フェーズを交互に繰り返す
        <br />
        タイムマネジメント方法である。
        <br />
        作業フェーズでは一つのタスクのみに集中することが推奨されている。
      </p>
      <p className="whatIsToFocus__text--plain">
        だが、25分と5分という時間設定はただの目安にすぎず
        <br />
        設定したタスクが完了できる時間を適切に算出し
        <br />
        その時間きっちり集中することが理想である。
      </p>
      <p className="whatIsToFocus__text--plain">
        toFocusではその時間管理を1クリックで行えるように
        <br />
        ポモドーロ機能がついている。ぜひとも活用してほしい。
      </p>
    </>
  );
  const page4 = (
    <>
      <h2 className="whatIsToFocus__title">集中データの分析</h2>
      <p className="whatIsToFocus__text--highlight">
        集中するためのモチベーションは何だと思う？
      </p>
      <p className="whatIsToFocus__text--plain">
        この問いにスパッと答えることはおそらく難しいだろう。
        <br />
        だが製作者である私は考えた。
        <br />
        モチベーションとは今までの努力の可視化から生まれるのではないかと。
      </p>
      <p className="whatIsToFocus__text--plain">
        「何もかもがめんどくさい」時間は絶対にある。
        <br />
        普段、なりたい自分に向けて努力を続けている人、
        <br />
        コツコツ真面目に働くことが習慣になっている勤勉な人
        <br />
        その誰もが、集中の糸が切れてしまう瞬間に直面することがあると思う。
      </p>
      <p className="whatIsToFocus__text--plain">
        そんな時は、ふと今まで辿ってきた「足跡」を振り返ってみよう。
        <br />
        あんなことをした、こんなことを学んだ。
        <br />
        そんな自分の努力を今一度褒めてあげようではないか。
      </p>
      <p className="whatIsToFocus__text--plain">
        toFocusはその機会をもちろん提供しよう。
      </p>
    </>
  );
  const page5 = (
    <>
      <h2 className="whatIsToFocus__title">集中データの分析</h2>
      <p className="whatIsToFocus__text--plain">
        分析画面では以下の機能が取り揃えてある。
      </p>
      <p className="whatIsToFocus__text--highlight">
        ・集中時間の記録
        <br />
        ・「足跡」の振り返り
      </p>
      <p className="whatIsToFocus__text--plain">
        集中時間の記録
        <br />
        →こちらの項では、
        <br />
        何年何月何日にどれだけの集中を行ったか、また、
        <br />
        どれだけのタスクをこなしたか、
        <br />
        がグラフとなって閲覧できるようになっている
      </p>
      <p className="whatIsToFocus__text--plain">
        「足跡」の振り返り
        <br />
        →こちらの項では、
        <br />
        集中した後にその日の作業のまとめを「足跡」として保存し、
        <br />
        それらを後から閲覧できるようになっている。
      </p>
      <p className="whatIsToFocus__text--plain">
        これらの機能は、きっとあなたの貴重な娯楽を生むための集中
        <br />
        を再度取り戻させてくれるだろう
      </p>
    </>
  );
  const page6 = (
    <>
      <h2 className="whatIsToFocus__title">多種多様なツール</h2>
      <p className="whatIsToFocus__text--plain">
        PCで作業をしていて、こんな経験はないだろうか？
      </p>
      <p className="whatIsToFocus__text--highlight">
        いろんなタブを開かないといけない。管理がだるいなあ、、。
      </p>
      <p className="whatIsToFocus__text--plain">
        この世にはとんでもない数のツールがある。
        <br />
        ふと音楽を聴きたいときでも、YouTube、Spotifyといくらでもある。
        <br />
        上司から送られてくるファイルにも
        <br />
        PDFやらwordやらexelやらさまざまな種類がある。
        <br />
        非常に煩雑だ。どのタブがなんだったっけ！？と混乱することもあるだろう。
      </p>
      <p className="whatIsToFocus__text--plain">
        混乱してしまうならまとめればいいのだ。
        <br />
        音楽を再生しながら文書ファイルを編集しながら
        <br />
        複雑な計算を電卓でしながら英語を日本語に翻訳しながら
        <br />
        その結果をメモに記載してしまえばいいのだ。
      </p>
      <p className="whatIsToFocus__text--plain">
        それらを一挙にできるのがtoFocusである。
        <br />
        何をできるかは次のページに書いてある。確認を頼む。
        <br />
        さらに、追加してほしい機能があれば下記フォームから知らせてくれ。
      </p>
    </>
  );
  const page7 = (
    <>
      <h2 className="whatIsToFocus__title">多種多様なツール</h2>
      <p className="whatIsToFocus__text--plain">
        toFocusが所持しているツールはこれらになる。
      </p>
      <p className="whatIsToFocus__text--highlight">
        ・多機能メモ
        <br />
        ・カスタム可能な音楽
        <br />
        ・翻訳機
        <br />
        ・ファイル保存ストレージ
        <br />
        ・電卓
      </p>
      <p className="whatIsToFocus__text--plain">
        すべて直感的にわかりやすい画面になっているので
        <br />
        作業中にツールバーから選択して使ってみてほしい。
      </p>
      <p className="whatIsToFocus__text--plain">
        こんなにもかわいいツール達があなたを待っているんだ。
        <br />
        もう手がうずうずして止まらないんじゃないのか？
        <br />
        そろそろ集中ワールドに行きたいだろう？
      </p>
    </>
  );
  const page8 = (
    <>
      <h2 className="whatIsToFocus__title">最後に</h2>
      <p className="whatIsToFocus__text--plain">
        最後になるが、集中することで何が起きるかを説明しておこう。
      </p>
      <p className="whatIsToFocus__text--highlight">
        あなた達は何のためにPCで作業をしている？
      </p>
      <p className="whatIsToFocus__text--plain">
        その答えにすべてが詰まっている。
        <br />
        仕事のために作業をしているのなら
        <br />
        集中することで独創的なアイデアが生まれ、業務の効率が上がり
        <br />
        残業が減り、社内での評価が上がり生活に余裕が生まれるだろう。
      </p>
      <p className="whatIsToFocus__text--plain">
        自分の勉強のために作業をしているのなら
        <br />
        集中はあなたをあなたの理想に近づけ、あなたの魅力を高め
        <br />
        周りからの信頼も上がり、何より自分自身を好きになれるかもしれない。
      </p>
      <p className="whatIsToFocus__text--plain">
        「そんなにうまくいくはずない」そういうのは、わかるが
        <br />
        そんな戯言は一度集中をしてから言ってほしいものだ。
        <br />
        なかなか作業がうまくいかない、、と言っている人のほとんどは、
        <br />
        そのタスクに集中していないことが原因である。
      </p>
      <p className="whatIsToFocus__text--plain">
        それでは諸君の人生が豊かになることを祈っている。
      </p>
    </>
  );
  //currentPage更新時に何かeffectをかけたい。
  const currentPage =
    whatIsOpen === 0
      ? page0
      : whatIsOpen === 1
      ? page1
      : whatIsOpen === 2
      ? page2
      : whatIsOpen === 3
      ? page3
      : whatIsOpen === 4
      ? page4
      : whatIsOpen === 5
      ? page5
      : whatIsOpen === 6
      ? page6
      : whatIsOpen === 7
      ? page7
      : page8;
  return (
    <FlexBox
      className="whatIsToFocus"
      width="65vw"
      height="65vh"
      onKeyDown={(e) => {
        changePageWhenKeyDown(e, prevPage, nextPage);
      }}
      tabIndex
      ref={whatIsToFocusRef}
    >
      <FlexBox
        className="whatIsToFocus__wrap-toPosition"
        width="100%"
        height="100%"
        column
        left
        top
        pd="2% 2% 2% 2%"
      >
        {currentPage}
        {whatIsOpen <= 7 ? (
          <div className="whatIsToFocus__next-button" onClick={nextPage}>
            次へ
          </div>
        ) : null}
        {whatIsOpen >= 1 ? (
          <div className="whatIsToFocus__prev-button" onClick={prevPage}>
            戻る
          </div>
        ) : null}
        {whatIsOpen === 8 ? (
          <div
            className="whatIsToFocus__end-button"
            onClick={toggleWhatIsToFocus}
          >
            終わる
          </div>
        ) : null}
      </FlexBox>
    </FlexBox>
  );
};

export default WhatIsToFocus;
