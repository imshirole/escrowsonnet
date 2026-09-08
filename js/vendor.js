/**
 * js/vendor.js — Standalone dashboard logic for vendordashboard.html only.
 * No references to '#homepage-content' or '#auth-content'.
 * Handles sidebar navigation between Overview, Work Orders, and Bulk Actions views,
 * fold toggles, lifecycle tabs, sign-out, and back-to-home redirects.
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ── DOM refs for all content views ── */
  var overviewView         = document.getElementById('vendor-overview-view');
  var workOrdersView       = document.getElementById('work-orders-view');
  var bulkActionsView      = document.getElementById('bulk-actions-view');
  var proformaInvoicesView = document.getElementById('proforma-invoices-view');
  var billPaymentsView     = document.getElementById('bill-payments-view');
  var feeSimulatorView     = document.getElementById('fee-simulator-view');
  var directLinksView      = document.getElementById('direct-links-view');
  var buyerLookupView      = document.getElementById('buyer-lookup-view');
  var quoteRequestsView    = document.getElementById('quote-requests-view');
  var analyticsReportsView = document.getElementById('analytics-reports-view');
  var lenderLookupView     = document.getElementById('lender-lookup-view');
  var requestFinancingView = document.getElementById('request-financing-view');
  var repaymentsView       = document.getElementById('repayments-view');
  var fundedRepaymentsView = document.getElementById('funded-repayments-view');

  var allViews = [overviewView, workOrdersView, bulkActionsView, proformaInvoicesView, billPaymentsView, feeSimulatorView, directLinksView, buyerLookupView, quoteRequestsView, analyticsReportsView, lenderLookupView, requestFinancingView, repaymentsView, fundedRepaymentsView];

  /* ── Centralized view switcher ── */
  function showView(targetViewId) {
    allViews.forEach(function (view) {
      if (view) view.classList.add('hidden');
    });
    var targetMap = {
      'overview':          overviewView,
      'work-orders':       workOrdersView,
      'bulk-actions':      bulkActionsView,
      'proforma-invoices': proformaInvoicesView,
      'bill-payments':     billPaymentsView,
      'fee-simulator':     feeSimulatorView,
      'direct-links':      directLinksView,
      'buyer-lookup':      buyerLookupView,
      'quote-requests':    quoteRequestsView,
      'analytics-reports': analyticsReportsView,
      'lender-lookup':     lenderLookupView,
      'request-financing': requestFinancingView,
      'repayments':        repaymentsView,
      'funded-repayments': fundedRepaymentsView
    };
    var target = targetMap[targetViewId];
    if (target) target.classList.remove('hidden');
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

  /* ── Sidebar "Analytics & Report" link (inside vendor-submenu-tools) ── */
  var analyticsReportsLink = document.querySelector('#vendor-submenu-tools a');
  if (analyticsReportsLink) {
    analyticsReportsLink.addEventListener('click', function (e) {
      e.preventDefault();
      showView('analytics-reports');
    });
  }

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

  /* ── Direct Links: Drawer toggle & validation ── */
  var createNewLinkBtn = document.getElementById('create-new-link-btn');
  var invoiceDrawer = document.getElementById('invoice-generator-drawer');
  var invoiceItemDesc = document.getElementById('invoice-item-desc');
  var invoiceItemPrice = document.getElementById('invoice-item-price');
  var submitPaymentBtn = document.getElementById('submit-payment-link-generation');

  /* Open drawer on "+ New" click */
  if (createNewLinkBtn && invoiceDrawer) {
    createNewLinkBtn.addEventListener('click', function () {
      invoiceDrawer.classList.remove('hidden');
    });
  }

  /* Close drawer when clicking outside the modal content */
  if (invoiceDrawer) {
    invoiceDrawer.addEventListener('click', function (e) {
      if (e.target === invoiceDrawer) {
        invoiceDrawer.classList.add('hidden');
      }
    });
  }

  /* Validation: enable generate button when description and price are filled */
  function validateInvoiceFields() {
    var desc = invoiceItemDesc ? invoiceItemDesc.value.trim() : '';
    var price = invoiceItemPrice ? parseFloat(invoiceItemPrice.value) : 0;
    if (desc.length > 0 && price > 0) {
      submitPaymentBtn.className = 'bg-emerald-600 hover:bg-emerald-500 text-slate-100 cursor-pointer w-full py-3 rounded-lg font-bold transition-all mt-4';
    } else {
      submitPaymentBtn.className = 'bg-slate-500 text-slate-200 cursor-not-allowed w-full py-3 rounded-lg font-bold transition-all mt-4';
    }
  }

  if (invoiceItemDesc) {
    invoiceItemDesc.addEventListener('input', validateInvoiceFields);
  }
  if (invoiceItemPrice) {
    invoiceItemPrice.addEventListener('input', validateInvoiceFields);
  }

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

  /* ── Analytics Hub sub-tab highlight toggle + panel routing ── */
  var analyticsHubTabs = document.querySelectorAll('.analytics-hub-tab');
  var analyticsPanelDefault = document.getElementById('analytics-panel-default');
  var analyticsPanelWidget   = document.getElementById('analytics-panel-widget');
  var analyticsPanelReports  = document.getElementById('analytics-panel-reports');
  var analyticsPanelArchives = document.getElementById('analytics-panel-archives');
  if (analyticsHubTabs.length && analyticsPanelDefault && analyticsPanelWidget && analyticsPanelReports && analyticsPanelArchives) {
    analyticsHubTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        analyticsHubTabs.forEach(function (t) {
          t.classList.remove('bg-slate-800', 'text-slate-100', 'font-semibold');
          t.classList.add('text-slate-400');
        });
        tab.classList.remove('text-slate-400');
        tab.classList.add('bg-slate-800', 'text-slate-100', 'font-semibold');
        /* Route panels by index: 0=Analytics, 1=Widget, 2=Reports, 3=Archives */
        analyticsPanelDefault.classList.add('hidden');
        analyticsPanelWidget.classList.add('hidden');
        analyticsPanelReports.classList.add('hidden');
        analyticsPanelArchives.classList.add('hidden');
        if (analyticsHubTabs[0] === tab) {
          analyticsPanelDefault.classList.remove('hidden');
        } else if (analyticsHubTabs[1] === tab) {
          analyticsPanelWidget.classList.remove('hidden');
        } else if (analyticsHubTabs[2] === tab) {
          analyticsPanelReports.classList.remove('hidden');
        } else if (analyticsHubTabs[3] === tab) {
          analyticsPanelArchives.classList.remove('hidden');
        }
      });
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
  if (analyticsReportsView) analyticsReportsView.classList.add('hidden');
  if (lenderLookupView)     lenderLookupView.classList.add('hidden');
  if (requestFinancingView) requestFinancingView.classList.add('hidden');
  if (repaymentsView)       repaymentsView.classList.add('hidden');
  if (fundedRepaymentsView) fundedRepaymentsView.classList.add('hidden');
});