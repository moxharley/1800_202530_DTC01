import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

function addScheduleData() {
  onAuthReady(async (user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      alert("need to login");
      location.href = "/login.html";
      return;
    } else {
      const userUid = user.uid;
      const scheduleTitle = document.getElementById("title").value;
      const scheduleDate = document.getElementById("date").value;
      const scheduleTime = document.getElementById("time").value;
      const scheduleMemo = document.getElementById("memo").value;

      let scheduleRepeatString = document.getElementById("repeat").value;
      let scheduleRepeatInt = 0;

      if (scheduleRepeatString === "daily") {
        scheduleRepeatInt = 1;
      } else if (scheduleRepeatString === "weekly") {
        scheduleRepeatInt = 7;
      } else if (scheduleRepeatString === "biweekly") {
        scheduleRepeatInt = 14;
      } else if (scheduleRepeatString === "monthly") {
        scheduleRepeatInt = 30;
      }

      if (!scheduleTitle) {
        alert("title is empty");
      } else {
        const scheduleRef = collection(db, "schedules");
        console.log("Adding a schedule...");

        await addDoc(scheduleRef, {
          userUid: userUid,
          title: scheduleTitle,
          date: scheduleDate,
          time: scheduleTime,
          repeat: scheduleRepeatInt,
          memo: scheduleMemo,
        });

        location.href = "/src/pages/calendar.html";
      }
    }
  });
}
document.getElementById("submit").addEventListener("click", addScheduleData);
