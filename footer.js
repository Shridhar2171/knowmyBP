class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .footer {
          background: linear-gradient(135deg, #6d28d9, #5b21b6);
          color: white;
        }
        .footer-link {
          transition: all 0.3s ease;
        }
        .footer-link:hover {
          color: #c4b5fd;
          transform: translateX(3px);
        }
      </style>
      <footer class="footer py-8 mt-12">
        <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-xl font-bold mb-4">BloodPressure Oracle</h3>
              <p class="text-indigo-100">Helping you monitor and understand your blood pressure for better health.</p>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Quick Links</h4>
              <ul class="space-y-2">
                <li><a href="#" class="footer-link">Home</a></li>
                <li><a href="#" class="footer-link">About</a></li>
                <li><a href="#" class="footer-link">Resources</a></li>
                <li><a href="#" class="footer-link">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Connect</h4>
              <div class="flex space-x-4">
                <a href="#" class="footer-link"><i data-feather="facebook"></i></a>
                <a href="#" class="footer-link"><i data-feather="twitter"></i></a>
                <a href="#" class="footer-link"><i data-feather="instagram"></i></a>
                <a href="#" class="footer-link"><i data-feather="linkedin"></i></a>
              </div>
              <p class="mt-4 text-indigo-100 text-sm">Disclaimer: This is for educational purposes only.</p>
            </div>
          </div>
          <div class="border-t border-indigo-400 mt-8 pt-6 text-center text-indigo-200">
            <p>&copy; ${new Date().getFullYear()} knowmyBP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);