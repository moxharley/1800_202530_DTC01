import { onAuthReady } from "./authentication.js"

function initAuthUI() {
  onAuthReady(async (user) => {
    if (!user) {
      location.href = "loginSignup.html";
      return;
    } else {
      let dropdowns = document.getElementsByClassName("dropdown");

      for (let dropdown of dropdowns) {
        dropdown.addEventListener("click", () => {
          let arrowIcon = dropdown.querySelector("i");
          arrowIcon.classList.toggle("fa-angle-down");
          arrowIcon.classList.toggle("fa-angle-up");

          let dropdownContents = dropdown.nextSibling.nextSibling;
          dropdownContents.classList.toggle("hidden!");
        });
      }
    }
  });
}


document.addEventListener('DOMContentLoaded', initAuthUI);
