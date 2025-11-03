// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
    this.renderAuthControls();
  }

  renderNavbar() {
    this.innerHTML = `
            <!-- Navbar: single source of truth -->
            <nav class="flex justify-between w-full md:bg-[#386641] md:px-10 text-[#f2e8cf]">
              <div class="shrink-0 px-10 py-5">
                <a href="/index.html"><img class="shrink-0 w-[60px] h-[60px]" src="/images/placeholder_logo.png" /></a>
              </div>
              <div class="flex bg-[#386641] justify-around w-full fixed z-10 bottom-0 md:static md:top-0 md:px-20">
                <div class="mx-4 my-10 text-center">
                  <a href="/src/pages/recycleInfo.html">
                  <div class="md:hidden">
                  <i class="fa-solid fa-recycle text-3xl"></i>
                  </div>
                  <p>Recycle</p>
                  </a>
                </div>
                <div class="mx-4 my-10 text-center">
                  <a href="/src/pages/map.html">
                  <div class="md:hidden">
                  <i class="fa-solid fa-map text-3xl"></i>
                  </div>
                  <p>Map</p>
                  </a>
                </div>
                <div class="mx-4 my-10 text-center">
                  <a href="/src/pages/faq.html">
                  <div class="md:hidden">
                  <i class="fa-regular fa-circle-question text-3xl"></i>
                  </div>
                  <p>FAQ</p>
                  </a>
                </div>
              </div>
              <div class="flex mx-5 my-8 md:my-10 md:mx-0">
                <div class="text-[#386641] md:text-[#f2e8cf] my-auto align-middle">
                  <a href="/src/pages/leaderboard.html">
                  <i class="fa-solid fa-ranking-star md:text-2xl text-3xl"></i>
                  </a>
                </div>
                <div id="userDropdown" class="group text-[#386641] md:text-[#f2e8cf] my-auto align-middle ml-5 md:mr-0 mr-5 relative">
                  <i class="fa-solid fa-user md:text-2xl text-3xl hover:cursor-pointer"></i>
                  <div id="dropdownContents" class="group-hover:block hidden bg-[#6a994e] text-[#f2e8cf] rounded-b absolute md:min-w-[100px] min-w-[60px] z-10 md:mt-10 md:-ml-15 -ml-12 md:text-center text-right">
                    <a class="block p-2 hover:bg-[#386641]" href="/src/pages/recyclingForm.html">Log</a>
                    <a class="block p-2 hover:bg-[#386641]" href="/src/pages/calendar.html">Calendar</a>
                    <a class="block p-2 hover:bg-[#386641]" href="/src/pages/profile.html">Profile</a>
                    <a class="block p-2 hover:bg-[#386641] rounded-b" id="signOutBtn" href="#">Log out</a>
                  </div>
                </div>
                <div id="authControls" class="flex bg-[#386641] items-center rounded-full w-18">
                  <a class="w-full text-center text-[#f2e8cf]" href="/login.html">Login</a>
                </div>
              </div>
            </nav>
            `;
  }

  renderAuthControls() {
    const authControls = this.querySelector("#authControls");
    const userDropdown = document.getElementById("userDropdown");
    const dropdownContents = document.getElementById("dropdownContents");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // authControls.innerHTML = `<a id="signOutBtn" class="w-full text-center text-[#f2e8cf] hover:cursor-pointer">Log out</a>`;
        const signOutBtn = this.querySelector("#signOutBtn");
        signOutBtn?.addEventListener("click", logoutUser);

        userDropdown.addEventListener("click", () => {
          dropdownContents.classList.toggle("hidden");
        });

        authControls.classList.add("hidden");
        userDropdown.classList.remove("hidden");
      } else if (
        window.location.pathname.includes("login.html") ||
        window.location.pathname.includes("profile.html")
      ) {
        authControls.innerHTML = "";
        authControls.classList.add("hidden");
        userDropdown.classList.add("hidden");
      } else {
        authControls.innerHTML = `<a class="w-full text-center text-[#f2e8cf]" href="/login.html">Login</a>`;
        userDropdown.classList.add("hidden");
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
