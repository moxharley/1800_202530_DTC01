import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

function initilize() {
  initialSchedules();

  let editBtn = document.getElementById("editBtn");
  editBtn.addEventListener("click", editSchedule);

  let delBtn = document.getElementById("delBtn");
  delBtn.addEventListener("click", deleteSchedule);
}
initilize();

function removeByClassName(className) {
  let temp = document.getElementsByClassName(className);
  if (temp) {
    for (let i = temp.length - 1; i >= 0; i--) {
      temp[i].remove();
    }
  }
}

function drawSchedule(scheduleId, schedule) {
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
  const schedulesNum = baseQuerySnapshot.docs.length;

  let maxIndex = scheduleIndex + onePageSchedule;

  if (maxIndex > schedulesNum) {
    maxIndex = schedulesNum;
  }

  for (let i = scheduleIndex; i < maxIndex; i++) {
    const schedule = baseQuerySnapshot.docs[i].data();
    drawSchedule(baseQuerySnapshot.docs[i].id, schedule);
  }

  // add click event for memo tooltip
  let scheduleDivs = document.getElementsByClassName("schedule");

  for (let scheduleDiv of scheduleDivs) {
    scheduleDiv.addEventListener("click", () => {
      scheduleDiv.querySelector("#memoDiv").classList.toggle("hidden");
    });
  }

  return schedulesNum;
}

function makePageArrows() {
  let prevBtn = document.createElement("button");
  prevBtn.classList.add("pageBtns", "hover:cursor-pointer");
  prevBtn.id = "prevPage";

  let prevIcon = document.createElement("i");
  prevIcon.classList.add("fa-solid", "fa-chevron-left");
  prevBtn.appendChild(prevIcon);

  let nextBtn = document.createElement("button");
  nextBtn.classList.add("pageBtns", "hover:cursor-pointer");
  nextBtn.id = "nextPage";

  let nextIcon = document.createElement("i");
  nextIcon.classList.add("fa-solid", "fa-chevron-right");
  nextBtn.appendChild(nextIcon);

  const pageNumDiv = document.getElementById("pageNumDiv");
  pageNumDiv.before(prevBtn);
  pageNumDiv.after(nextBtn);
}

function drawSchedulePagination(
  userUid,
  currentPage,
  onePageSchedule,
  maxSchedules
) {
  // total schedules
  const totalPage = Math.ceil(maxSchedules / onePageSchedule);

  let pageTemplate = document.getElementById("pageNumTemplate");

  // setting numbers
  let onePageMaxNum = 5;
  let pageIndexStart = currentPage - 1;
  if (totalPage <= onePageMaxNum) {
    onePageMaxNum = totalPage;
    pageIndexStart = 0;
  } else if (totalPage - currentPage < onePageMaxNum) {
    pageIndexStart = totalPage - onePageMaxNum;
  }

  // draw page numbers
  for (let i = pageIndexStart; i < pageIndexStart + onePageMaxNum; i++) {
    let newPage = pageTemplate.content.cloneNode(true);
    newPage.querySelector(".pageNum").textContent = i + 1;
    newPage.querySelector(".pageNum").id = i + 1;
    document.getElementById("pageNumDiv").appendChild(newPage);
  }

  // add focussing CSS
  let focusedPage = document.getElementById(currentPage);
  let siblings = document.getElementById("pageNumDiv").children;

  for (let sibling of siblings) {
    sibling.classList.add("text-[#6a994e]");
    sibling.classList.remove("font-bold");
  }
  focusedPage.classList.remove("text-[#6a994e]");
  focusedPage.classList.add("font-bold");

  // add click event for pages
  let pageNums = document.getElementsByClassName("pageNum");
  for (let pageNum of pageNums) {
    pageNum.addEventListener(
      "click",
      async (self) => {
        currentPage = parseInt(self.target.id);

        removeByClassName("schedule");
        removeByClassName("pageNum");
        removeByClassName("pageBtns");

        drawSchedulePagination(
          userUid,
          currentPage,
          onePageSchedule,
          maxSchedules
        );

        try {
          await scheduleQuery(userUid, onePageSchedule, currentPage);
        } catch (error) {
          console.log(error);
        }
      },
      { once: true }
    );
  }

  // make arrow btns
  makePageArrows();

  // add click event for arrow btns
  let pageArrows = document.getElementsByClassName("pageBtns");
  for (let pageArrow of pageArrows) {
    pageArrow.addEventListener("click", async (self) => {
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

      removeByClassName("schedule");
      removeByClassName("pageNum");
      removeByClassName("pageBtns");

      drawSchedulePagination(
        userUid,
        currentPage,
        onePageSchedule,
        maxSchedules
      );

      try {
        await scheduleQuery(userUid, onePageSchedule, currentPage);
      } catch (error) {
        console.log(error);
      }
    });
  }
}

async function initialSchedules() {
  // get user's uid
  const userUid = sessionStorage.getItem("uid");
  const onePageSchedule = 5;
  try {
    const maxSchedules = await scheduleQuery(userUid, onePageSchedule, 1);
    drawSchedulePagination(userUid, 1, onePageSchedule, maxSchedules);
  } catch (error) {
    console.log(error);
    let errorHtml = `<div class="font-bold text-center">Nothing to display</div>`;
    document.getElementById("schedulesDiv").innerHTML = errorHtml;
  }
}

// canceling edit or delete
function addCancelBtn() {
  // create cancle btn
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

  // remove radio or checkboxes
  cancelBtn.addEventListener("click", () => {
    let scheduleLists = document.getElementsByName("scheduleList");
    for (let i = scheduleLists.length - 1; i >= 0; i--) {
      scheduleLists[i].remove();
    }
    cancelBtn.remove();
  });
}

function editSchedule() {
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
}

async function deleteSchedule() {
  // check if the buttons are activated
  let checkBoxes = document.querySelectorAll("input[type='checkbox']");
  let radios = document.querySelectorAll("input[type='radio']");

  if (checkBoxes.length) {
    // user choose to delete the schedule
    let checkedIds = [];
    for (let checkBox of checkBoxes) {
      if (checkBox.checked) {
        // get document id from the div id
        let scheduleId = checkBox.nextSibling.nextSibling.id;
        checkedIds.push(scheduleId);
      }
    }

    if (checkedIds.length != 0) {
      if (confirm("Do you want delete?") == true) {
        try {
          // delete the schedule and refresh the page
          for (let checkedId of checkedIds) {
            await deleteDoc(doc(db, "schedules", checkedId));
          }
          location.reload();
        } catch (error) {
          console.log(error);
          alert("Sorry, something went wrong :(");
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
}
