import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  // check if user logged in
  onAuthReady((user) => {
    if (!user) {
      location.href = "/src/pages/loginSignup.html";
    } else {
      sessionStorage.setItem("uid", user.uid);
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

  // check if the storage have the doc ID
  if (localStorage.getItem("scheduleDocId")) {
    displayScheduleData();
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
});

// make each input constant
const scheduleTitle = document.getElementById("title");
const scheduleDate = document.getElementById("date");
const scheduleTime = document.getElementById("time");
const scheduleMemo = document.getElementById("memo");
const scheduleRepeatString = document.getElementById("repeat");

function emptyTitleAlert() {
  scheduleTitle.focus();
  scheduleTitle.classList.add("outline-2", "outline-[#bc4749]");
  let alertDiv = document.createElement("div");
  alertDiv.classList.add("m-0", "p-0", "-mt-7", "text-[#bc4749]");
  let alertMsg = "Please fill out the title";
  alertDiv.innerText = alertMsg;
  scheduleTitle.after(alertDiv);
}

function emptyDateAlert() {
  scheduleDate.focus();
  scheduleDate.classList.add("outline-2", "outline-[#bc4749]");
  let alertDiv = document.createElement("div");
  alertDiv.classList.add("m-0", "p-0", "-mt-2", "text-[#bc4749]");
  let alertMsg = "Please select date";
  alertDiv.innerText = alertMsg;
  scheduleDate.after(alertDiv);
}

// add new schedule
async function addScheduleData() {
  const userUid = sessionStorage.getItem("uid");

  let scheduleTitleValue = scheduleTitle.value;
  let scheduleDateValue = scheduleDate.value;
  let scheduleTimeValue = scheduleTime.value;
  let scheduleMemoValue = scheduleMemo.value;

  let scheduleRepeatStringValue = scheduleRepeatString.value;

  if (!scheduleTitleValue) {
    emptyTitleAlert();
  } else if (scheduleRepeatStringValue != "none" && !scheduleDateValue) {
    emptyDateAlert();
  } else {
    const scheduleRef = collection(db, "schedules");

    try {
      await addDoc(scheduleRef, {
        userUid: userUid,
        title: scheduleTitleValue,
        date: scheduleDateValue,
        time: scheduleTimeValue,
        repeat: scheduleRepeatStringValue,
        memo: scheduleMemoValue,
        timestamp: serverTimestamp(),
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
    scheduleRepeatString.value = schedule.repeat;
  } catch (error) {
    console.log(error);
    alert("Sorry, something went wrong :(");
  }
}

// update schedule data
async function updateScheduleData() {
  let scheduleTitleValue = scheduleTitle.value;
  let scheduleDateValue = scheduleDate.value;
  let scheduleTimeValue = scheduleTime.value;
  let scheduleMemoValue = scheduleMemo.value;

  let scheduleRepeatStringValue = scheduleRepeatString.value;

  const scheduleDocId = localStorage.getItem("scheduleDocId");
  const scheduleRef = doc(db, "schedules", scheduleDocId);

  if (!scheduleTitleValue) {
    emptyTitleAlert();
  } else if (scheduleRepeatStringValue != "none" && !scheduleDateValue) {
    emptyDateAlert();
  } else {
    try {
      await updateDoc(scheduleRef, {
        title: scheduleTitleValue,
        date: scheduleDateValue,
        time: scheduleTimeValue,
        repeat: scheduleRepeatStringValue,
        memo: scheduleMemoValue,
        timestamp: serverTimestamp(),
      });

      location.href = "/src/pages/calendar.html";
    } catch (error) {
      console.log(error);
      alert("Sorry, something went wrong :(");
    }
  }
}
