// Import specific functions from the Firebase Auth SDK
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
  constructor() {
    super();
    this.renderNavbar();
  }

  renderNavbar() {
    this.innerHTML = `
            <!-- Navbar: single source of truth -->
            <nav class="flex justify-between w-full md:bg-[#386641] md:px-10 text-[#f2e8cf]">
              <div class="shrink-0 px-10 py-5">
                <a href="/index.html"><img class="shrink-0 w-[60px] h-[60px]" src="/images/placeholder_logo.png" /></a>
              </div>
              <div class="flex bg-[#386641] justify-around w-full fixed z-10 bottom-0 md:static md:top-0 md:px-20">
                <div class="mx-4 my-10">
                  <a href="/src/pages/recycleInfo.html">Recycle</a>
                </div>
                <div class="mx-4 my-10">
                  <a href="/src/pages/map.html">Map</a>
                </div>
                <div class="mx-4 my-10">
                  <a href="/src/pages/faq.html">FAQ</a>
                </div>
              </div>
              <div class="flex mx-5 my-8 md:my-10 md:mx-0">
                <div class="text-[#386641] md:text-[#f2e8cf] my-auto align-middle mr-2">
                  <a href="/src/pages/recyclingForm.html">Log</a>
                </div>
                <div class="text-[#386641] md:text-[#f2e8cf] my-auto align-middle mr-2">
                  <a href="/src/pages/leaderboard.html">Leaderboard</a>
                </div>
                <div id="authControls" class="flex bg-[#386641] items-center rounded-full w-18">
                  <a class="w-full text-center text-[#f2e8cf]" href="/login.html">Login</a>
                </div>
              </div>
            </nav>
            `;
    
    this.renderAuthControls();
  }

  renderAuthControls() {
    const authControls = this.querySelector("#authControls");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        authControls.innerHTML = `<a id="signOutBtn" class="w-full text-center text-[#f2e8cf]">Log out</a>`;
        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn?.addEventListener("click", logoutUser);
      } else if (window.location.pathname.includes("login.html") || window.location.pathname.includes("profile.html")) {
        authControls.innerHTML = "";
        authControls.classList.add("hidden")
      } else {
        authControls.innerHTML = `<a class="bg-[#386641] text-[#f2e8cf] rounded-full px-4 py-2" href="./login.html">Login</a>`;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
