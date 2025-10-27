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
                <img class="shrink-0 w-[60px] h-[60px]" src="./images/placeholder_logo.png" />
              </div>
              <div class="flex bg-[#386641] justify-around w-full fixed z-10 bottom-0 md:static md:top-0 md:px-30">
              <div class="mx-4 my-10">
                <a href="#">Recycle</a>
              </div>
              <div class="mx-4 my-10">
                <a href="#">Map</a>
              </div>
              <div class="mx-4 my-10">
                <a href="#">FAQ</a>
              </div>
              </div>
              <div class="flex mx-5 my-8 md:my-10 md:mx-4">
                <div class="text-[#386641] md:text-[#f2e8cf] my-auto align-middle mr-2">
                  <a href="#">Leaderboard</a>
                </div>
                <div class="flex bg-[#386641] items-center rounded-full w-18">
                  <a class="w-full text-center text-[#f2e8cf]" href="/login.html">Login</a>
                </div>
              </div>
            </nav>
            `;
  }

  renderAuthControls() {
    const authControls = this.querySelector("#authControls");

    // Initialize with invisible placeholder to maintain layout space
    authControls.innerHTML = `<div class="btn btn-outline-light" style="visibility: hidden; min-width: 80px;">Log out</div>`;

    onAuthStateChanged(auth, (user) => {
      let updatedAuthControl;
      if (user) {
        updatedAuthControl = `<button class="btn btn-outline-light" id="signOutBtn" type="button" style="min-width: 80px;">Log out</button>`;
        authControls.innerHTML = updatedAuthControl;
        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn?.addEventListener("click", logoutUser);
      } else {
        updatedAuthControl = `<a class="btn btn-outline-light" id="loginBtn" href="/login.html" style="min-width: 80px;">Log in</a>`;
        authControls.innerHTML = updatedAuthControl;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
