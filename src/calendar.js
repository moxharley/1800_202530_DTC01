import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, query, where, getDocs } from "firebase/firestore";

function displayScheduleDynamically() {
  onAuthReady(async (user) => {
    if (!user) {
      // If no user is signed in → redirect back to login page.
      alert("need to login");
      location.href = "/login.html";
      return;
    } else {
      try {
        // get user's uid
        const userUid = user.uid;

        // firestore query to compare uid
        const scheduleQuery = query(
          collection(db, "schedules"),
          where("userUid", "==", userUid)
        );

        const querySnapshot = await getDocs(scheduleQuery);

        // Schedule Template
        let scheduleTemplate = document.getElementById("scheduleTemplate");

        querySnapshot.forEach((doc) => {
          let newSchedule = scheduleTemplate.content.cloneNode(true);

          const schedule = doc.data();

          // set each data to the template
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

function displayCalendar(baseDate) {
  // Reset Calendar
  let temp = document.getElementById("calendar");
  for (let i = temp.children.length - 1; i > 0; i--) {
    temp.children[i].remove();
  }

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

  // from Template
  const dateId = [
    "sunDate",
    "monDate",
    "tueDate",
    "wedDate",
    "thuDate",
    "friDate",
    "satDate",
  ];

  // get month name as a string
  const month = months[baseDate.getMonth()];
  const firstDay = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    1
  ).getDay();
  const lastDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0
  ).getDate();

  // set year and month to the page
  document.getElementById("year").innerText = baseDate.getFullYear();
  document.getElementById("monthName").innerText = month;

  // count how many week sections are needed
  let weekNum = 0;
  if (lastDate % 7 != 0) {
    if (firstDay + (lastDate % 7) > 7) {
      weekNum = 6;
    } else {
      weekNum = 5;
    }
  } else {
    // for February
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
      // set the first week
      for (let j = firstDay; j < 7; j++) {
        newWeek.querySelector("#" + dateId[j]).textContent = dateCount;
        dateCount += 1;
      }
      document.getElementById("calendar").appendChild(newWeek);
    } else if (i + 1 == weekNum) {
      // set the last week
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
// initial setting
displayCalendar(new Date());

// add click event for the monthly arrows
let monthBtns = document.getElementsByClassName("monthBtn");
for (let monthBtn of monthBtns) {
  monthBtn.addEventListener("click", () => {
    // to convert string to int
    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const btnId = monthBtn.id;

    let baseDate = new Date();

    const currentMonthName = document.getElementById("monthName").innerText;
    // set the month from the calendar
    baseDate.setMonth(monthMap[currentMonthName]);
    let month = baseDate.getMonth();

    const currentYear = parseInt(document.getElementById("year").innerText);
    // set the year from the calendar
    baseDate.setFullYear(currentYear);

    // change the year when the month is January or December
    if (month == 0) {
      if (btnId == "prevMonth") {
        baseDate.setFullYear(baseDate.getFullYear() - 1);
        baseDate.setMonth(11);
      } else {
        baseDate.setMonth(month + 1);
      }
    } else if (month == 11) {
      if (btnId == "nextMonth") {
        baseDate.setFullYear(baseDate.getFullYear() + 1);
        baseDate.setMonth(0);
      } else {
        baseDate.setMonth(month - 1);
      }
    } else {
      if (btnId == "prevMonth") {
        baseDate.setMonth(month - 1);
      } else {
        baseDate.setMonth(month + 1);
      }
    }

    // change the calendar according to the user's click
    displayCalendar(baseDate);
  });
}

// easily back to current calendar
let todayBtn = document.getElementById("todayBtn");
todayBtn.addEventListener("click", () => displayCalendar(new Date()));

function displayWeek() {
  // from Template
  const dateId = [
    "sunDate",
    "monDate",
    "tueDate",
    "wedDate",
    "thuDate",
    "friDate",
    "satDate",
  ];

  let today = new Date();
  // calcualte the date of Sunday
  let sunday = today.getDate() - today.getDay();
  // change the base date to Sunday
  today.setDate(sunday);

  // Weekly Template
  let weekTemplate = document.getElementById("weekTemplate");
  let newDate = weekTemplate.content.cloneNode(true);
  for (let i = 0; i < 7; i++) {
    newDate.querySelector("#" + dateId[i]).textContent = sunday + i;
  }
  document.getElementById("week").appendChild(newDate);
}
// set initial weekly calendar
displayWeek();

let toggleCalendarBtn = document.getElementById("toggleCalendar");
toggleCalendarBtn.addEventListener("click", () => {
  let calendarTable = document.getElementById("calendarTable");
  calendarTable.classList.toggle("hidden");

  let weekTable = document.getElementById("weekTable");
  weekTable.classList.toggle("hidden");

  let arrowIcon = toggleCalendarBtn.querySelector("i");
  arrowIcon.classList.toggle("fa-chevron-up");
  arrowIcon.classList.toggle("fa-chevron-down");
});
