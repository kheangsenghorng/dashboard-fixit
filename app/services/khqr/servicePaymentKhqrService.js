import api from "@/lib/api";

export const servicePaymentKhqrService = {
  // Generate individual KHQR
  generateIndividualKhqr: (data) =>
    api.post("/payments/khqr/individual", data, {
      headers: { Accept: "application/json" },
    }),

  // Generate merchant KHQR
  generateMerchantKhqr: (data) =>
    api.post("/payments/khqr/merchant", data, {
      headers: { Accept: "application/json" },
    }),

  // Generate KHQR image
  generateKhqrImage: (data) =>
    api.post("/payments/khqr/image", data, {
      headers: { Accept: "application/json" },
    }),

  // Generate deeplink
  generateDeeplink: (data) =>
    api.post("/payments/khqr/deeplink", data, {
      headers: { Accept: "application/json" },
    }),

  // Check transaction by MD5
  checkTransactionByMd5: (md5) =>
    api.post(
      "/payments/khqr/check-md5",
      { md5 },
      {
        headers: { Accept: "application/json" },
      }
    ),

  // Check transaction by hash
  checkTransactionByHash: (hash) =>
    api.post(
      "/payments/khqr/check-hash",
      { hash },
      {
        headers: { Accept: "application/json" },
      }
    ),

  // Check Bakong account
  checkBakongAccount: (accountId) =>
    api.post(
      "/payments/khqr/check-account",
      { accountId },
      {
        headers: { Accept: "application/json" },
      }
    ),

  // Check transaction by external reference
  checkTransactionByExternalRef: (externalRef) =>
    api.post(
      "/payments/khqr/check-external-ref",
      {
        external_ref: externalRef,
      },
      {
        headers: { Accept: "application/json" },
      }
    ),
};
