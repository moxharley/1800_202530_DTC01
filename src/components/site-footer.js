class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <!-- Footer: single source of truth -->
            <footer class="mx-16 md:pt-50 pt-25 pb-5 text-[#6a994e] text-center">
                <p class="text-muted">&copy; 2025 BCIT COMP1800 DTC01</p>
            </footer>
        `;
  }
}

customElements.define("site-footer", SiteFooter);
