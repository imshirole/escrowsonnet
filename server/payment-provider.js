const { randomBytes } = require("node:crypto");

class PaymentProvider {
  async createPayment() {
    throw new Error("PaymentProvider.createPayment() must be implemented");
  }

  async getPaymentStatus() {
    throw new Error("PaymentProvider.getPaymentStatus() must be implemented");
  }

  async verifyPayment() {
    throw new Error("PaymentProvider.verifyPayment() must be implemented");
  }

  async refundPayment() {
    throw new Error("PaymentProvider.refundPayment() must be implemented");
  }
}

class MockPaymentProvider extends PaymentProvider {
  async createPayment(transaction) {
    return {
      paymentProviderId: `MOCK-${randomBytes(12).toString("hex").toUpperCase()}`,
      paymentProviderStatus: "PENDING",
      paymentMode: "MOCK",
      displayMessage: "Mock payment only. No funds are moved."
    };
  }

  async getPaymentStatus(payment) {
    return {
      paymentProviderId: payment.payment_provider_id,
      status: payment.payment_provider_status || "NOT_CREATED",
      mode: "MOCK"
    };
  }

  async verifyPayment(payment, { simulateSuccess = false } = {}) {
    if (!simulateSuccess) return { verified: false, status: payment.payment_provider_status || "PENDING", mode: "MOCK" };
    if (!payment.payment_provider_id) throw new Error("Mock payment has not been created");
    return {
      verified: true,
      status: "MOCK_CONFIRMED",
      mode: "MOCK",
      displayMessage: "Mock confirmation only. This does not represent a real payment."
    };
  }

  async refundPayment(payment) {
    if (payment.payment_provider_status !== "MOCK_CONFIRMED") {
      throw new Error("Only a mock-confirmed payment can be refunded");
    }
    return {
      refunded: true,
      status: "MOCK_REFUNDED",
      mode: "MOCK",
      displayMessage: "Mock refund recorded. No funds were moved."
    };
  }
}

module.exports = { PaymentProvider, MockPaymentProvider };
