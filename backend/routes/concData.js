const express = require("express");
const router = express.Router();

const { pool } = require("../db");

//ユーザのconcTimeを登録する用のAPI
router.post("/concTime", async (req, res) => {
  if (req.isAuthenticated()) {
    //作業の開始と終了が同じ場合エラーを返す
    if (req.body.start != req.body.end) {
      try {
        await pool.query(
          "INSERT INTO focustime (start, end, user_id) VALUES (:start, :end, :userid)",
          { start: req.body.start, end: req.body.end, userid: req.body.id }
        );
        console.log("register complete");
        return res.status(200).json({ msg: "データを登録しました。" });
      } catch {
        console.error("database error", err);
        return res.status(500).json({
          msg: "データベースでエラーが発生しました。もう一度やり直してください。",
        });
      }
    } else {
      console.log("not enough time to work");
      return res.status(400).json({ msg: "作業時間が短すぎます。" });
    }
  } else {
    console.log("unauthorized user");
    res.status(401).json({
      msg: "ユーザ認証に失敗しました。ログインしてください。",
    });
  }
});

router.post("/track", async (req, res) => {
  if (req.isAuthenticated()) {
    const { tree, userId } = req.body;
    if (!(tree && userId)) {
      console.log("Required parameters are missing");
      return res.status(400).json({
        msg: "足跡の登録に必要な情報がリクエストに含まれていません。",
      });
    }

    try {
      await pool.query(
        "INSERT INTO track (tree_for_slate, user_id) VALUES (:tree, :userId)",
        { tree: tree, userId: userId }
      );
    } catch (err) {
      console.error(`database error : ${err}`);
      return res.status(500).json({
        msg: "データベースでエラーがありました。もう一度やり直してください。",
      });
    }

    return res.status(200).json({ msg: "足跡を記録しました。" });
  } else {
    console.log("unauthorized user");
    res.status(401).json({
      msg: "ユーザ認証に失敗しました。ログインしてください。",
    });
  }
});

//DBの特定のconcDataをfetchしてくれるAPI
//concDataエンドポイントで、focustimeテーブルへのfetchはすべて行う。
//ユーザのidと基準となる数字(年単位の検索なら2024など)とsearchMode(yearなど)をURLパラメータで受け取る。
router.get("/:userId/:target/:searchMode", async (req, res) => {
  if (req.isAuthenticated()) {
    const { userId, searchMode, target } = req.params;
    if (!(userId && searchMode && target)) {
      res.status(400).json({ msg: "Required parameters are missing" });
    }
    //queryが複数あるためconnectionを使用。
    //すべて取得した後にデータを整形する
    const connection = await pool.getConnection();
    const timeData_notFormat = await connection.execute(
      "SELECT start, end, created_at FROM focustime WHERE YEAR(created_at) = :year AND user_id = :userId",
      { year: target, userId: userId },
      (err) => {
        if (err) {
          console.log("database error");
          res.status(500).json({ msg: `database error : ${err}` });
        }
        console.log("complete fetch time data");
      }
    );

    const trackData_notFormat = await connection.execute(
      "SELECT id, tree_for_slate, created_at FROM track WHERE YEAR(created_at) = :year AND user_id = :userId",
      { year: target, userId: userId },
      (err) => {
        if (err) {
          console.log("database error");
          res.status(500).json({ msg: `database error : ${err}` });
        }
        console.log("complete fetch track data");
      }
    );

    const taskData_notFormat = await connection.execute(
      "SELECT id, name, created_at FROM task WHERE YEAR(created_at) = :year AND user_id = :userId",
      { year: target, userId: userId },
      (err) => {
        if (err) {
          console.log("database error");
          res.status(500).json({ msg: `database error : ${err}` });
        }
        console.log("complete fetch task data");
      }
    );

    connection.release();

    //日付ごとにtask,track,timeの３種のデータをまとめていく。
    //目指す形は以下
    //   {
    //   dateString: "2024/06/23",
    //   year: 2024,
    //   month: 6,
    //   day: 23,
    //   completeTasks: ["出材カンプを作成する。", "VSCodeのインストール"],
    //   focusTime: [
    //     { start: "15:00", end: "16:00" },
    //     { start: "17:00", end: "18:30" },
    //   ],
    //   tracks: [],
    // },

    let again = true;
    const resObj = [];
    const firstDayOfYear = new Date(target, 0, 1);
    for (let i = 0; again; i++) {
      //1月1日を基準に１日ずつ日付を取得。
      const dateObj = addDays(firstDayOfYear, i);
      const nextDateObj = addDays(firstDayOfYear, i + 1);

      //取得した日付と照合されるデータを取得
      const filteredTimeData = timeData_notFormat[0]
        .filter((item) => {
          return (
            item.created_at.getMonth() === dateObj.getMonth() &&
            item.created_at.getDate() === dateObj.getDate()
          );
        })
        .map((item) => {
          return { start: item.start, end: item.end };
        });

      const filteredTaskData = taskData_notFormat[0]
        .filter((item) => {
          return (
            item.created_at.getMonth() === dateObj.getMonth() &&
            item.created_at.getDate() === dateObj.getDate()
          );
        })
        .map((item) => {
          return item.name;
        });

      const filteredTrackData = trackData_notFormat[0]
        .filter((item) => {
          return (
            item.created_at.getMonth() === dateObj.getMonth() &&
            item.created_at.getDate() === dateObj.getDate()
          );
        })
        .map((item) => {
          return item.tree_for_slate;
        });

      //何のデータもなかった場合何も追加しない
      if (
        filteredTaskData.length === 0 &&
        filteredTimeData.length === 0 &&
        filteredTrackData.length === 0
      ) {
        //一つでもデータがあった場合それらを合わせて新しいオブジェクトを作成
        //データの形は上部に明記
      } else {
        const year_str = String(dateObj.getFullYear());
        const month_str = String(dateObj.getMonth() + 1).padStart(2, "0");
        const date_str = String(dateObj.getDate()).padStart(2, "0");
        const newObj = {
          dateString: `${year_str}/${month_str}/${date_str}`,
          year: Number(year_str),
          month: Number(month_str),
          day: Number(date_str),
          completeTasks: filteredTaskData,
          focusTime: filteredTimeData,
          tracks: filteredTrackData,
        };
        resObj.push(newObj);
      }

      //ここの条件を変えると取得する範囲が決められる。
      if (dateObj.getFullYear() !== nextDateObj.getFullYear()) {
        again = false;
      }
    }

    console.log(resObj);

    res.status(200).json({
      dataOnConcentration: resObj,
      msg: "return data on concentration",
    });
  } else {
    console.log("unauthorized user");
    res.status(401).json({
      msg: "unauthorized",
    });
  }
});

// router.get("/createRandomFocusData", (req, res) => {
//   function getRandomDate() {
//     const start = new Date(2024, 0, 1); // 2024年1月1日
//     const end = new Date(2024, 11, 31); // 2024年12月31日
//     const randomTime =
//       start.getTime() + Math.random() * (end.getTime() - start.getTime());
//     return new Date(randomTime);
//   }
//   function formatDateToTimestamp(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0から始まるので+1
//     const day = String(date.getDate()).padStart(2, "0");
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const seconds = String(date.getSeconds()).padStart(2, "0");
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   }
//   for (let i = 0; i < 250; i++) {
//     const created_at = getRandomDate();
//     const formated = formatDateToTimestamp(created_at);
//     const task_name = `task${i}`;
//     const start = Math.floor(Math.random() * 24);
//     const end = Math.floor(Math.random() * (24 - (start + 1))) + (start + 1);

//     const start_str = `${start}:00`;
//     const end_str = `${end}:00`;

//     pool.query(
//       "INSERT INTO task (name, user_id, created_at) VALUES (:name, 40, :created_at)",
//       {
//         name: task_name,
//         created_at: formated,
//       }
//     );
//     pool.query(
//       "INSERT INTO focustime (start, end, user_id, created_at) VALUES (:start, :end, 40, :created_at)",
//       {
//         start: start_str,
//         end: end_str,
//         created_at: formated,
//       }
//     );
//   }
//   res.send("complete");
// });

module.exports = router;
