document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  var idInput = document.getElementById('buyer-escrow-id');
  var openButton = document.getElementById('buyer-open-payment-link');
  if (!idInput || !openButton) return;

  function openPaymentLink() {
    var escrowId = idInput.value.trim().toUpperCase();
    if (!/^ESC-\d{4}-[A-F0-9]{32}$/.test(escrowId)) {
      idInput.setCustomValidity('Enter the escrow ID from your vendor payment link.');
      idInput.reportValidity();
      return;
    }
    idInput.setCustomValidity('');
    window.location.href = '/pay/' + encodeURIComponent(escrowId);
  }

  idInput.addEventListener('input', function () { idInput.setCustomValidity(''); });
  idInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') openPaymentLink();
  });
  openButton.addEventListener('click', openPaymentLink);
});
