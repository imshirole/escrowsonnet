/**
 * js/app.js — Public marketing site logic for index.html only.
 * Controls FAQ accordions, modals, auth navigation, form validation,
 * and native login page redirect. No dashboard DOM references.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ── DOM refs (index.html only) ── */
  const homepageContent    = document.getElementById('homepage-content');
  const aboutUsContent     = document.getElementById('about-us-content');
  const industriesContent  = document.getElementById('industries-content');
  const pricingContent     = document.getElementById('pricing-content');
  const collateralContent  = document.getElementById('collateral-content');
  const authContent        = document.getElementById('auth-content');

  const personaSelectionView    = document.getElementById('persona-selection-view');
  const registerSelectionView   = document.getElementById('register-selection-view');
  const vendorSigninView        = document.getElementById('vendor-signin-view');
  const buyerSigninView         = document.getElementById('buyer-signin-view');
  const vendorRegisterView      = document.getElementById('vendor-register-view');
  const buyerRegisterView       = document.getElementById('buyer-register-view');

  const allMainViews = [
    homepageContent, aboutUsContent, industriesContent,
    pricingContent, collateralContent, authContent
  ];
  const allAuthSubViews = [
    personaSelectionView, registerSelectionView,
    vendorSigninView, buyerSigninView,
    vendorRegisterView, buyerRegisterView
  ];

  /* ── Helpers ── */
  function showSection(section) {
    allMainViews.forEach(function (el) {
      if (el) el.classList.add('hidden');
    });
    if (section) {
      section.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function hideAllAuthSubViews() {
    allAuthSubViews.forEach(function (v) {
      if (v) v.classList.add('hidden');
    });
  }

  /* ── Main page nav links ── */
  var navMap = {
    'nav-home':        homepageContent,
    'nav-about':       aboutUsContent,
    'nav-collateral':  collateralContent,
    'nav-industries':  industriesContent,
    'nav-pricing':     pricingContent,
  };

  Object.keys(navMap).forEach(function (id) {
    var desktop = document.getElementById(id);
    var mobile  = document.getElementById(id + '-mobile');
    var target  = navMap[id];

    function handler(e) {
      e.preventDefault();
      showSection(target);
    }
    if (desktop) desktop.addEventListener('click', handler);
    if (mobile)  mobile.addEventListener('click', handler);
  });

  /* ── Login / Start Escrow header triggers ── */
  function setupHeaderTrigger(linkId, showViewFn) {
    var desktop = document.getElementById(linkId);
    var mobile  = document.getElementById(linkId + '-mobile');

    function handler(e) {
      e.preventDefault();
      showViewFn();
    }
    if (desktop) desktop.addEventListener('click', handler);
    if (mobile)  mobile.addEventListener('click', handler);
  }

  setupHeaderTrigger('nav-login', function () {
    showSection(authContent);
    hideAllAuthSubViews();
    if (personaSelectionView) personaSelectionView.classList.remove('hidden');
  });

  setupHeaderTrigger('nav-start-escrow', function () {
    showSection(authContent);
    hideAllAuthSubViews();
    if (registerSelectionView) registerSelectionView.classList.remove('hidden');
  });

  /* ── Auth sub-view toggling ── */
  function authToggle(btnId, hideView, showView) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (hideView) hideView.classList.add('hidden');
      if (showView) showView.classList.remove('hidden');
    });
  }

  authToggle('select-vendor-btn',    personaSelectionView, vendorSigninView);
  authToggle('select-buyer-btn',     personaSelectionView, buyerSigninView);
  authToggle('go-to-vendor-register', vendorSigninView,    vendorRegisterView);
  authToggle('go-to-buyer-register',  buyerSigninView,     buyerRegisterView);
  authToggle('reg-vendor-opt-btn',   registerSelectionView, vendorRegisterView);
  authToggle('reg-buyer-opt-btn',    registerSelectionView, buyerRegisterView);
  authToggle('go-back-to-vendor-signin', vendorRegisterView, vendorSigninView);
  authToggle('go-back-to-buyer-signin',  buyerRegisterView,  buyerSigninView);

  /* ── Vendor Login → native page jump ── */
  var vendorLoginBtn = document.getElementById('vendor-login-submit');
  if (vendorLoginBtn) {
    vendorLoginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'vendordashboard.html';
    });
  }

  /* ── Vendor Registration form validation ── */
  var vendorRegisterForm = document.getElementById('vendor-register-form');
  if (vendorRegisterForm) {
    vendorRegisterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = document.querySelectorAll('.web-presence-field');
      var filled = Array.from(fields).some(function (f) { return f.value.trim() !== ''; });
      var card   = document.getElementById('web-presence-card');

      if (!filled) {
        if (card) {
          card.classList.remove('border-brand-border');
          card.classList.add('border-red-500');
        }
        alert('Validation Error: You must provide at least one web presence channel (Website, LinkedIn, X, Facebook, or WeChat) for compliance verification.');
      } else {
        if (card) {
          card.classList.add('border-brand-border');
          card.classList.remove('border-red-500');
        }
        alert('Registration successful! Please check your email to verify your account.');
      }
    });
  }

  /* ── Create Order form ── */
  var createOrderForm = document.getElementById('create-order-form');
  if (createOrderForm) {
    createOrderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Your escrow order request has been received. Our team will follow up with your custom transaction details.');
    });
  }

  /* ── Track Order form ── */
  var trackOrderForm = document.getElementById('track-order-form');
  if (trackOrderForm) {
    trackOrderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var spinner = document.getElementById('track-spinner');
      if (spinner) {
        spinner.classList.remove('hidden');
        setTimeout(function () { spinner.classList.add('hidden'); }, 1200);
      }
      alert('Tracking request submitted. If the deal exists, details will be loaded shortly.');
    });
  }

  /* ── Modal open / close (delegated) ── */
  document.body.addEventListener('click', function (e) {
    var openTrigger  = e.target.closest('[data-open-modal]');
    var closeTrigger = e.target.closest('[data-close-modal]');

    if (openTrigger) {
      e.preventDefault();
      var modal = document.getElementById(openTrigger.dataset.openModal);
      if (modal) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      return;
    }

    if (closeTrigger) {
      e.preventDefault();
      var modalEl = closeTrigger.closest('[id$="-modal"]');
      if (modalEl) {
        modalEl.classList.add('hidden');
        modalEl.setAttribute('aria-hidden', 'true');
      }
      return;
    }
  });

  /* ── FAQ accordion toggle ── */
  document.body.addEventListener('click', function (e) {
    var faqBtn = e.target.closest('[data-faq-toggle]');
    if (!faqBtn) return;
    e.preventDefault();

    var content = faqBtn.nextElementSibling;
    var icon    = faqBtn.querySelector('i');
    if (!content) return;

    var isCollapsed = content.classList.contains('max-h-0');
    if (isCollapsed) {
      content.classList.remove('max-h-0');
      content.style.maxHeight = content.scrollHeight + 'px';
      if (icon) icon.classList.add('rotate-180');
    } else {
      content.style.maxHeight = '0';
      content.classList.add('max-h-0');
      if (icon) icon.classList.remove('rotate-180');
    }
  });

  /* ── Policy alert links ── */
  document.querySelectorAll('.js-policy-alert').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var msg = el.dataset.alertMessage || 'Please review this policy for further details.';
      alert(msg);
    });
  });
});