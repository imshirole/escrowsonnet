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

    function formatFinancialUSD(amount) {
      return 'USD ' + amount.toFixed(2);
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
      if (document.getElementById('toggle-round-usd')?.checked) escrowLock = Math.round(escrowLock);
      if (summarySubtotal) summarySubtotal.textContent = formatFinancialUSD(subtotal);
      if (summaryNet) summaryNet.textContent = formatFinancialUSD(net);
      if (summaryEscrowLock) summaryEscrowLock.textContent = formatFinancialUSD(escrowLock);
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
    document.getElementById('seller-city')
  ];

  function getInvalidDirectLinkFields() {
    var invalidFields = [];
    var firstConsignment = document.querySelector('.consignment-card');
    var description = firstConsignment?.querySelector('.consignment-description');
    var price = firstConsignment?.querySelector('.consignment-price');
    if (description && !description.value.trim()) invalidFields.push(description);
    if (price && (!(parseFloat(price.value) > 0))) invalidFields.push(price);
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
  if (generatePaymentLinkBtn) {
    generatePaymentLinkBtn.addEventListener('click', function () {
      var invalidFields = validateDirectLinkForm();
      if (invalidFields[0]) {
        invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidFields[0].focus();
      } else {
        generatePaymentLinkBtn.textContent = 'Payment Link Generated';
      }
    });
  }
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