/**
 * js/vendor.js — Standalone dashboard logic for vendordashboard.html only.
 * No references to '#homepage-content' or '#auth-content'.
 * Handles sidebar navigation between Overview, Work Orders, and Bulk Actions views,
 * fold toggles, lifecycle tabs, sign-out, and back-to-home redirects.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ── DOM refs for all content views ── */
  var overviewView         = document.getElementById('overview-view');
  var workOrdersView       = document.getElementById('work-orders-view');
  var bulkActionsView      = document.getElementById('bulk-actions-view');
  var proformaInvoicesView = document.getElementById('proforma-invoices-view');
  var billPaymentsView     = document.getElementById('bill-payments-view');
  var feeSimulatorView     = document.getElementById('fee-simulator-view');
  var directLinksView      = document.getElementById('direct-links-view');
  var buyerLookupView      = document.getElementById('buyer-lookup-view');
  var quoteRequestsView    = document.getElementById('quote-requests-view');
  var lenderLookupView     = document.getElementById('lender-lookup-view');
  var requestFinancingView = document.getElementById('request-financing-view');
  var repaymentsView       = document.getElementById('repayments-view');
  var fundedRepaymentsView = document.getElementById('funded-repayments-view');
  var proofExplorerView    = document.getElementById('proof-explorer-view');
  var messagesView         = document.getElementById('messages-view');
  var disputesView         = document.getElementById('disputes-view');
  var helpCenterView       = document.getElementById('help-center-view');
  var settingsView         = document.getElementById('settings-view');

  /* ── Centralized view switcher ── */
  function showView(targetId) {
    document.querySelectorAll('main > div[id$="-view"]').forEach(function (view) {
      view.classList.add('hidden');
    });
    document.getElementById(targetId + '-view')?.classList.remove('hidden');
  }

  /* ── Sidebar "Overview" link (inside vendor-submenu-dashboard) ── */
  var overviewLink = document.querySelector('#vendor-submenu-dashboard a');
  if (overviewLink) {
    overviewLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('overview');
    });
  }

  /* ── Sidebar "Work orders" link (inside vendor-submenu-orders) ── */
  var workOrdersLink = document.querySelector('#vendor-submenu-orders a');
  if (workOrdersLink) {
    workOrdersLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('work-orders');
    });
  }

  /* ── Sidebar "Bulk actions" link (inside vendor-submenu-orders) ── */
  var bulkActionsLink = document.querySelector('#vendor-submenu-orders a:nth-child(2)');
  if (bulkActionsLink) {
    bulkActionsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('bulk-actions');
    });
  }

  /* ── Sidebar "Proforma invoices" link (inside vendor-submenu-orders) ── */
  var proformaInvoicesLink = document.querySelector('#vendor-submenu-orders a:nth-child(3)');
  if (proformaInvoicesLink) {
    proformaInvoicesLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('proforma-invoices');
    });
  }

  /* ── Sidebar "Bill payments" link (inside vendor-submenu-finance) ── */
  var billPaymentsLink = document.querySelector('#vendor-submenu-finance a');
  if (billPaymentsLink) {
    billPaymentsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('bill-payments');
    });
  }

  /* ── Sidebar "Fee simulator" link (inside vendor-submenu-finance) ── */
  var feeSimulatorLink = document.querySelector('#vendor-submenu-finance a:nth-child(2)');
  if (feeSimulatorLink) {
    feeSimulatorLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('fee-simulator');
    });
  }

  /* ── Sidebar "Direct links" link (inside vendor-submenu-finance) ── */
  var directLinksLink = document.querySelector('#vendor-submenu-finance a:nth-child(3)');
  if (directLinksLink) {
    directLinksLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('direct-links');
      window.location.hash = 'direct-links-view';
    });
  }

  /* ── Sidebar "Buyer lookup" link (inside vendor-submenu-network) ── */
  var buyerLookupLink = document.querySelector('#vendor-submenu-network a');
  if (buyerLookupLink) {
    buyerLookupLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('buyer-lookup');
    });
  }

  /* ── Sidebar "Proof explorer" link (inside vendor-submenu-tools) ── */
  var proofExplorerLink = document.querySelector('#vendor-submenu-tools a');
  if (proofExplorerLink) {
    proofExplorerLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('proof-explorer');
    });
  }

  /* ── Sidebar "Messages" link (inside vendor-submenu-support) ── */
  var messagesLink = document.querySelector('#vendor-submenu-support a');
  if (messagesLink) {
    messagesLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('messages');
    });
  }

  /* ── Sidebar "Disputes" link (inside vendor-submenu-support) ── */
  var disputesLink = document.querySelector('#vendor-submenu-support a:nth-child(2)');
  if (disputesLink) {
    disputesLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('disputes');
    });
  }

  /* ── Sidebar "Help Center" link (inside vendor-submenu-support) ── */
  var helpCenterLink = document.querySelector('#vendor-submenu-support a:nth-child(3)');
  if (helpCenterLink) {
    helpCenterLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('help-center');
    });
  }

  /* ── Sidebar "Settings" link (inside vendor-submenu-account) ── */
  var settingsLink = document.querySelector('#vendor-submenu-account a');
  if (settingsLink) {
    settingsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('settings');
    });
  }

  /* ── Dispute form card toggle ── */
  var toggleFileDisputeBtn = document.getElementById('toggle-file-dispute-btn');
  var fileDisputeCard = document.getElementById('file-dispute-card');
  var cancelDisputeBtn = document.getElementById('cancel-dispute-btn');
  if (toggleFileDisputeBtn && fileDisputeCard) {
    toggleFileDisputeBtn.addEventListener('click', function () {
      fileDisputeCard.classList.toggle('hidden');
    });
  }
  if (cancelDisputeBtn && fileDisputeCard) {
    cancelDisputeBtn.addEventListener('click', function () {
      fileDisputeCard.classList.add('hidden');
    });
  }

  /* ── Support modal open / close controls ── */
  var openSupportModalBtn = document.getElementById('open-support-modal-btn');
  var supportModal = document.getElementById('support-modal');
  var closeSupportModalBtn = document.getElementById('close-support-modal-btn');
  var cancelSupportBtn = document.getElementById('cancel-support-btn');

  if (openSupportModalBtn && supportModal) {
    openSupportModalBtn.addEventListener('click', function () {
      supportModal.classList.remove('hidden');
    });
  }

  function closeSupportModal() {
    if (supportModal) supportModal.classList.add('hidden');
  }

  if (closeSupportModalBtn) closeSupportModalBtn.addEventListener('click', closeSupportModal);
  if (cancelSupportBtn) cancelSupportBtn.addEventListener('click', closeSupportModal);
  if (supportModal) {
    supportModal.addEventListener('click', function (e) {
      if (e.target === supportModal) closeSupportModal();
    });
  }

  /* ── Help Center actions and FAQ accordion ── */
  var helpContactSupportBtn = document.getElementById('help-contact-support-btn');
  var helpFileDisputeBtn = document.getElementById('help-file-dispute-btn');
  if (helpContactSupportBtn && supportModal) {
    helpContactSupportBtn.addEventListener('click', function () {
      supportModal.classList.remove('hidden');
    });
  }
  if (helpFileDisputeBtn) {
    helpFileDisputeBtn.addEventListener('click', function () {
      showView('disputes');
    });
  }

  document.querySelectorAll('.help-faq-item').forEach(function (faqItem) {
    var faqButton = faqItem.querySelector('button');
    var faqAnswer = faqItem.querySelector('.help-faq-answer');
    var faqCaret = faqItem.querySelector('.help-faq-caret');
    if (faqButton && faqAnswer) {
      faqButton.addEventListener('click', function () {
        faqAnswer.classList.toggle('hidden');
        if (faqCaret) faqCaret.classList.toggle('rotate-180');
      });
    }
  });

  /* ── Settings notification and badge switches ── */
  document.querySelectorAll('.settings-toggle-checkbox').forEach(function (toggle) {
    toggle.addEventListener('change', function () {
      toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
    });
  });

  /* ── Sidebar "Quote requests" link (inside vendor-submenu-network) ── */
  var quoteRequestsLink = document.querySelector('#vendor-submenu-network a:nth-child(2)');
  if (quoteRequestsLink) {
    quoteRequestsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('quote-requests');
    });
  }

  /* ── Sidebar "Lender lookup" link (inside vendor-submenu-financing) ── */
  var lenderLookupLink = document.querySelector('#vendor-submenu-financing a');
  if (lenderLookupLink) {
    lenderLookupLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('lender-lookup');
    });
  }

  /* ── Sidebar "Request financing" link (inside vendor-submenu-financing) ── */
  var requestFinancingLink = document.querySelector('#vendor-submenu-financing a:nth-child(2)');
  if (requestFinancingLink) {
    requestFinancingLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('request-financing');
    });
  }

  /* ── Sidebar "Repayments" link (inside vendor-submenu-financing) ── */
  var repaymentsLink = document.querySelector('#vendor-submenu-financing a:nth-child(3)');
  if (repaymentsLink) {
    repaymentsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('repayments');
    });
  }

  /* ── Sidebar "Funded repayments" link (inside vendor-submenu-financing) ── */
  var fundedRepaymentsLink = document.querySelector('#vendor-submenu-financing a:nth-child(4)');
  if (fundedRepaymentsLink) {
    fundedRepaymentsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('funded-repayments');
    });
  }

  /* ── Fold / collapse toggles ── */
  var foldButtons = document.querySelectorAll('[data-fold-target]');
  foldButtons.forEach(function (btn) {
    var targetId = btn.dataset.foldTarget;
    var panel    = document.getElementById(targetId);
    var icon     = btn.querySelector('.vendor-fold-icon');

    if (!panel) return;

    btn.addEventListener('click', function () {
      var isHidden = panel.classList.toggle('hidden');
      if (icon) icon.classList.toggle('rotate-180', !isHidden);
    });
  });

  /* ── Lifecycle tab highlight ── */
  var statusTabs = document.querySelectorAll('.workorders-tab');
  statusTabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      statusTabs.forEach(function (t) {
        t.classList.remove('border-emerald-400', 'text-emerald-300', 'border-b-2');
        t.classList.add('text-slate-300');
      });
      tab.classList.add('border-emerald-400', 'text-emerald-300', 'border-b-2');
      tab.classList.remove('text-slate-300');
    });
  });

  /* ── Industry selector dropdown (fixed positioning to avoid scroll-container clipping) ── */
  var industryBtn     = document.getElementById('industry-dropdown-btn');
  var industryOptions = document.getElementById('industry-dropdown-options');
  if (industryBtn && industryOptions) {
    industryBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = industryOptions.style.display !== 'none';
      if (isOpen) {
        industryOptions.style.display = 'none';
      } else {
        var rect = industryBtn.getBoundingClientRect();
        industryOptions.style.top  = (rect.bottom + 4) + 'px';
        industryOptions.style.left = (rect.right - 256) + 'px'; /* 256px = w-64 */
        industryOptions.style.display = 'block';
      }
    });
    industryOptions.addEventListener('click', function (e) {
      var li = e.target.closest('li');
      if (li) {
        industryBtn.querySelector('span').textContent = li.textContent.trim();
        industryOptions.style.display = 'none';
      }
    });
    document.addEventListener('click', function () {
      industryOptions.style.display = 'none';
    });
  }

  /* ── Sign Out → native redirect to index.html ── */
  var signOutBtn = document.getElementById('vendor-signout-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  /* ── Back to Home → native redirect to index.html ── */
  var backHomeBtn = document.getElementById('vendor-back-home-btn');
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  /* ── Bill payment status filter toggle highlight ── */
  var billStatusBtns = document.querySelectorAll('.bill-payment-status-btn');
  billStatusBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      billStatusBtns.forEach(function (b) {
        b.classList.remove('bg-emerald-500/10', 'text-emerald-300', 'border-emerald-500/30');
        b.classList.add('bg-slate-950/60', 'text-slate-400', 'border-slate-800/60');
        b.removeAttribute('data-active');
      });
      btn.classList.remove('bg-slate-950/60', 'text-slate-400', 'border-slate-800/60');
      btn.classList.add('bg-emerald-500/10', 'text-emerald-300', 'border-emerald-500/30');
      btn.setAttribute('data-active', 'true');
    });
  });

  /* ── Fee Simulator: click handler for the simulate button ── */
  var simulateBtn = document.getElementById('simulate-fees-btn');
  var dealAmountInput = document.getElementById('simulator-deal-amount');
  var resultsBox = document.getElementById('simulator-results-box');
  var resultEscrow = document.getElementById('sim-result-escrow');
  var resultDuty = document.getElementById('sim-result-duty');
  var resultGas = document.getElementById('sim-result-gas');
  var resultNet = document.getElementById('sim-result-net');

  function formatUSD(amount) {
    return '$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' USD';
  }

  if (simulateBtn && dealAmountInput && resultsBox) {
    simulateBtn.addEventListener('click', function () {
      var dealAmount = parseFloat(dealAmountInput.value) || 0;

      var escrowFee = dealAmount * 0.015;
      var dutyFee = dealAmount * 0.035;
      var gasCost = 12.50;
      var netPayout = dealAmount - escrowFee - dutyFee - gasCost;

      if (resultEscrow) resultEscrow.textContent = formatUSD(escrowFee);
      if (resultDuty) resultDuty.textContent = formatUSD(dutyFee);
      if (resultGas) resultGas.textContent = formatUSD(gasCost);
      if (resultNet) resultNet.textContent = formatUSD(netPayout);

      resultsBox.classList.remove('hidden');
    });
  }

  /* ── Direct Links: inline buyer type pill toggle ── */
  var directLinkPartyPills = document.querySelectorAll('.direct-link-party-pill');
  directLinkPartyPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      directLinkPartyPills.forEach(function (otherPill) {
        otherPill.classList.remove('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-300', 'font-medium');
        otherPill.classList.add('border-slate-700', 'text-slate-400');
        otherPill.setAttribute('aria-pressed', 'false');
      });
      pill.classList.remove('border-slate-700', 'text-slate-400');
      pill.classList.add('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-300', 'font-medium');
      pill.setAttribute('aria-pressed', 'true');
    });
  });

  /* ── Direct Links: trade scope and administered contract controls ── */
  var directLinkScopePills = document.querySelectorAll('.direct-link-scope-pill');
  directLinkScopePills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      directLinkScopePills.forEach(function (otherPill) {
        otherPill.classList.remove('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-300', 'font-medium');
        otherPill.classList.add('border-slate-700', 'text-slate-400');
        otherPill.setAttribute('aria-pressed', 'false');
      });
      pill.classList.remove('border-slate-700', 'text-slate-400');
      pill.classList.add('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-300', 'font-medium');
      pill.setAttribute('aria-pressed', 'true');
    });
  });

  var administeredContractToggle = document.getElementById('administered-contract-toggle');
  if (administeredContractToggle) {
    administeredContractToggle.addEventListener('change', function () {
      administeredContractToggle.setAttribute('aria-checked', administeredContractToggle.checked ? 'true' : 'false');
    });
  }

  var supportedSellerCollateralAssets = [
    { asset: 'USDT', label: 'USDT', networks: ['TRC20'] },
    { asset: 'USDT', label: 'USDT', networks: ['ERC20'] },
    { asset: 'USDT', label: 'USDT', networks: ['Polygon'] },
    { asset: 'USDC', label: 'USDC', networks: ['ERC20'] },
    { asset: 'USDC', label: 'USDC', networks: ['Polygon'] },
    { asset: 'BTC', label: 'Bitcoin (BTC)', networks: ['Bitcoin'] },
    { asset: 'BCH', label: 'Bitcoin Cash (BCH)', networks: ['Bitcoin Cash'] },
    { asset: 'TRX', label: 'Tron (TRX)', networks: ['Tron'] },
    { asset: 'DASH', label: 'Dash (DASH)', networks: ['Dash'] },
    { asset: 'MATIC', label: 'Polygon (MATIC)', networks: ['Polygon'] },
    { asset: 'DAI', label: 'Dai (DAI)', networks: ['ERC20'] },
    { asset: 'SHIB', label: 'Shiba Inu (SHIB)', networks: ['ERC20'] },
    { asset: 'XRP', label: 'Ripple (XRP)', networks: ['Ripple'] },
    { asset: 'TON', label: 'The Open Network (TON)', networks: ['The Open Network'] }
  ];

  function formatDemoNumericAmount(amount) {
    var value = Number(amount || 0);
    return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  function buildDemoAddress(escrowId, asset, network) {
    var rawSeed = (escrowId + asset + network).replace(/[^A-Z0-9]/gi, '').toUpperCase();
    var suffix = rawSeed.slice(0, 24) || 'DEMO';
    return 'DEMO-' + asset + '-' + network.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 10) + '-' + suffix;
  }

  function buildDemoQrData(escrowId, asset, network, amount) {
    return 'escrowsonet-demo://deposit/' + encodeURIComponent(escrowId) + '?asset=' + encodeURIComponent(asset) + '&network=' + encodeURIComponent(network) + '&amount=' + encodeURIComponent(String(amount)) + '&currency=USD';
  }

  function ensureSellerCollateralModal() {
    var modal = document.getElementById('seller-collateral-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'seller-collateral-modal';
    modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm';
    modal.innerHTML = '<div class="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-emerald-950/20 sm:p-6"><div class="mb-5 flex items-center justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.25em] text-emerald-300">Seller security deposit</p><h3 class="mt-2 text-xl font-bold text-white">Secure 30% collateral</h3></div><button type="button" data-close-seller-modal="true" class="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-200">Close</button></div><div id="seller-collateral-step"></div></div>';
    modal.firstElementChild.style.maxHeight = 'calc(100vh - 2rem)';
    modal.firstElementChild.style.overflowY = 'auto';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.getAttribute('data-close-seller-modal') === 'true') {
        modal.classList.add('hidden');
      }
    });
    return modal;
  }

  function renderSellerCollateralStep(escrowId, transaction) {
    var modal = ensureSellerCollateralModal();
    var step = document.getElementById('seller-collateral-step');
    if (!step) return;
    var collateralAmount = Number(transaction.sellerCollateral || 0);
    var amountText = formatDemoNumericAmount(collateralAmount);
    var selectedAsset = transaction.selectedAsset || 'USDT';
    var selectedNetwork = transaction.selectedNetwork || 'TRC20';
    var hasGateway = transaction.sellerCollateralStatus === 'SECURED';
    if (hasGateway) {
      step.innerHTML = '<div class="space-y-4"><div class="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4"><p class="text-xs uppercase tracking-[0.22em] text-emerald-300">Seller collateral secured</p><h4 class="mt-2 text-2xl font-bold text-white">$' + amountText + ' USD</h4><p class="mt-2 text-sm text-slate-300">The seller has secured the required 30% security deposit for this transaction.</p></div><div class="rounded-xl border border-slate-800 bg-slate-900/40 p-4"><p class="text-sm text-slate-300">Buyer payment link: ready to share</p></div></div>';
      return;
    }

    step.innerHTML = '<div class="space-y-5"><div class="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4"><p class="text-xs uppercase tracking-[0.22em] text-amber-200">ESCROW CREATED</p><h4 class="mt-2 text-2xl font-bold text-white">Seller security deposit required</h4><p class="mt-2 text-3xl font-black text-emerald-300">$' + amountText + ' USD</p><p class="mt-2 text-sm text-slate-300">Secure your 30% collateral before inviting the buyer.</p></div><div class="space-y-3"><p class="text-sm font-semibold text-slate-200">Select asset</p><div class="grid gap-3 sm:grid-cols-2">' + supportedSellerCollateralAssets.map(function (entry) {
      return '<button type="button" data-seller-asset="' + entry.asset + '" class="seller-collateral-asset rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-3 text-left text-sm text-slate-200 hover:border-emerald-400 hover:text-emerald-100 ' + (selectedAsset === entry.asset ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : '') + '"><div class="flex items-center justify-between"><span class="font-semibold">' + entry.asset + '</span><span class="text-xs text-slate-400">' + entry.networks.join(' · ') + '</span></div></button>';
    }).join('') + '</div></div><div class="rounded-xl border border-slate-800 bg-slate-900/40 p-4"><p class="text-sm font-semibold text-slate-200">Demo payment detail</p><p class="mt-2 text-sm text-slate-300">Amount to deposit: <span class="font-semibold text-white">' + amountText + ' ' + selectedAsset + '</span> <span class="text-amber-200">DEMO AMOUNT</span></p><p class="mt-2 text-sm text-slate-300">Network: <span class="font-semibold text-white">' + selectedNetwork + '</span></p><button type="button" id="seller-collateral-confirm-btn" class="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-500">Deposit Seller Collateral</button></div></div>';
    var assetButtons = step.querySelectorAll('[data-seller-asset]');
    assetButtons.forEach(function (button, index) {
      var entry = supportedSellerCollateralAssets[index];
      var selected = selectedAsset === entry.asset && selectedNetwork === entry.networks[0];
      var label = button.querySelector('.font-semibold');
      if (label) label.textContent = entry.label;
      if (!selected) button.classList.remove('border-emerald-500/40', 'bg-emerald-500/10', 'text-emerald-200');
      button.addEventListener('click', function () {
        selectedAsset = entry.asset;
        selectedNetwork = entry.networks[0];
        renderSellerCollateralStep(escrowId, { sellerCollateral: collateralAmount, sellerCollateralStatus: 'PENDING', selectedAsset: selectedAsset, selectedNetwork: selectedNetwork });
        document.getElementById('seller-collateral-confirm-btn').click();
      });
    });
    var confirmButton = document.getElementById('seller-collateral-confirm-btn');
    if (confirmButton) {
      confirmButton.hidden = true;
      confirmButton.addEventListener('click', function () {
        var amount = Number(transaction.sellerCollateral || collateralAmount);
        var demoAddress = buildDemoAddress(escrowId, selectedAsset, selectedNetwork);
        var qrData = buildDemoQrData(escrowId, selectedAsset, selectedNetwork, amount);
        var reviewHtml = '<div class="space-y-5"><div class="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4"><p class="text-xs uppercase tracking-[0.22em] text-amber-200">DEMO PAYMENT — NO REAL FUNDS</p><h4 class="mt-2 text-2xl font-bold text-white">Deposit $' + amountText + ' via ' + selectedAsset + ' (' + selectedNetwork + ')</h4><p class="mt-2 text-sm text-slate-300">Amount to deposit: <span class="font-semibold text-white">' + amountText + ' ' + selectedAsset + '</span> <span class="text-amber-200">DEMO AMOUNT</span></p></div><div class="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-4"><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold text-slate-200">Demo address</p><button type="button" data-copy-demo-address="true" class="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-emerald-400">Copy Address</button></div><p class="break-all rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-3 font-mono text-sm text-emerald-200">' + demoAddress + '</p><div class="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center"><p class="mb-3 text-xs uppercase tracking-[0.25em] text-slate-400">QR Code</p><canvas id="seller-demo-qr" class="mx-auto block rounded-lg bg-white p-2" width="180" height="180"></canvas><p class="mt-3 text-xs text-slate-400">Demo URI: ' + qrData + '</p></div><div class="flex gap-3"><button type="button" data-copy-demo-amount="true" class="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-emerald-400">Copy Amount</button><button type="button" id="seller-payment-confirm-btn" class="flex-1 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500">I\'ve Sent the Payment</button></div><div class="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300"><p class="font-semibold text-amber-200">Status: WAITING FOR PAYMENT</p><p class="mt-2 text-xs text-slate-400">Timer: <span id="seller-demo-timer">24:00:00</span></p></div></div></div>';
        step.innerHTML = reviewHtml;
        var demoAmountDetails = document.createElement('p');
        demoAmountDetails.className = 'mt-2 text-sm text-slate-300';
        demoAmountDetails.textContent = 'Amount: $' + amountText + ' USD';
        document.getElementById('seller-demo-qr').closest('.rounded-xl').insertAdjacentElement('beforebegin', demoAmountDetails);
        var demoNetworkDetails = document.createElement('p');
        demoNetworkDetails.className = 'mt-1 text-sm text-slate-300';
        demoNetworkDetails.textContent = 'Network: ' + selectedNetwork;
        demoAmountDetails.insertAdjacentElement('afterend', demoNetworkDetails);
        Array.from(step.querySelectorAll('p')).forEach(function (paragraph) {
          if (paragraph.textContent.trim() === 'Status: WAITING FOR PAYMENT') {
            paragraph.textContent = 'Status: WAITING FOR DEMO PAYMENT';
          }
          if (paragraph.textContent.trim().startsWith('Demo URI:')) {
            paragraph.textContent = 'Demo URI: ' + qrData;
          }
        });
        window.EscrowTransactions.createDemoQr(qrData).then(function (qrDataUrl) {
          var image = new Image();
          image.onload = function () {
            var canvas = document.getElementById('seller-demo-qr');
            if (canvas) canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          };
          image.src = qrDataUrl;
        }).catch(function (error) {
          console.warn('Demo QR generation failed', error);
        });
        document.querySelector('[data-copy-demo-address="true"]').addEventListener('click', function () {
          navigator.clipboard.writeText(demoAddress).catch(function () {});
        });
        document.querySelector('[data-copy-demo-amount="true"]').addEventListener('click', function () {
          navigator.clipboard.writeText(amountText + ' ' + selectedAsset).catch(function () {});
        });
        var timerNode = document.getElementById('seller-demo-timer');
        if (timerNode) {
          var remaining = 24 * 60 * 60;
          var interval = setInterval(function () {
            if (!document.getElementById('seller-demo-timer')) return clearInterval(interval);
            remaining = Math.max(0, remaining - 1);
            var hours = String(Math.floor(remaining / 3600)).padStart(2, '0');
            var minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
            var seconds = String(remaining % 60).padStart(2, '0');
            document.getElementById('seller-demo-timer').textContent = hours + ':' + minutes + ':' + seconds;
          }, 1000);
        }
        var paymentConfirmButton = document.getElementById('seller-payment-confirm-btn');
        if (paymentConfirmButton) {
          paymentConfirmButton.addEventListener('click', async function () {
            paymentConfirmButton.disabled = true;
            paymentConfirmButton.textContent = 'Verifying demo payment...';
            try {
              await new Promise(function (resolve) { setTimeout(resolve, 700); });
              var securedTransaction = await window.EscrowTransactions.depositSellerCollateral(escrowId, {
                selectedAsset: selectedAsset,
                selectedNetwork: selectedNetwork,
                demoAddress: demoAddress,
                demoQrData: qrData,
                mockPaymentReference: 'DEMO-TX-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
                sellerCollateralAmount: Math.round(collateralAmount * 100),
                sellerCollateralPercentage: 30,
                mockPaymentStatus: 'CONFIRMED',
                sellerCollateralStatus: 'SECURED'
              });
              var createdEscrowId = document.getElementById('direct-link-created-id');
              if (createdEscrowId && createdEscrowId.textContent === escrowId) {
                document.getElementById('direct-link-created-state').textContent = securedTransaction.status;
                document.getElementById('direct-link-created-url').value = securedTransaction.paymentLink || '';
                document.getElementById('open-direct-link-btn').href = securedTransaction.paymentLink || '#';
                document.getElementById('direct-link-created-message').textContent = 'Seller collateral secured. The buyer payment link is ready to share.';
                document.getElementById('direct-link-sharing-controls').classList.remove('hidden');
                document.getElementById('direct-link-deposit-collateral-btn').classList.add('hidden');
              }
              modal.classList.add('hidden');
              await refreshVendorTransactions();
            } catch (error) {
              paymentConfirmButton.disabled = false;
              paymentConfirmButton.textContent = 'I\'ve Sent the Payment';
              if (vendorTransactionStatus) vendorTransactionStatus.textContent = error.message || 'Demo payment confirmation failed.';
            }
          });
        }
      });
    }
    modal.classList.remove('hidden');
  }

  function openSellerCollateralDeposit(transaction) {
    var modal = ensureSellerCollateralModal();
    renderSellerCollateralStep(transaction.escrowId, transaction);
    modal.classList.remove('hidden');
  }

  /* ── Direct Links: delivery terms controls ── */
  function bindDirectLinkPillGroup(selector) {
    var pills = document.querySelectorAll(selector);
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (otherPill) {
          otherPill.classList.remove('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-300', 'font-medium');
          otherPill.classList.add('border-slate-700', 'text-slate-400');
          otherPill.setAttribute('aria-pressed', 'false');
        });
        pill.classList.remove('border-slate-700', 'text-slate-400');
        pill.classList.add('bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-300', 'font-medium');
        pill.setAttribute('aria-pressed', 'true');
      });
    });
  }

  bindDirectLinkPillGroup('.direct-link-transport-pill');
  bindDirectLinkPillGroup('.direct-link-delivery-pill');

  var useExwBtn = document.getElementById('use-exw-btn');
  var directLinkIncotermSelect = document.getElementById('direct-link-incoterm-select');
  if (useExwBtn && directLinkIncotermSelect) {
    useExwBtn.addEventListener('click', function () {
      directLinkIncotermSelect.value = 'EXW — Ex Works';
    });
  }

  /* ── Direct Links: consignment line totals and cloning ── */
  var consignmentList = document.getElementById('consignment-list');
  var addConsignmentBtn = document.getElementById('add-consignment-btn');
  if (consignmentList) {
    var summarySubtotal = document.getElementById('summary-subtotal');
    var summaryNet = document.getElementById('summary-net');
    var summaryEscrowLock = document.getElementById('summary-escrow-lock');
    var collateralBps = 3000;

    function formatFinancialUSD(amount) {
      var currency = document.getElementById('transaction-currency')?.value || 'USD';
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(amount);
    }

    function updateFinancialSummary() {
      var subtotal = 0;
      consignmentList.querySelectorAll('.consignment-card').forEach(function (card) {
        var quantity = parseFloat(card.querySelector('.consignment-quantity')?.value) || 0;
        var price = parseFloat(card.querySelector('.consignment-price')?.value) || 0;
        subtotal += quantity * price;
      });
      var discountRate = parseFloat(document.querySelector('.financial-discount-rate')?.value) || 0;
      var freight = parseFloat(document.querySelector('.financial-freight-amount')?.value) || 0;
      var deposit = parseFloat(document.querySelector('.financial-deposit-amount')?.value) || 0;
      var retentionRate = parseFloat(document.querySelector('.financial-retention-rate')?.value) || 0;
      var discount = document.getElementById('toggle-discount')?.checked ? subtotal * discountRate / 100 : 0;
      var net = Math.max(0, subtotal - discount + (document.getElementById('toggle-freight')?.checked ? freight : 0));
      var retention = document.getElementById('toggle-retention')?.checked ? net * retentionRate / 100 : 0;
      var escrowLock = Math.max(0, net - (document.getElementById('toggle-deposit')?.checked ? deposit : 0) - retention);
      var buyerCollateral = net * collateralBps / 10000;
      var sellerCollateral = buyerCollateral;
      if (document.getElementById('toggle-round-usd')?.checked) escrowLock = Math.round(escrowLock);
      if (summarySubtotal) summarySubtotal.textContent = formatFinancialUSD(subtotal);
      if (summaryNet) summaryNet.textContent = formatFinancialUSD(net);
      if (summaryEscrowLock) summaryEscrowLock.textContent = formatFinancialUSD(escrowLock);
      var buyerCollateralOutput = document.getElementById('summary-buyer-collateral');
      var sellerCollateralOutput = document.getElementById('summary-seller-collateral');
      var buyerTotalOutput = document.getElementById('summary-buyer-total');
      if (buyerCollateralOutput) buyerCollateralOutput.textContent = formatFinancialUSD(buyerCollateral);
      if (sellerCollateralOutput) sellerCollateralOutput.textContent = formatFinancialUSD(sellerCollateral);
      if (buyerTotalOutput) buyerTotalOutput.textContent = formatFinancialUSD(net + buyerCollateral);
    }

    function updateConsignmentTotal(card) {
      var quantity = parseFloat(card.querySelector('.consignment-quantity')?.value) || 0;
      var price = parseFloat(card.querySelector('.consignment-price')?.value) || 0;
      var total = card.querySelector('.consignment-line-total');
      if (total) total.textContent = (quantity * price).toFixed(2);
      updateFinancialSummary();
    }

    consignmentList.addEventListener('input', function (e) {
      if (e.target.matches('.consignment-quantity, .consignment-price')) {
        updateConsignmentTotal(e.target.closest('.consignment-card'));
      }
    });

    consignmentList.querySelectorAll('.consignment-card').forEach(updateConsignmentTotal);

    document.querySelectorAll('.financial-toggle').forEach(function (toggle) {
      toggle.addEventListener('change', function () {
        var fields = toggle.closest('div.py-4').querySelector('.financial-optional-fields');
        if (fields) fields.classList.toggle('hidden', !toggle.checked);
        updateFinancialSummary();
      });
    });
    document.querySelectorAll('.financial-optional-fields input').forEach(function (input) {
      input.addEventListener('input', updateFinancialSummary);
    });

    if (addConsignmentBtn) {
      addConsignmentBtn.addEventListener('click', function () {
        var cards = consignmentList.querySelectorAll('.consignment-card');
        var newCard = cards[0].cloneNode(true);
        var nextNumber = cards.length + 1;
        newCard.querySelector('.consignment-label').textContent = 'Consignment ' + nextNumber;
        newCard.querySelectorAll('input').forEach(function (input) {
          if (input.classList.contains('consignment-quantity')) input.value = '1';
          else if (input.classList.contains('consignment-price')) input.value = '';
          else if (input.type === 'number') input.value = '';
          else input.value = '';
        });
        newCard.querySelectorAll('select').forEach(function (select) {
          select.selectedIndex = 0;
        });
        consignmentList.appendChild(newCard);
        updateConsignmentTotal(newCard);
      });
    }

    document.getElementById('transaction-currency')?.addEventListener('change', updateFinancialSummary);
  }

  /* ── Direct Links: taxes and duties selection ── */
  var taxDutyTags = document.querySelectorAll('.tax-duty-tag');
  var taxDutyHelper = document.getElementById('tax-duty-helper');
  taxDutyTags.forEach(function (tag) {
    tag.addEventListener('click', function () {
      var selected = tag.getAttribute('aria-pressed') !== 'true';
      tag.setAttribute('aria-pressed', selected ? 'true' : 'false');
      tag.classList.toggle('bg-emerald-500/10', selected);
      tag.classList.toggle('border-emerald-500/30', selected);
      tag.classList.toggle('text-emerald-300', selected);
      if (taxDutyHelper) {
        var selectedTags = Array.from(document.querySelectorAll('.tax-duty-tag[aria-pressed="true"]')).map(function (item) { return item.textContent; });
        taxDutyHelper.textContent = selectedTags.length ? 'Selected: ' + selectedTags.join(', ') + '.' : 'No taxes or duties added. Tap a preset or add a custom line item.';
      }
    });
  });

  var taxesDutiesToggle = document.getElementById('taxes-duties-toggle');
  var taxesDutiesPanel = document.getElementById('taxes-duties-panel');
  if (taxesDutiesToggle && taxesDutiesPanel) {
    taxesDutiesToggle.addEventListener('click', function () {
      var expanded = taxesDutiesToggle.getAttribute('aria-expanded') === 'true';
      taxesDutiesToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      taxesDutiesPanel.classList.toggle('hidden', expanded);
      var caret = taxesDutiesToggle.querySelector('i');
      if (caret) caret.classList.toggle('fa-chevron-down', expanded);
      if (caret) caret.classList.toggle('fa-chevron-up', !expanded);
    });
  }

  /* ── Direct Links: tax jurisdiction and filing facts ── */
  document.querySelectorAll('.tax-jurisdiction-toggle').forEach(function (toggle) {
    toggle.addEventListener('change', function () {
      toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
    });
  });

  var verifyBuyerTaxBtn = document.getElementById('verify-buyer-tax-btn');
  var buyerTaxRegistrationStatus = document.getElementById('buyer-tax-registration-status');
  if (verifyBuyerTaxBtn && buyerTaxRegistrationStatus) {
    verifyBuyerTaxBtn.addEventListener('click', function () {
      buyerTaxRegistrationStatus.textContent = 'Registry check complete. Buyer tax registration verified as active.';
      buyerTaxRegistrationStatus.classList.remove('text-slate-500');
      buyerTaxRegistrationStatus.classList.add('text-emerald-300');
      verifyBuyerTaxBtn.classList.remove('border-slate-700', 'text-slate-300');
      verifyBuyerTaxBtn.classList.add('border-emerald-500/30', 'text-emerald-300');
    });
  }

  /* ── Direct Links: contract instruments and payment link validation ── */
  document.querySelectorAll('.contract-instrument-toggle').forEach(function (toggle) {
    toggle.addEventListener('change', function () {
      toggle.setAttribute('aria-checked', toggle.checked ? 'true' : 'false');
    });
  });

  document.querySelectorAll('.contract-instrument-add').forEach(function (button) {
    button.addEventListener('click', function () {
      var added = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', added ? 'false' : 'true');
      button.textContent = added ? '+ Add' : 'Added';
      button.classList.toggle('border-emerald-500/30', !added);
      button.classList.toggle('text-emerald-300', !added);
    });
  });

  var generatePaymentLinkBtn = document.getElementById('generate-payment-link-btn');
  var nextRedFieldBtn = document.getElementById('next-red-field-btn');
  var directLinkValidationFields = [
    document.getElementById('seller-legal-name'),
    document.getElementById('seller-street-address'),
    document.getElementById('seller-city'),
    document.getElementById('transaction-buyer-name'),
    document.getElementById('transaction-buyer-contact'),
    document.getElementById('transaction-delivery-terms'),
    document.getElementById('transaction-expected-delivery')
  ];

  function getInvalidDirectLinkFields() {
    var invalidFields = [];
    var invoiceAmount = parseFloat(summaryNet?.textContent.replace(/[^0-9.]/g, '') || '0');
    if (!(invoiceAmount > 0)) invalidFields.push(document.querySelector('.consignment-price'));
    document.querySelectorAll('.consignment-card').forEach(function (card) {
      var description = card.querySelector('.consignment-description');
      var quantity = card.querySelector('.consignment-quantity');
      var price = card.querySelector('.consignment-price');
      if (description && !description.value.trim()) invalidFields.push(description);
      if (quantity && !(parseFloat(quantity.value) > 0)) invalidFields.push(quantity);
      if (price && !(parseFloat(price.value) > 0)) invalidFields.push(price);
    });
    directLinkValidationFields.forEach(function (field) {
      if (field && !field.value.trim()) invalidFields.push(field);
    });
    return invalidFields;
  }

  function validateDirectLinkForm() {
    var invalidFields = getInvalidDirectLinkFields();
    document.querySelectorAll('#direct-links-view .settings-input').forEach(function (field) {
      field.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500/50');
    });
    invalidFields.forEach(function (field) {
      field.classList.add('border-rose-500', 'ring-1', 'ring-rose-500/50');
    });
    if (generatePaymentLinkBtn) {
      generatePaymentLinkBtn.disabled = invalidFields.length > 0;
      generatePaymentLinkBtn.classList.toggle('opacity-60', invalidFields.length > 0);
      generatePaymentLinkBtn.classList.toggle('cursor-not-allowed', invalidFields.length > 0);
      generatePaymentLinkBtn.classList.toggle('hover:bg-emerald-400', invalidFields.length === 0);
    }
    return invalidFields;
  }

  if (nextRedFieldBtn) {
    nextRedFieldBtn.addEventListener('click', function () {
      var invalidFields = validateDirectLinkForm();
      if (invalidFields[0]) {
        invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidFields[0].focus();
      }
    });
  }

  document.querySelectorAll('#direct-links-view .settings-input').forEach(function (field) {
    field.addEventListener('input', validateDirectLinkForm);
  });
  function setDemoSelectOption(select, value, label) {
    if (!select) return;
    var hasOption = Array.from(select.options).some(function (option) { return option.value === value || option.textContent.trim() === label; });
    if (!hasOption) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    }
    select.value = value;
  }

  function triggerBuyerType(type) {
    var pills = document.querySelectorAll('.direct-link-party-pill');
    var target = Array.from(pills).find(function (pill) { return pill.getAttribute('data-party-type') === type; });
    if (!target) return;
    target.click();
  }

  function populateDemoData() {
    var sellerName = document.getElementById('seller-legal-name');
    if (sellerName) sellerName.value = 'Acme Global Trading Pvt. Ltd.';

    var sellerStreet = document.querySelector('#seller-street-address');
    if (sellerStreet) sellerStreet.value = '123 Business Park';

    var sellerCity = document.getElementById('seller-city');
    if (sellerCity) sellerCity.value = 'Pune';

    var sellerCountry = document.querySelector('select[aria-label="Seller country"]');
    if (sellerCountry) setDemoSelectOption(sellerCountry, 'IN', 'IN — India');

    var sellerEmailFields = document.querySelectorAll('input[type="email"][placeholder="Email (optional)"]');
    if (sellerEmailFields.length) sellerEmailFields[0].value = 'vendor@demo.test';

    triggerBuyerType('business');

    var buyerName = document.getElementById('transaction-buyer-name');
    if (buyerName) buyerName.value = 'John Smith';

    var buyerContact = document.getElementById('transaction-buyer-contact');
    if (buyerContact) buyerContact.value = 'buyer@demo.test';

    var buyerCountry = document.querySelector('select[aria-label="Buyer country"]');
    if (buyerCountry) setDemoSelectOption(buyerCountry, 'US', 'US — United States');

    var buyerStreet = Array.from(document.querySelectorAll('input[placeholder="Street address"]')).filter(function (input) { return input.closest('section') && input.closest('section').textContent.includes('BUYER'); })[0];
    if (buyerStreet) buyerStreet.value = '10 Market Street';

    var buyerCity = Array.from(document.querySelectorAll('input[placeholder="City / Town"]')).filter(function (input) { return input.closest('section') && input.closest('section').textContent.includes('BUYER'); })[0];
    if (buyerCity) buyerCity.value = 'New York';

    var deliveryTime = document.querySelector('[aria-label="Delivery time"]');
    if (deliveryTime) deliveryTime.value = '30';

    var deliveryUnit = document.querySelector('[aria-label="Delivery time unit"]');
    if (deliveryUnit) deliveryUnit.value = 'business days';

    var expectedDate = document.getElementById('transaction-expected-delivery');
    if (expectedDate) {
      var futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      expectedDate.value = futureDate.toISOString().slice(0, 10);
    }

    var deliveryTermsInput = document.getElementById('transaction-delivery-terms');
    if (deliveryTermsInput) deliveryTermsInput.value = 'CIF';

    var incotermSelect = document.getElementById('direct-link-incoterm-select');
    if (incotermSelect) {
      setDemoSelectOption(incotermSelect, 'CIF', 'CIF — Cost, Insurance & Freight');
    }

    var consignment = document.querySelector('.consignment-card');
    if (consignment) {
      var description = consignment.querySelector('.consignment-description');
      if (description) description.value = 'Industrial equipment supply';
      var quantity = consignment.querySelector('.consignment-quantity');
      if (quantity) quantity.value = '1';
      var price = consignment.querySelector('.consignment-price');
      if (price) price.value = '10000';
    }

    var currency = document.getElementById('transaction-currency');
    if (currency) currency.value = 'USD';
    var priceInput = document.querySelector('.consignment-price');
    if (priceInput) priceInput.dispatchEvent(new Event('input', { bubbles: true }));
    validateDirectLinkForm();
  }

  function buildDirectEscrowPayload() {
    var metadataDescription = Array.from(document.querySelectorAll('.consignment-description'))
      .map(function (field) { return field.value.trim(); }).filter(Boolean).join('\n');
    var invoiceAmount = summaryNet?.textContent.replace(/[^0-9.]/g, '') || '0';
    var deliveryDays = document.querySelector('[aria-label="Delivery time"]')?.value || '14';
    var deliveryUnit = document.querySelector('[aria-label="Delivery time unit"]')?.value || 'business days';
    var incoterm = document.getElementById('direct-link-incoterm-select')?.value || '';
    var deliveryDescription = document.getElementById('transaction-delivery-terms')?.value.trim() || '';
    var deliveryTerms = [incoterm, deliveryDays + ' ' + deliveryUnit, deliveryDescription].filter(Boolean).join(' · ');
    var currency = document.getElementById('transaction-currency')?.value || 'USD';
    return {
      vendorName: document.getElementById('seller-legal-name')?.value.trim(),
      buyerName: document.getElementById('transaction-buyer-name')?.value.trim(),
      buyerContact: document.getElementById('transaction-buyer-contact')?.value.trim(),
      invoiceAmount: invoiceAmount,
      currency: currency,
      description: metadataDescription,
      deliveryTerms: deliveryTerms,
      expectedDeliveryDate: document.getElementById('transaction-expected-delivery')?.value
    };
  }

  function createDirectEscrowRequest(button) {
    var invalidFields = validateDirectLinkForm();
    var status = document.getElementById('direct-link-escrow-status');
    if (invalidFields[0]) {
      invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalidFields[0].focus();
      return;
    }

    if (!window.EscrowTransactions) {
      if (status) status.textContent = 'The transaction service is unavailable. Refresh and retry.';
      return;
    }

    var resultPanel = document.getElementById('direct-link-created-result');
    var shareButton = document.getElementById('share-direct-link-btn');
    if (button) {
      button.disabled = true;
      button.textContent = 'Creating Escrow…';
    }
    if (status) status.textContent = 'Saving escrow. Seller collateral must be secured before a buyer link is created.';

    var payload = buildDirectEscrowPayload();

    window.EscrowTransactions.create(payload).then(function (created) {
      if (resultPanel) resultPanel.classList.remove('hidden');
      document.getElementById('direct-link-created-id').textContent = created.escrowId;
      document.getElementById('direct-link-created-state').textContent = created.status;
      document.getElementById('direct-link-created-url').value = created.paymentLink || '';
      document.getElementById('open-direct-link-btn').href = created.paymentLink || '#';
      document.getElementById('open-direct-link-btn').classList.toggle('pointer-events-none', !created.paymentLink);
      document.getElementById('direct-link-created-message').textContent = created.paymentLink
        ? 'Seller collateral secured. The buyer payment link is ready to share.'
        : 'Seller collateral required. Secure your 30% seller collateral before inviting the buyer.';
      document.getElementById('direct-link-sharing-controls').classList.toggle('hidden', !created.paymentLink);
      document.getElementById('direct-link-deposit-collateral-btn').classList.toggle('hidden', Boolean(created.paymentLink));
      document.getElementById('direct-link-created-funding').textContent = 'Invoice ' + created.invoiceAmount + ' ' + created.currency + ' · Buyer collateral ' + created.buyerCollateral + ' ' + created.currency + ' · Buyer total due ' + created.totalRequiredFromBuyer + ' ' + created.currency + ' · Seller collateral ' + created.sellerCollateral + ' ' + created.currency + ' · Payment: ' + created.paymentStatus + ' (MOCK)';
      if (status) {
        status.textContent = created.paymentLink
          ? 'Escrow created. Seller collateral is already secured, so the buyer payment link is ready.'
          : 'Escrow created. Buyer payment link stays hidden until the seller deposits the required 30% collateral.';
      }
      if (button) button.textContent = 'Escrow Created';
      if (!created.paymentLink) {
        document.getElementById('direct-link-deposit-collateral-btn').onclick = function () {
          openSellerCollateralDeposit(created);
        };
      }
      refreshVendorTransactions();
      if (shareButton && navigator.share) shareButton.dataset.shareUrl = created.paymentLink || '';
    }).catch(function (error) {
      if (status) status.textContent = error.message || 'Escrow could not be created.';
      if (button) button.textContent = button.id === 'create-demo-escrow-btn' ? 'Create Demo Escrow' : 'Create Escrow & Payment Link';
    }).finally(function () {
      if (button) button.disabled = false;
      validateDirectLinkForm();
    });
  }

  var fillDemoDataBtn = document.getElementById('fill-demo-data-btn');
  if (fillDemoDataBtn) {
    fillDemoDataBtn.addEventListener('click', function () {
      populateDemoData();
      var status = document.getElementById('direct-link-escrow-status');
      if (status) status.textContent = 'Demo data loaded. Review the values and create the mock escrow.';
    });
  }

  var createDemoEscrowBtn = document.getElementById('create-demo-escrow-btn');
  if (createDemoEscrowBtn) {
    createDemoEscrowBtn.addEventListener('click', function () {
      populateDemoData();
      createDirectEscrowRequest(createDemoEscrowBtn);
    });
  }

  if (generatePaymentLinkBtn && document.body.dataset.dashboardRole !== 'buyer') {
    generatePaymentLinkBtn.addEventListener('click', function () {
      createDirectEscrowRequest(generatePaymentLinkBtn);
    });
  }

  var copyDirectLinkBtn = document.getElementById('copy-direct-link-btn');
  if (copyDirectLinkBtn) {
    copyDirectLinkBtn.addEventListener('click', function () {
      var paymentUrl = document.getElementById('direct-link-created-url')?.value;
      if (paymentUrl) navigator.clipboard.writeText(paymentUrl).then(function () {
        copyDirectLinkBtn.textContent = 'Copied';
      });
    });
  }

  var shareDirectLinkBtn = document.getElementById('share-direct-link-btn');
  if (shareDirectLinkBtn) {
    shareDirectLinkBtn.addEventListener('click', async function () {
      var paymentUrl = document.getElementById('direct-link-created-url')?.value;
      if (!paymentUrl) return;
      try {
        if (navigator.share) await navigator.share({ title: 'Escrow Sonet transaction', url: paymentUrl });
        else {
          await navigator.clipboard.writeText(paymentUrl);
          shareDirectLinkBtn.textContent = 'Copied';
        }
      } catch (error) {
        if (error.name !== 'AbortError') document.getElementById('direct-link-escrow-status').textContent = 'Payment link is ready to copy from the field above.';
      }
    });
  }

  var vendorTransactionStatus = document.getElementById('vendor-transaction-status');
  var vendorTransactionCount = document.getElementById('vendor-transaction-count');
  var vendorTransactionFeed = document.getElementById('vendor-transaction-feed');
  var directLinkTransactionList = document.getElementById('direct-link-transaction-list');

  function formatTransactionMoney(amount, currency) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, minimumFractionDigits: 2 }).format(Number(amount));
  }

  function makeTextElement(tagName, className, text) {
    var element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function renderVendorTransactionList(container, transactions) {
    if (!container) return;
    container.replaceChildren();
    if (!transactions.length) {
      container.appendChild(makeTextElement('p', 'rounded-lg border border-slate-800/60 p-4 text-sm text-slate-400', 'No transactions created in this browser session yet.'));
      return;
    }
    transactions.forEach(function (transaction) {
      var card = document.createElement('article');
      card.className = 'space-y-3 rounded-xl border border-slate-800/70 bg-slate-950/40 p-4';
      var heading = document.createElement('div');
      heading.className = 'flex flex-wrap items-center justify-between gap-3';
      heading.appendChild(makeTextElement('h3', 'font-mono text-sm font-bold text-white', transaction.escrowId));
      heading.appendChild(makeTextElement('span', 'rounded-md border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-200', transaction.status));
      card.appendChild(heading);
      card.appendChild(makeTextElement('p', 'text-sm text-slate-300', transaction.buyer.name + ' · ' + transaction.buyer.contact));
      card.appendChild(makeTextElement('p', 'text-sm text-slate-300', 'Invoice ' + formatTransactionMoney(transaction.invoiceAmount, transaction.currency) + ' · Buyer collateral ' + formatTransactionMoney(transaction.buyerCollateral, transaction.currency) + ' · Buyer total due ' + formatTransactionMoney(transaction.totalRequiredFromBuyer, transaction.currency) + ' · Seller collateral ' + formatTransactionMoney(transaction.sellerCollateral, transaction.currency)));
      card.appendChild(makeTextElement('p', 'text-xs text-amber-200', 'Payment status: ' + transaction.paymentStatus + ' · MOCK only'));
      var linkRow = document.createElement('div');
      linkRow.className = 'flex flex-wrap items-center gap-3';
      var openLink = document.createElement('a');
      openLink.href = transaction.paymentLink || '#';
      openLink.target = '_blank';
      openLink.rel = 'noreferrer';
      openLink.className = 'break-all text-sm text-emerald-300 underline';
      openLink.textContent = transaction.paymentLink || 'Seller collateral required before buyer link is shown';
      openLink.classList.toggle('pointer-events-none', !transaction.paymentLink);
      linkRow.appendChild(openLink);
      if (transaction.paymentLink) {
        var copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-emerald-400';
        copy.textContent = 'Copy link';
        copy.addEventListener('click', async function () {
          await navigator.clipboard.writeText(transaction.paymentLink);
          copy.textContent = 'Copied';
        });
        linkRow.appendChild(copy);
      }
      card.appendChild(linkRow);
      if (!transaction.paymentLink && ['CREATED', 'SELLER_COLLATERAL_PENDING'].includes(transaction.status)) {
        var depositCollateral = document.createElement('button');
        depositCollateral.type = 'button';
        depositCollateral.className = 'rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500';
        depositCollateral.textContent = 'Deposit Seller Collateral';
        depositCollateral.addEventListener('click', function () {
          openSellerCollateralDeposit(transaction);
        });
        card.appendChild(depositCollateral);
      }
      if (transaction.sellerCollateralStatus === 'SECURED' && !transaction.paymentLink) {
        var secureStatus = document.createElement('p');
        secureStatus.className = 'text-xs text-emerald-200';
        secureStatus.textContent = 'Seller collateral secured · buyer link will be generated';
        card.appendChild(secureStatus);
      }
      if (transaction.status === 'BUYER_FUNDED') {
        var activate = document.createElement('button');
        activate.type = 'button';
        activate.className = 'rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500';
        activate.textContent = 'Activate transaction';
        activate.addEventListener('click', function () { updateVendorTransaction(transaction.escrowId, 'ACTIVE'); });
        card.appendChild(activate);
      }
      if (transaction.status === 'CREATED' || transaction.status === 'SELLER_COLLATERAL_PENDING' || transaction.status === 'BUYER_PAYMENT_PENDING') {
        var cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-rose-400';
        cancel.textContent = 'Cancel transaction';
        cancel.addEventListener('click', function () { updateVendorTransaction(transaction.escrowId, 'CANCELLED'); });
        card.appendChild(cancel);
      }
      if (transaction.status === 'ACTIVE') {
        var delivered = document.createElement('button');
        delivered.type = 'button';
        delivered.className = 'rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500';
        delivered.textContent = 'Mark delivered';
        delivered.addEventListener('click', function () { updateVendorTransaction(transaction.escrowId, 'DELIVERED'); });
        card.appendChild(delivered);
      }
      if (transaction.status === 'ACTIVE' || transaction.status === 'DELIVERED') {
        var dispute = document.createElement('button');
        dispute.type = 'button';
        dispute.className = 'rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-200 hover:bg-rose-950/30';
        dispute.textContent = 'Raise a dispute';
        dispute.addEventListener('click', function () {
          var reason = window.prompt('Briefly describe the dispute:');
          if (reason && reason.trim()) updateVendorTransaction(transaction.escrowId, 'DISPUTED', reason.trim());
        });
        card.appendChild(dispute);
      }
      if (transaction.paymentStatus === 'MOCK_CONFIRMED' && ['ACTIVE', 'DELIVERED', 'DISPUTED'].includes(transaction.status)) {
        var refund = document.createElement('button');
        refund.type = 'button';
        refund.className = 'ml-2 rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-200 hover:bg-rose-950/30';
        refund.textContent = 'Record mock refund';
        refund.addEventListener('click', function () { refundVendorTransaction(transaction.escrowId); });
        card.appendChild(refund);
      }
      container.appendChild(card);
    });
  }

  async function refreshVendorTransactions() {
    if (!window.EscrowTransactions) return;
    if (vendorTransactionStatus) vendorTransactionStatus.textContent = 'Loading saved transactions…';
    try {
      var transactions = await window.EscrowTransactions.listVendor();
      if (vendorTransactionCount) vendorTransactionCount.textContent = transactions.length + ' transaction' + (transactions.length === 1 ? '' : 's');
      renderVendorTransactionList(vendorTransactionFeed, transactions);
      renderVendorTransactionList(directLinkTransactionList, transactions);
      if (vendorTransactionStatus) vendorTransactionStatus.textContent = 'Payment provider: MOCK · no funds move.';
    } catch (error) {
      if (vendorTransactionStatus) vendorTransactionStatus.textContent = error.message || 'Transactions could not be loaded.';
    }
  }

  async function updateVendorTransaction(escrowId, status, reason) {
    try {
      await window.EscrowTransactions.setVendorStatus(escrowId, status, reason);
      await refreshVendorTransactions();
    } catch (error) {
      if (vendorTransactionStatus) vendorTransactionStatus.textContent = error.message || 'Transaction status could not be updated.';
    }
  }

  async function refundVendorTransaction(escrowId) {
    try {
      await window.EscrowTransactions.refundVendorTransaction(escrowId);
      await refreshVendorTransactions();
    } catch (error) {
      if (vendorTransactionStatus) vendorTransactionStatus.textContent = error.message || 'Mock refund could not be recorded.';
    }
  }

  function refreshDirectLinkTransactionList() {
    if (window.EscrowTransactions) refreshVendorTransactions();
  }

  var refreshVendorLinksButton = document.getElementById('refresh-vendor-links');
  var refreshVendorTransactionsButton = document.getElementById('vendor-refresh-transactions');
  if (refreshVendorLinksButton) refreshVendorLinksButton.addEventListener('click', refreshDirectLinkTransactionList);
  if (refreshVendorTransactionsButton) refreshVendorTransactionsButton.addEventListener('click', refreshVendorTransactions);
  if (document.body.dataset.dashboardRole !== 'buyer') refreshVendorTransactions();
  validateDirectLinkForm();

  /* ── Quote Hub sub-tab toggle: switch between Quote Requests & Milestone Agreements ── */
  var quoteHubToggles = document.querySelectorAll('.quote-hub-toggle');
  var panelQuotes = document.getElementById('panel-quote-requests');
  var panelMilestones = document.getElementById('panel-milestone-agreements');
  if (quoteHubToggles.length && panelQuotes && panelMilestones) {
    quoteHubToggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        quoteHubToggles.forEach(function (b) {
          b.classList.remove('bg-slate-800', 'text-slate-100', 'font-semibold');
          b.classList.add('text-slate-400');
        });
        btn.classList.remove('text-slate-400');
        btn.classList.add('bg-slate-800', 'text-slate-100', 'font-semibold');
        if (btn.id === 'tab-trigger-quotes') {
          panelQuotes.classList.remove('hidden');
          panelMilestones.classList.add('hidden');
        } else {
          panelMilestones.classList.remove('hidden');
          panelQuotes.classList.add('hidden');
        }
      });
    });
  }

  /* ── Jump to Direct Links from Quote Requests banner ── */
  var jumpToDirectLinks = document.getElementById('jump-to-direct-links');
  if (jumpToDirectLinks) {
    jumpToDirectLinks.addEventListener('click', function (e) {
      e.preventDefault();
      showView('direct-links');
    });
  }

  /* ── Buyer Hub sub-tab highlight toggle ── */
  var buyerHubTabs = document.querySelectorAll('.buyer-hub-tab');
  buyerHubTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      buyerHubTabs.forEach(function (t) {
        t.classList.remove('bg-slate-800', 'text-slate-100', 'font-semibold', 'shadow-inner');
        t.classList.add('text-slate-400');
      });
      tab.classList.remove('text-slate-400');
      tab.classList.add('bg-slate-800', 'text-slate-100', 'font-semibold', 'shadow-inner');
    });
  });

  /* ── Funded Repayments: tab toggle highlight ── */
  var fundedRepaymentTabs = document.querySelectorAll('.funded-repayments-tab');
  fundedRepaymentTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      fundedRepaymentTabs.forEach(function (t) {
        t.classList.remove('bg-emerald-500/10', 'text-emerald-300', 'border-emerald-500/30');
        t.classList.add('bg-slate-950/60', 'text-slate-400', 'border-slate-800/60');
      });
      tab.classList.remove('bg-slate-950/60', 'text-slate-400', 'border-slate-800/60');
      tab.classList.add('bg-emerald-500/10', 'text-emerald-300', 'border-emerald-500/30');
    });
  });

  /* ── Ensure alternate views are hidden on initial paint ── */
  if (workOrdersView)       workOrdersView.classList.add('hidden');
  if (bulkActionsView)      bulkActionsView.classList.add('hidden');
  if (proformaInvoicesView) proformaInvoicesView.classList.add('hidden');
  if (billPaymentsView)     billPaymentsView.classList.add('hidden');
  if (feeSimulatorView)     feeSimulatorView.classList.add('hidden');
  if (directLinksView)      directLinksView.classList.add('hidden');
  if (buyerLookupView)      buyerLookupView.classList.add('hidden');
  if (quoteRequestsView)    quoteRequestsView.classList.add('hidden');
  if (lenderLookupView)     lenderLookupView.classList.add('hidden');
  if (requestFinancingView) requestFinancingView.classList.add('hidden');
  if (repaymentsView)       repaymentsView.classList.add('hidden');
  if (fundedRepaymentsView) fundedRepaymentsView.classList.add('hidden');
  if (proofExplorerView)    proofExplorerView.classList.add('hidden');
  if (messagesView)         messagesView.classList.add('hidden');
  if (disputesView)         disputesView.classList.add('hidden');
  if (helpCenterView)       helpCenterView.classList.add('hidden');
  if (settingsView)         settingsView.classList.add('hidden');
});