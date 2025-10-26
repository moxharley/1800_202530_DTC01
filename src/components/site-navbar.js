// Logic/Functionality not implemented yet, will need to be created and imported here

class SiteNavbar extends HTMLElement {
    constructor() {
        super();
        this.renderNavbar();
    }

    renderNavbar() {
        this.innerHTML = `
        <header>
            <nav class="flex justify-between w-full md:bg-[#386641] md:px-10">
                <div class="shrink-0 px-10 py-5">
                    <img class="shrink-0 w-[60px] h-[60px]" src="./images/placeholder_logo.png" />
                </div>
                <div class="flex bg-[#386641] justify-around w-full fixed bottom-0 md:static md:top-0 md:px-30">
                    <div class="mx-4 my-10">
                        <a class="text-[#f2e8cf]" href="#">Recycle</a>
                    </div>
                    <div class="mx-4 my-10">
                        <a class="text-[#f2e8cf]" href="#">Map</a>
                    </div>
                    <div class="mx-4 my-10">
                        <a class="text-[#f2e8cf]" href="#">Leaderboard</a>
                    </div>
                    <div class="mx-4 my-10">
                        <a class="text-[#f2e8cf]" href="#">FAQ</a>
                    </div>
                </div>
                <div class="flex bg-[#386641] items-center rounded-full w-18 mx-5 my-8 md:my-10 md:mx-4">
                    <a class="w-full pl-4 text-[#f2e8cf] md:text-[#f2e8cf]" href="#">Login</a>
                </div>
            </nav>
        </header>`;
    }
}

customElements.define('site-navbar', SiteNavbar)