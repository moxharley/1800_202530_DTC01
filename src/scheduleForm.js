import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, doc, addDoc, getDoc, updateDoc } from "firebase/firestore";

// check if user logged in
onAuthReady((user) => {
  if (!user) {
    alert("need to login");
    location.href = "/login.html";
    return;
  }
});

// back to previous page
let goBack = document.getElementById("backDiv");
goBack.addEventListener("click", () => {
  // if user leaves the page, remove the doc id from the local storage
  if (localStorage.getItem("scheduleDocId")) {
    localStorage.removeItem("scheduleDocId");
  }

  history.back();
});

// make each input constant
const scheduleTitle = document.getElementById("title");
const scheduleDate = document.getElementById("date");
const scheduleTime = document.getElementById("time");
const scheduleMemo = document.getElementById("memo");
const scheduleRepeatString = document.getElementById("repeat");

// add new schedule
async function addScheduleData() {
  const userUid = user.uid;
  let scheduleTitleValue = scheduleTitle.value;
  let scheduleDateValue = scheduleDate.value;
  let scheduleTimeValue = scheduleTime.value;
  let scheduleMemoValue = scheduleMemo.value;

  let scheduleRepeatStringValue = scheduleRepeatString.value;
  let scheduleRepeatInt = 0;

  if (scheduleRepeatStringValue === "daily") {
    scheduleRepeatInt = 1;
  } else if (scheduleRepeatStringValue === "weekly") {
    scheduleRepeatInt = 7;
  } else if (scheduleRepeatStringValue === "biweekly") {
    scheduleRepeatInt = 14;
  } else if (scheduleRepeatStringValue === "monthly") {
    scheduleRepeatInt = 30;
  }

  if (!scheduleTitleValue) {
    alert("title is empty");
  } else {
    const scheduleRef = collection(db, "schedules");

    try {
      await addDoc(scheduleRef, {
        userUid: userUid,
        title: scheduleTitleValue,
        date: scheduleDateValue,
        time: scheduleTimeValue,
        repeat: scheduleRepeatInt,
        memo: scheduleMemoValue,
      });
      location.href = "/src/pages/calendar.html";
    } catch (error) {
      console.log(error);
      alert("Sorry, something went wrong :(");
    }
  }
}

// display schedule to edit
async function displayScheduleData() {
  const scheduleDocId = localStorage.getItem("scheduleDocId");

  const scheduleDocRef = doc(db, "schedules", scheduleDocId);
  try {
    const scheduleDoc = await getDoc(scheduleDocRef);
    const schedule = scheduleDoc.data();

    scheduleTitle.value = schedule.title;
    scheduleDate.value = schedule.date;
    scheduleTime.value = schedule.time;
    scheduleMemo.value = schedule.memo;

    let scheduleRepeatInt = schedule.repeat;

    if (scheduleRepeatInt == 1) {
      scheduleRepeatString.value = "daily";
    } else if (scheduleRepeatInt == 7) {
      scheduleRepeatString.value = "weekly";
    } else if (scheduleRepeatInt == 14) {
      scheduleRepeatString.value = "biweekly";
    } else if (scheduleRepeatInt == 30) {
      scheduleRepeatString.value = "monthly";
    } else {
      scheduleRepeatString = "none";
    }
  } catch (error) {
    console.log(error);
    alert("Sorry, something went wrong :(");
  }
}

// check if the storage have the doc ID
if (localStorage.getItem("scheduleDocId")) {
  displayScheduleData();
}

// update schedule data
async function updateScheduleData() {
  let scheduleTitleValue = scheduleTitle.value;
  let scheduleDateValue = scheduleDate.value;
  let scheduleTimeValue = scheduleTime.value;
  let scheduleMemoValue = scheduleMemo.value;

  let scheduleRepeatStringValue = scheduleRepeatString.value;
  let scheduleRepeatInt = 0;

  if (scheduleRepeatStringValue === "daily") {
    scheduleRepeatInt = 1;
  } else if (scheduleRepeatStringValue === "weekly") {
    scheduleRepeatInt = 7;
  } else if (scheduleRepeatStringValue === "biweekly") {
    scheduleRepeatInt = 14;
  } else if (scheduleRepeatStringValue === "monthly") {
    scheduleRepeatInt = 30;
  }

  const scheduleDocId = localStorage.getItem("scheduleDocId");
  const scheduleRef = doc(db, "schedules", scheduleDocId);

  if (!scheduleTitleValue) {
    alert("title is empty");
  } else {
    try {
      await updateDoc(scheduleRef, {
        title: scheduleTitleValue,
        date: scheduleDateValue,
        time: scheduleTimeValue,
        repeat: scheduleRepeatInt,
        memo: scheduleMemoValue,
      });

      location.href = "/src/pages/calendar.html";
    } catch (error) {
      console.log(error);
      alert("Sorry, something went wrong :(");
    }
  }
}

document.getElementById("submit").addEventListener("click", () => {
  const scheduleDocId = localStorage.getItem("scheduleDocId");
  if (scheduleDocId) {
    updateScheduleData();
    // remove the doc id after editing
    localStorage.removeItem("scheduleDocId");
  } else {
    addScheduleData();
  }
});
