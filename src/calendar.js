import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, query, and, or, where, getDocs } from "firebase/firestore";

onAuthReady((user) => {
  if (!user) {
    location.href = "/src/pages/loginSignup.html";
  } else {
    sessionStorage.setItem("uid", user.uid);
  }
});

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
  const dateClass = [
    "sundays",
    "mondays",
    "tuesdays",
    "wednesdays",
    "thursdays",
    "fridays",
    "saturdays",
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
  const currentYear = baseDate.getFullYear();
  document.getElementById("year").innerText = currentYear;
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
  const currentMonth = parseInt(baseDate.getMonth()) + 1;
  const dateStr = "mon-" + currentYear + "-" + currentMonth + "-";
  let calendarDateClass = "";
  let dateCount = 1;
  for (let i = 0; i < weekNum; i++) {
    let newWeek = calendarTemplate.content.cloneNode(true);

    if (i == 0) {
      // set the first week
      for (let j = firstDay; j < 7; j++) {
        newWeek.querySelector("." + dateClass[j]).textContent = dateCount;

        calendarDateClass = dateStr + dateCount.toString().padStart(2, "0");
        newWeek
          .querySelector("." + dateClass[j])
          .classList.add(calendarDateClass);

        dateCount += 1;
      }
      document.getElementById("calendar").appendChild(newWeek);
    } else if (i + 1 == weekNum) {
      // set the last week
      let maxNum = lastDate - dateCount;
      for (let j = 0; j <= maxNum; j++) {
        newWeek.querySelector("." + dateClass[j]).textContent = dateCount;
        calendarDateClass = dateStr + dateCount.toString().padStart(2, "0");
        newWeek
          .querySelector("." + dateClass[j])
          .classList.add(calendarDateClass);
        dateCount += 1;
      }
      document.getElementById("calendar").appendChild(newWeek);
    } else {
      for (let j = 0; j < 7; j++) {
        newWeek.querySelector("." + dateClass[j]).textContent = dateCount;
        calendarDateClass = dateStr + dateCount.toString().padStart(2, "0");
        newWeek
          .querySelector("." + dateClass[j])
          .classList.add(calendarDateClass);
        dateCount += 1;
      }
      document.getElementById("calendar").appendChild(newWeek);
    }
  }
  monthlyScheduleQuery("calendar", currentYear, currentMonth);
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
  const dateClass = [
    "sundays",
    "mondays",
    "tuesdays",
    "wednesdays",
    "thursdays",
    "fridays",
    "saturdays",
  ];

  let today = new Date();
  // calcualte the date of Sunday
  let sunday = today.getDate() - today.getDay();
  // change the base date to Sunday
  today.setDate(sunday);

  // Weekly Template
  let weekTemplate = document.getElementById("weekTemplate");
  let newDate = weekTemplate.content.cloneNode(true);
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const dateStr = "week-" + year + "-" + month + "-";
  let calendarDateClass = "";
  for (let i = 0; i < 7; i++) {
    let date = sunday + i;
    newDate.querySelector("." + dateClass[i]).textContent = date;
    calendarDateClass = dateStr + date.toString().padStart(2, "0");
    newDate.querySelector("." + dateClass[i]).classList.add(calendarDateClass);
  }
  document.getElementById("week").appendChild(newDate);
  monthlyScheduleQuery("week", year, month);
}
// set initial weekly calendar
displayWeek();

let toggleCalendarBtn = document.getElementById("toggleCalendar");
toggleCalendarBtn.addEventListener("click", () => {
  // toggle calendar
  let calendarTable = document.getElementById("calendarTable");
  calendarTable.classList.toggle("hidden");

  let weekTable = document.getElementById("weekTable");
  weekTable.classList.toggle("hidden");

  // change the label
  let arrowLabel = toggleCalendarBtn.querySelector("span");
  let monthlyViewText = "Change to monthly view";
  let weeklyViewText = "Change to weekly view";
  let arrowLabelText = arrowLabel.innerText;
  if (arrowLabelText == weeklyViewText) {
    arrowLabel.innerText = monthlyViewText;
  } else {
    arrowLabel.innerText = weeklyViewText;
  }

  // change the arrow's direction
  let arrowIcon = toggleCalendarBtn.querySelector("i");
  arrowIcon.classList.toggle("fa-chevron-up");
  arrowIcon.classList.toggle("fa-chevron-down");
});

function drawScheduleOnCaledar(elementId, schedule) {
  const baseView = document.getElementById(elementId);

  let prefix = "";
  if (elementId == "calendar") {
    prefix = "mon-";
  } else {
    prefix = "week-";
  }

  const scheduleDate = schedule.date;

  let calendarDates = baseView.querySelectorAll("." + prefix + scheduleDate);

  for (let calendarDate of calendarDates) {
    let calendarCell = calendarDate.parentElement;
    let scheduleElement = document.createElement("p");
    scheduleElement.textContent = schedule.title;
    scheduleElement.classList.add(
      "bg-[#386641]",
      "text-[#f2e8cf]",
      "w-full",
      "text-xs"
    );

    calendarCell.append(scheduleElement);
  }
}

async function monthlyScheduleQuery(elementId, year, month) {
  // get user uid from session
  const userUid = sessionStorage.getItem("uid");

  const yearMonthStr = year + "-" + month;

  // basic query
  const scheduleQuery = query(
    collection(db, "schedules"),
    and(
      where("userUid", "==", userUid),
      or(
        and(
          where("date", ">=", yearMonthStr),
          where("date", "<=", yearMonthStr + "\uf8ff")
        ),
        where("repeat", "!=", "none")
      )
    )
  );

  try {
    const querySnapshot = await getDocs(scheduleQuery);

    querySnapshot.forEach((doc) => {
      const schedule = doc.data();

      if (schedule.date.slice(5, 7) == month) {
        drawScheduleOnCaledar(elementId, schedule);
      }

      if (schedule.repeat != "none") {
        scheduleRepeat(elementId, schedule, year, month);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function getFirstDateOfDay(baseDay, firstDay, firstDate) {
  let targetDate = 0;
  if (baseDay >= firstDay) {
    targetDate = baseDay - firstDay + firstDate;
  } else if (baseDay == firstDay - firstDate) {
    targetDate = 7;
  } else {
    targetDate = baseDay - firstDay + baseDay;
  }

  return targetDate;
}

function scheduleRepeat(elementId, schedule, year, month) {
  const scheduleRepeatStr = schedule.repeat;
  let scheduleDate = new Date(schedule.date);
  scheduleDate.setDate(scheduleDate.getDate() + 1);
  const scheduleDay = scheduleDate.getDay();

  let targetDate = new Date(schedule.date);
  targetDate.setDate(scheduleDate.getDate() + 1);
  targetDate.setFullYear(year);
  targetDate.setMonth(month - 1);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const firstDate = new Date(year, month - 1, 1).getDate();
  const lastDate = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth() + 1,
    0
  ).getDate();

  let newSchedule = structuredClone(schedule);
  let repeatedDate = year + "-" + month + "-";

  if (scheduleRepeatStr == "monthly") {
    repeatedDate += targetDate.getDate();
    newSchedule.date = repeatedDate;

    if (repeatedDate != schedule.date) {
      drawScheduleOnCaledar(elementId, newSchedule);
    }
  } else if (scheduleRepeatStr == "biweekly") {
    let baseDate = getFirstDateOfDay(scheduleDay, firstDay, firstDate);
    targetDate.setDate(baseDate);

    let biweekDiff = Math.ceil(
      Math.abs(targetDate - scheduleDate) / (14 * 24 * 60 * 60 * 100)
    );

    if (biweekDiff % 10 != 0) {
      baseDate += 7;
    }

    for (let i = baseDate; i <= lastDate; i += 14) {
      targetDate.setDate(i);

      repeatedDate =
        year +
        "-" +
        month +
        "-" +
        targetDate.getDate().toString().padStart(2, "0");

      newSchedule.date = repeatedDate;
      if (repeatedDate != schedule.date) {
        drawScheduleOnCaledar(elementId, newSchedule);
      }
    }
  } else if (scheduleRepeatStr == "weekly") {
    let basedate = getFirstDateOfDay(scheduleDay, firstDay, firstDate);

    for (let i = basedate; i <= lastDate; i += 7) {
      targetDate.setDate(i);
      repeatedDate =
        year +
        "-" +
        month +
        "-" +
        targetDate.getDate().toString().padStart(2, "0");

      newSchedule.date = repeatedDate;
      if (repeatedDate != schedule.date) {
        drawScheduleOnCaledar(elementId, newSchedule);
      }
    }
  } else {
    for (let i = 1; i <= lastDate; i++) {
      targetDate.setDate(i);
      repeatedDate =
        year +
        "-" +
        month +
        "-" +
        targetDate.getDate().toString().padStart(2, "0");

      newSchedule.date = repeatedDate;
      if (repeatedDate != schedule.date) {
        drawScheduleOnCaledar(elementId, newSchedule);
      }
    }
  }
}
