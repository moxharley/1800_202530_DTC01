import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

function displayScheduleDynamically() {
  onAuthReady(async (user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      alert("need to login");
      location.href = "/login.html";
      return;
    } else {
      try {
        const userUid = user.uid;

        const scheduleQuery = query(
          collection(db, "schedules"),
          where("userUid", "==", userUid)
        );

        const scheduleCollectionRef = collection(scheduleQuery);
        const querySnapshot = await getDocs(scheduleCollectionRef);

        let scheduleTemplate = document.getElementById("scheduleTemplate");

        querySnapshot.forEach((doc) => {
          let newSchedule = scheduleTemplate.content.cloneNode(true);
          const schedule = doc.data();

          newSchedule.querySelector("#title").textContent = schedule.title;
          newSchedule.querySelector("#memo").textContent = schedule.memo;
          newSchedule.querySelector("#date").textContent = schedule.date;
          newSchedule.querySelector("#time").textContent = schedule.time;

          document.getElementById("schedulesDiv").appendChild(newSchedule);
        });
      } catch (error) {
        let errorHtml = `<div class="font-bold text-center">Nothing to display</div>`;
        document.getElementById("schedulesDiv").innerHTML = errorHtml;
      }
    }
  });
}
displayScheduleDynamically();

function displayCalendar() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateId = [
    "sunDate",
    "monDate",
    "tueDate",
    "wedDate",
    "thuDate",
    "friDate",
    "satDate",
  ];

  const today = new Date();
  const month = months[today.getMonth()];
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const lastDate = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  document.getElementById("monthName").innerHTML = month;

  let weekNum = 0;

  if (today.getMonth() % 7 != 0) {
    if (firstDay + (lastDate % 7) > 7) {
      weekNum = 6;
    } else {
      weekNum = 5;
    }
  } else {
    if (firstDay == 0) {
      weekNum = 4;
    } else {
      weekNum = 5;
    }
  }

  let calendarTemplate = document.getElementById("calendarTemplate");
  let dateCount = 1;
  for (let i = 0; i < weekNum; i++) {
    let newWeek = calendarTemplate.content.cloneNode(true);

    if (i == 0) {
      for (let j = firstDay; j < 7; j++) {
        newWeek.querySelector("#" + dateId[j]).textContent = dateCount;
        dateCount += 1;
      }
      document.getElementById("calendar").appendChild(newWeek);
    } else if (i + 1 == weekNum) {
      let maxNum = lastDate - dateCount;
      for (let j = 0; j <= maxNum; j++) {
        newWeek.querySelector("#" + dateId[j]).textContent = dateCount;
        dateCount += 1;
      }
      document.getElementById("calendar").appendChild(newWeek);
    } else {
      for (let j = 0; j < 7; j++) {
        newWeek.querySelector("#" + dateId[j]).textContent = dateCount;
        dateCount += 1;
      }
      document.getElementById("calendar").appendChild(newWeek);
    }
  }
}
displayCalendar();
