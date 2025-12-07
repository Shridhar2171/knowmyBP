class CustomHeader extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
      .neon-heart {
  width: 30px;
  height: 30px;
  fill: #ff2d55;
  filter: drop-shadow(0 0 6px #ff6b81);
  animation: neonPulse 1.6s infinite ease-in-out;
}

@keyframes neonPulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 8px #ff6b81);
  }
  50% {
    transform: scale(1.25);
    filter: drop-shadow(0 0 14px #ff2d55);
  }
}

        :host { all: initial; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
        .header {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1200;
        }
        .nav-link {
          transition: all 0.28s ease;
          cursor: pointer;
          color: inherit;
          text-decoration: none;
        }
        .nav-link:hover {
          transform: translateY(-2px);
          text-shadow: 0 2px 4px rgba(0,0,0,0.18);
          color: #fcd34d !important;
        }

        /* Sidebar (mobile only) */
        .sidebar {
          position: fixed;
          top: 0;
          left: -280px;
          width: 280px;
          height: 100%;
          background: #4f46e5;
          padding: 28px;
          color: white;
          box-shadow: 6px 0 18px rgba(0,0,0,0.18);
          z-index: 2000;
          transition: left 0.36s cubic-bezier(.2,.8,.2,1);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .sidebar.open { left: 0; }

        .sidebar h2 { margin: 0 0 18px 0; font-size: 20px; }
        .sidebar a {
          display: block;
          padding: 12px 0;
          font-size: 17px;
          font-weight: 600;
          color: rgba(255,255,255,0.95);
          text-decoration: none;
          transition: transform .18s ease, color .18s ease;
        }
        .sidebar a:hover { color: #fcd34d; transform: translateX(6px); }

        /* Overlay */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.42);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.28s ease, visibility 0.28s ease;
          z-index: 1500;
        }
        .overlay.show {
          opacity: 1;
          visibility: visible;
        }

        /* Hide sidebar & overlay on medium+ screens (desktop) */
        @media (min-width: 768px) {
          .sidebar { display: none !important; }
          .overlay { display: none !important; }
        }

        /* Make sure header nav shows on desktop and the hamburger hides */
        .menu-button { background: none; border: none; color: inherit; cursor: pointer; }
        @media (min-width: 768px) {
          .menu-button { display: none; }
        }

        /* small container tweaks so header doesn't create extra left bar */
        .header-inner { max-width: 1200px; margin: 0 auto; padding: 18px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      </style>

      <header class="header">
        <div class="flex items-center space-x-3">
    <svg class="neon-heart" viewBox="0 0 24 24">
        <path d="M12 21C12 21 4 13.84 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.84 16 21 16 21H12Z"/>
    </svg>
    <h1 class="text-2xl font-bold">know my BP</h1>
</div>


          <nav class="desktop-nav" style="display:none;">
            <a href="/" class="nav-link" style="margin-right:18px">Home</a>
            <a href="/about" class="nav-link" style="margin-right:18px">About</a>
            <a href="/resources" class="nav-link" style="margin-right:18px">Resources</a>
            <a href="/contact" class="nav-link">Contact</a>
          </nav>

          <button id="menuBtn" class="menu-button" aria-label="Open menu">
            <i data-feather="menu"></i>
          </button>
        </div>
      </header>

      <!-- Sidebar (mobile) -->
      <div id="sidebar" class="sidebar" role="navigation" aria-hidden="true">
        <h2><i data-feather="menu" style="margin-right:8px;"></i> Menu</h2>
        <a href="/" class="s-link">Home</a>
        <a href="/about" class="s-link">About</a>
        <a href="/resources" class="s-link">Resources</a>
        <a href="/contact" class="s-link">Contact</a>
      </div>

      <!-- Overlay -->
      <div id="overlay" class="overlay"></div>
    `;

    // Show desktop nav using JS (keeps template small)
    // desktop nav shown only when viewport >= 768px
    const desktopNav = this.shadowRoot.querySelector('.desktop-nav');
    const checkDesktop = () => {
      if (window.matchMedia && window.matchMedia('(min-width:768px)').matches) {
        desktopNav.style.display = 'block';
      } else {
        desktopNav.style.display = 'none';
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    // Sidebar toggle logic
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const overlay = this.shadowRoot.getElementById('overlay');
    const menuBtn = this.shadowRoot.getElementById('menuBtn');

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('show');
      sidebar.setAttribute('aria-hidden', 'false');
      // prevent background scroll when sidebar open
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      sidebar.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);

    // close when clicking any sidebar link (so mobile nav navigates smoothly)
    this.shadowRoot.querySelectorAll('.s-link').forEach(a => {
      a.addEventListener('click', () => {
        closeSidebar();
        // allow navigation to proceed (link is regular href)
      });
    });

    // Render feather icons inside this shadow root
    // feather must be globally available on page (script included in index)
    if (window.feather && typeof window.feather.replace === 'function') {
      // replace icons inside shadow root by injecting SVG manually
      // feather.replace can't target shadowRoot directly, so we get SVG strings and place them

      // small helper: get svg by name
      const icons = ['heart','menu'];
      icons.forEach(name => {
        const el = this.shadowRoot.querySelector(`i[data-feather="${name}"]`);
        if (!el) return;
        try {
          const svgString = window.feather.icons[name].toSvg({ width: 20, height: 20, stroke: 'white' });
          el.outerHTML = svgString;
        } catch (e) {
          // fallback: leave the <i> element
        }
      });
    }
  }
}

customElements.define('custom-header', CustomHeader);
