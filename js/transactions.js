(function () {
  'use strict';

  async function parseJSONResponse(response) {
    if (response.status === 204) return {};
    var text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (error) {
      return { ok: false, error: text || 'The server returned an invalid response.' };
    }
  }

  async function requestJSON(url, options) {
    var response = await fetch(url, Object.assign({ credentials: 'same-origin' }, options || {}));
    var body = await parseJSONResponse(response);
    if (!response.ok || body.ok === false) throw new Error(body.error || 'Transaction request failed');
    return body;
  }

  window.EscrowTransactions = {
    async create(payload) {
      var result = await requestJSON('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return result.transaction;
    },
    async listVendor() {
      var result = await requestJSON('/api/transactions');
      return result.transactions;
    },
    async createDemoQr(demoUri) {
      var result = await requestJSON('/api/demo-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoUri: demoUri })
      });
      return result.qrDataUrl;
    },
    async setVendorStatus(escrowId, status, reason) {
      var result = await requestJSON('/api/transactions/' + encodeURIComponent(escrowId) + '/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status, reason: reason || '' })
      });
      return result.transaction;
    },
    async depositSellerCollateral(escrowId, details) {
      var result = await requestJSON('/api/transactions/' + encodeURIComponent(escrowId) + '/deposit-collateral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details || {})
      });
      return result.transaction;
    },
    async refundVendorTransaction(escrowId) {
      var result = await requestJSON('/api/transactions/' + encodeURIComponent(escrowId) + '/refund', { method: 'POST' });
      return result.transaction;
    }
  };
})();
