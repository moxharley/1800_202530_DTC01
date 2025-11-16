import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  limit,
  getCountFromServer,
  orderBy,
  startAt,
} from "firebase/firestore";

onAuthReady((user) => {
  if (!user) {
    location.href = "/src/pages/loginSignup.html";
  } else {
    sessionStorage.setItem("uid", user.uid);
  }
});

function drawSchedules(scheduleId, schedule) {
  // Schedule Template
  let scheduleTemplate = document.getElementById("scheduleTemplate");
  let newSchedule = scheduleTemplate.content.cloneNode(true);

  // set each data to the template
  newSchedule.querySelector(".group").id = scheduleId;
  newSchedule.querySelector("#memoTitle").textContent = schedule.title;

  if (schedule.title.length < 8) {
    newSchedule.querySelector("#title").textContent = schedule.title;
  } else {
    let titleStr = schedule.title;
    newSchedule.querySelector("#title").textContent =
      titleStr.slice(0, 7) + "...";
  }

  newSchedule.querySelector("#memo").textContent = schedule.memo;
  newSchedule.querySelector("#date").textContent = schedule.date;

  if (schedule.time) {
    newSchedule.querySelector("#time").textContent = schedule.time;
  } else {
    newSchedule.querySelector("#time").textContent = "";
    newSchedule.querySelector("#date").classList.add("mr-[46px]");
  }

  if (schedule.repeat === "none") {
    newSchedule.querySelector("#repeat").textContent = "";
  } else {
    newSchedule.querySelector("#repeat").textContent = schedule.repeat;
  }

  document.getElementById("schedulesDiv").appendChild(newSchedule);
}

async function scheduleQuery(userUid, onePageSchedule, currentPage) {
  // base schedule query for pagination
  const baseScheduleQuery = query(
    collection(db, "schedules"),
    where("userUid", "==", userUid),
    orderBy("timestamp", "desc")
  );

  const baseQuerySnapshot = await getDocs(baseScheduleQuery);
  const scheduleIndex = (currentPage - 1) * onePageSchedule;

  const lastVisible = baseQuerySnapshot.docs[scheduleIndex];

  // firestore query to compare uid
  const scheduleQuery = query(
    collection(db, "schedules"),
    where("userUid", "==", userUid),
    orderBy("timestamp", "desc"),
    startAt(lastVisible),
    limit(onePageSchedule)
  );

  const querySnapshot = await getDocs(scheduleQuery);

  querySnapshot.forEach((doc) => {
    const schedule = doc.data();
    drawSchedules(doc.id, schedule);
  });

  // add click event for memo tooltip
  let scheduleDivs = document.getElementsByClassName("schedule");

  for (let scheduleDiv of scheduleDivs) {
    scheduleDiv.addEventListener("click", () => {
      scheduleDiv.querySelector("#memoDiv").classList.toggle("hidden");
    });
  }
}

async function schedulePagination(userUid, onePageSchedule) {
  let currentPage = 1;

  const scheduleNumQuery = query(
    collection(db, "schedules"),
    where("userUid", "==", userUid)
  );
  const queryCount = await getCountFromServer(scheduleNumQuery);

  // total schedules
  const scheduleCount = queryCount.data().count;
  const totalPage = Math.ceil(scheduleCount / onePageSchedule);

  let pageTemplate = document.getElementById("pageNumTemplate");

  // draw page numbers
  let onePageMaxNum = 5;
  if (totalPage < 6) {
    onePageMaxNum = totalPage;
  }
  for (let i = 0; i < onePageMaxNum; i++) {
    let newPage = pageTemplate.content.cloneNode(true);
    newPage.querySelector(".pageNum").textContent = i + 1;
    newPage.querySelector(".pageNum").id = i + 1;
    document.getElementById("pageNumDiv").appendChild(newPage);
  }
  let focusedPage = document.getElementById("1");
  focusedPage.classList.remove("text-[#6a994e]");
  focusedPage.classList.add("font-bold");

  // add click event for pages
  let pageNums = document.getElementsByClassName("pageNum");
  for (let pageNum of pageNums) {
    pageNum.addEventListener("click", async (self) => {
      let temp = document.getElementsByClassName("schedule");
      if (temp) {
        for (let i = temp.length - 1; i >= 0; i--) {
          temp[i].remove();
        }
      }

      currentPage = parseInt(self.target.id);

      try {
        await scheduleQuery(userUid, onePageSchedule, currentPage);
      } catch (error) {
        console.log(error);
      }

      focusedPage = self.target;
      let siblings = focusedPage.parentElement.children;
      for (let sibling of siblings) {
        sibling.classList.add("text-[#6a994e]");
        sibling.classList.remove("font-bold");
      }

      focusedPage.classList.remove("text-[#6a994e]");
      focusedPage.classList.add("font-bold");
    });
  }

  // add click event for arrow btns
  let pageArrows = document.getElementsByClassName("pageBtn");
  for (let pageArrow of pageArrows) {
    pageArrow.addEventListener("click", async (self) => {
      let temp = document.getElementsByClassName("schedule");
      if (temp) {
        for (let i = temp.length - 1; i >= 0; i--) {
          temp[i].remove();
        }
      }

      let arrowId = self.target.parentElement.id;
      if (arrowId == "prevPage") {
        if (currentPage != 1) {
          currentPage -= 1;
        }
      } else {
        if (currentPage != totalPage) {
          currentPage += 1;
        }
      }
      try {
        await scheduleQuery(userUid, onePageSchedule, currentPage);
      } catch (error) {
        console.log(error);
      }

      focusedPage = document.getElementById(currentPage);
      let siblings = focusedPage.parentElement.children;
      for (let sibling of siblings) {
        sibling.classList.add("text-[#6a994e]");
        sibling.classList.remove("font-bold");
      }

      focusedPage.classList.remove("text-[#6a994e]");
      focusedPage.classList.add("font-bold");
    });
  }
}

async function displayScheduleDynamically() {
  try {
    // get user's uid
    const userUid = sessionStorage.getItem("uid");
    const onePageSchedule = 5;

    await schedulePagination(userUid, onePageSchedule);
    await scheduleQuery(userUid, onePageSchedule, 1);
  } catch (error) {
    console.log(error);
    let errorHtml = `<div class="font-bold text-center">Nothing to display</div>`;
    document.getElementById("schedulesDiv").innerHTML = errorHtml;
  }
}
displayScheduleDynamically();

function addCancelBtn() {
  let cancelBtn = document.createElement("button");
  cancelBtn.id = "cancleBtn";
  cancelBtn.classList.add(
    "mt-2",
    "w-full",
    "bg-[#bc4749]",
    "text-[#f2e8cf]",
    "px-1",
    "rounded",
    "hover:cursor-pointer"
  );
  cancelBtn.innerText = "Cancel";
  let scheduleDiv = document.getElementById("schedulesDiv");
  scheduleDiv.after(cancelBtn);

  cancelBtn.addEventListener("click", () => {
    let scheduleLists = document.getElementsByName("scheduleList");
    for (let i = scheduleLists.length - 1; i >= 0; i--) {
      scheduleLists[i].remove();
    }
    cancelBtn.remove();
  });
}

let editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", () => {
  // check if the buttons are activated
  let checkedRadio = document.querySelector("input[type='radio']:checked");
  let checkBoxes = document.querySelectorAll("input[type='checkbox']");

  if (checkedRadio) {
    // user choose to edit the schedule
    let scheduleId = checkedRadio.nextSibling.nextSibling.id;

    // to avoid doubled items in the local storage
    if (localStorage.getItem("scheduleDocId")) {
      localStorage.removeItem("scheduleDocId");
    }

    localStorage.setItem("scheduleDocId", scheduleId);
    location.href = "/src/pages/scheduleForm.html";
  } else if (checkBoxes.length) {
    // user clicked the delete first, then clicked the edit btn
    // so change the type of inputs
    for (let checkbox of checkBoxes) {
      checkbox.type = "radio";
    }
  } else {
    // user clicked the edit btn the first time
    let schedules = document.getElementsByClassName("schedule");

    // set radio button for selection
    for (let schedule of schedules) {
      schedule.classList.add("flex");
      schedule.firstChild.nextSibling.classList.add("basis7/8", "w-full");

      let radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "scheduleList";
      radio.classList.add("mr-1");
      schedule.prepend(radio);
    }
    addCancelBtn();
  }
});

let delBtn = document.getElementById("delBtn");
delBtn.addEventListener("click", async () => {
  // check if the buttons are activated
  let checkBoxes = document.querySelectorAll("input[type='checkbox']");
  let radios = document.querySelectorAll("input[type='radio']");

  if (checkBoxes.length) {
    // user choose to delete the schedule
    for (let checkBox of checkBoxes) {
      if (checkBox.checked) {
        // get document id from the div id
        let scheduleId = checkBox.nextSibling.nextSibling.id;
        if (confirm("Do you want delete?") == true) {
          try {
            // delete the schedule and refresh the page
            await deleteDoc(doc(db, "schedules", scheduleId));
            location.reload();
          } catch (error) {
            console.log(error);
            alert("Sorry, something went wrong :(");
          }
        }
      }
    }
  } else if (radios.length) {
    // user clicked the edit first, then clicked the delete btn
    // so change the type of inputs
    for (let radio of radios) {
      radio.type = "checkbox";
    }
  } else {
    // user clicked the delete btn the first time
    let schedules = document.getElementsByClassName("schedule");

    // set checkboxes for selection
    for (let schedule of schedules) {
      schedule.classList.add("flex");
      schedule.firstChild.nextSibling.classList.add("basis7/8", "w-full");

      let checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.name = "scheduleList";
      checkBox.classList.add("mr-1");
      schedule.prepend(checkBox);
    }
    addCancelBtn();
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
