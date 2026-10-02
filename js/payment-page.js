document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var token = window.location.pathname.split('/')[2] || '';
  var loading = document.getElementById('payment-loading');
  var errorPanel = document.getElementById('payment-error');
  var transactionPanel = document.getElementById('payment-transaction');
  var proceedButton = document.getElementById('proceed-payment-btn');
  var mockConfirmButton = document.getElementById('confirm-mock-payment-btn');
  var refreshStatusButton = document.getElementById('refresh-payment-status-btn');
  var buyerActions = document.getElementById('buyer-transaction-actions');
  var disputeButton = document.getElementById('buyer-dispute-btn');
  var completeButton = document.getElementById('buyer-complete-btn');
  var actionStatus = document.getElementById('payment-action-status');
  var transaction = null;

  function formatMoney(amount, currency) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount));
  }

  function setActionStatus(message) {
    actionStatus.textContent = message;
  }

  async function readJsonResponse(response) {
    if (response.status === 204) return {};
    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (error) {
      return { ok: false, error: text || 'The server returned an invalid response.' };
    }
  }

  function render(data) {
    transaction = data;
    const sellerReady = data.sellerCollateralStatus === 'RECEIVED' || ['SELLER_FUNDED', 'BUYER_PAYMENT_PENDING', 'BUYER_FUNDED', 'ACTIVE', 'DELIVERED', 'DISPUTED', 'COMPLETED'].includes(data.status);
    if (!sellerReady) {
      loading.classList.add('hidden');
      errorPanel.classList.remove('hidden');
      errorPanel.textContent = 'Payment unavailable until the seller deposits the required 30% collateral.';
      transactionPanel.classList.add('hidden');
      return;
    }
    document.getElementById('payment-escrow-id').textContent = data.escrowId;
    document.getElementById('payment-escrow-status').textContent = data.status.replaceAll('_', ' ');
    document.getElementById('payment-vendor').textContent = data.vendor.name;
    document.getElementById('payment-status').textContent = data.paymentStatus + (data.paymentMode ? ' · ' + data.paymentMode : '');
    document.getElementById('payment-invoice').textContent = formatMoney(data.invoiceAmount, data.currency);
    document.getElementById('payment-buyer-collateral').textContent = formatMoney(data.buyerCollateral, data.currency);
    document.getElementById('payment-seller-collateral').textContent = formatMoney(data.sellerCollateral, data.currency);
    document.getElementById('payment-buyer-total').textContent = formatMoney(data.totalRequiredFromBuyer, data.currency);
    document.getElementById('payment-delivery-date').textContent = new Date(`${data.expectedDeliveryDate}T00:00:00`).toLocaleDateString();
    document.getElementById('payment-description').textContent = data.description;
    document.getElementById('payment-delivery-terms').textContent = data.deliveryTerms;

    proceedButton.classList.toggle('hidden', !['SELLER_FUNDED', 'BUYER_PAYMENT_PENDING'].includes(data.status));
    proceedButton.disabled = data.status === 'BUYER_PAYMENT_PENDING';
    proceedButton.textContent = data.status === 'BUYER_PAYMENT_PENDING' ? 'Payment step created' : 'Proceed to Payment';
    mockConfirmButton.classList.toggle('hidden', data.status !== 'BUYER_PAYMENT_PENDING');
    buyerActions.classList.toggle('hidden', !['BUYER_FUNDED', 'ACTIVE', 'DELIVERED', 'DISPUTED'].includes(data.status));
    disputeButton.classList.toggle('hidden', !['ACTIVE', 'DELIVERED'].includes(data.status));
    completeButton.classList.toggle('hidden', data.status !== 'DELIVERED');
    loading.classList.add('hidden');
    errorPanel.classList.add('hidden');
    transactionPanel.classList.remove('hidden');
  }

  async function loadTransaction() {
    try {
      const response = await fetch(`/api/payment-links/${encodeURIComponent(token)}`);
      const result = await readJsonResponse(response);
      if (!response.ok || result.ok === false) throw new Error(result.error || 'Payment link could not be loaded');
      render(result.transaction);
    } catch (error) {
      loading.classList.add('hidden');
      errorPanel.classList.remove('hidden');
      errorPanel.textContent = error.message || 'This payment link is invalid or unavailable.';
    }
  }

  refreshStatusButton.addEventListener('click', loadTransaction);

  proceedButton.addEventListener('click', async function () {
    proceedButton.disabled = true;
    setActionStatus('Creating a mock payment step. No funds will move.');
    try {
      const response = await fetch(`/api/payment-links/${encodeURIComponent(token)}/proceed`, { method: 'POST' });
      const result = await readJsonResponse(response);
      if (!response.ok || result.ok === false) throw new Error(result.error || 'Could not start the mock payment step');
      setActionStatus(result.message || 'Mock payment step is ready.');
      render(result.transaction);
    } catch (error) {
      proceedButton.disabled = false;
      setActionStatus(error.message || 'Mock payment step could not be started.');
    }
  });

  mockConfirmButton.addEventListener('click', async function () {
    mockConfirmButton.disabled = true;
    setActionStatus('Recording a mock payment confirmation only.');
    try {
      const response = await fetch(`/api/payment-links/${encodeURIComponent(token)}/mock-confirm`, { method: 'POST' });
      const result = await readJsonResponse(response);
      if (!response.ok || result.ok === false) throw new Error(result.error || 'Mock payment could not be confirmed');
      setActionStatus('Mock payment recorded. No real payment was made.');
      render(result.transaction);
    } catch (error) {
      mockConfirmButton.disabled = false;
      setActionStatus(error.message || 'Mock confirmation failed.');
    }
  });

  disputeButton.addEventListener('click', async function () {
    const reason = window.prompt('Briefly describe the dispute:');
    if (!reason || !reason.trim()) return;
    await updateBuyerStatus('DISPUTED', reason.trim());
  });

  completeButton.addEventListener('click', async function () {
    await updateBuyerStatus('COMPLETED');
  });

  async function updateBuyerStatus(status, reason) {
    setActionStatus('Updating transaction status…');
    try {
      const response = await fetch(`/api/payment-links/${encodeURIComponent(token)}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      });
      const result = await readJsonResponse(response);
      if (!response.ok || result.ok === false) throw new Error(result.error || 'Transaction could not be updated');
      render(result.transaction);
      setActionStatus('Transaction status updated. Payment status remains clearly marked as a mock.');
    } catch (error) {
      setActionStatus(error.message || 'Transaction could not be updated.');
    }
  }

  loadTransaction();
});
