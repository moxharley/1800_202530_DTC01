import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, getDocs, addDoc } from "firebase/firestore";

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

        let scheduleTemplate = document.getElementById("scheduleTemplate");
        const scheduleCollectionRef = collection(db, "schedules");

        const querySnapshot = await getDocs(scheduleCollectionRef);

        querySnapshot.forEach((doc) => {
          let newSchedule = scheduleTemplate.content.cloneNode(true);
          const schedule = doc.data();

          if (userUid === schedule.userUid) {
            newSchedule.querySelector("#title").textContent = schedule.title;
            newSchedule.querySelector("#memo").textContent = schedule.memo;
            newSchedule.querySelector("#date").textContent = schedule.date;
            newSchedule.querySelector("#time").textContent = schedule.time;

            document.getElementById("schedulesDiv").appendChild(newSchedule);
          }
        });
      } catch (error) {
        let errorHtml = `<div class="font-bold text-center">Nothing to display</div>`;
        document.getElementById("schedulesDiv").innerHTML = errorHtml;
      }
    }
  });
}
displayScheduleDynamically();
