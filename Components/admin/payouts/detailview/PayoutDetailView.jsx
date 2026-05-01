"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import useAdminOwnerPayoutStore from "../../../../app/store/payouts/useAdminOwnerPayoutStore";
import usePaymentAccountStore from "../../../../app/store/payment-account/payment-accountStore";
import useServicePaymentKhqrStore from "../../../../app/store/khqr/useServicePaymentKhqrStore";
import TopBar from "./TopBar";
import StateCards from "./StateCards";
import OwnerSummary from "./OwnerSummary";
import TransactionsList from "./TransactionsList";
import Pagination from "./Pagination";
import ProcessPayoutModal from "./ProcessPayoutModal";

const PayoutDetailView = () => {
  const router = useRouter();
  const params = useParams();
  const ownerId = params?.id;

  const hasReleasedPayoutRef = useRef(false);
  const isCheckingTransactionRef = useRef(false);

  const {
    payouts,
    payoutsPagination,
    payoutsLoading,
    payoutsError,
    payoutsEmpty,
    fetchPayouts,
    payOwnerPayouts,
  } = useAdminOwnerPayoutStore();

  const { getPaymentAccountByUserId, paymentAccount } =
    usePaymentAccountStore();

  const {
    loading: khqrLoading,
    error: khqrError,
    generateMerchantKhqr,
    generateKhqrImage,
    checkTransactionByMd5,
    transactionResult,
  } = useServicePaymentKhqrStore();

  const userId = payouts?.[0]?.owner?.user_id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingTransaction, setIsCheckingTransaction] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedKhqr, setGeneratedKhqr] = useState(null);

  useEffect(() => {
    if (ownerId) {
      fetchPayouts({ owner_id: ownerId });
    }
  }, [ownerId, fetchPayouts]);

  useEffect(() => {
    if (userId) {
      getPaymentAccountByUserId(userId);
    }
  }, [userId, getPaymentAccountByUserId]);

  const owner = payouts?.[0]?.owner ?? null;

  const totals = useMemo(() => {
    return payouts.reduce(
      (acc, curr) => {
        const amount = Number(curr.amount || 0);

        if (curr.status === "paid") {
          acc.paid += amount;
        }

        if (curr.status === "pending") {
          acc.pending += amount;
          acc.pendingIds.push(curr.id);
        }

        return acc;
      },
      {
        paid: 0,
        pending: 0,
        pendingIds: [],
      }
    );
  }, [payouts]);

  const refreshPayouts = useCallback(async () => {
    if (!ownerId) return;

    await fetchPayouts({ owner_id: ownerId });
  }, [ownerId, fetchPayouts]);

  const handlePaginationClick = (link) => {
    if (!link?.url || link.active) return;

    const url = new URL(link.url);
    const page = url.searchParams.get("page");

    if (page) {
      fetchPayouts({
        owner_id: ownerId,
        page,
      });
    }
  };

  const handleOpenModal = () => {
    hasReleasedPayoutRef.current = false;
    isCheckingTransactionRef.current = false;

    setGeneratedKhqr(null);
    setCopied(false);
    setIsCheckingTransaction(false);
    setIsModalOpen(true);
  };

  const isSuccessfulTransaction = (result) => {
    return (
      result?.success === true &&
      result?.status === 200 &&
      result?.data?.responseCode === 0 &&
      String(result?.data?.responseMessage || "").toLowerCase() === "success"
    );
  };

  const getReadableErrorMessage = (err, fallback = "Something went wrong") => {
    return (
      err?.response?.data?.data?.responseMessage ||
      err?.response?.data?.responseMessage ||
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      Object.values(err?.response?.data?.errors || {})?.flat()?.[0] ||
      err?.message ||
      fallback
    );
  };

  const handleCheckTransaction = useCallback(
    async (showAlert = false) => {
      if (!generatedKhqr?.md5) {
        if (showAlert) alert("MD5 reference is missing");
        return null;
      }

      if (isCheckingTransactionRef.current) {
        return null;
      }

      isCheckingTransactionRef.current = true;
      setIsCheckingTransaction(true);

      try {
        const result = await checkTransactionByMd5(generatedKhqr.md5);

        console.log("Transaction result:", result);

        const isSuccess = isSuccessfulTransaction(result);

        if (
          isSuccess &&
          totals.pendingIds.length > 0 &&
          !hasReleasedPayoutRef.current
        ) {
          hasReleasedPayoutRef.current = true;

          await payOwnerPayouts({ ids: totals.pendingIds });
          await refreshPayouts();
        }

        if (showAlert) {
          alert(
            result?.data?.responseMessage ||
              result?.responseMessage ||
              result?.message ||
              "Transaction checked successfully"
          );
        }

        return result;
      } catch (err) {
        console.log("Check transaction error:", err?.response?.data || err);

        if (showAlert) {
          alert(getReadableErrorMessage(err, "Failed to check transaction"));
        }

        throw err;
      } finally {
        isCheckingTransactionRef.current = false;
        setIsCheckingTransaction(false);
      }
    },
    [
      generatedKhqr?.md5,
      checkTransactionByMd5,
      totals.pendingIds,
      payOwnerPayouts,
      refreshPayouts,
    ]
  );

  const handleProcessPayment = async (e) => {
    e?.preventDefault?.();

    if (!ownerId) {
      alert("Owner ID is missing");
      return;
    }

    if (!paymentAccount?.account_id) {
      alert("Bakong account ID is missing");
      return;
    }

    if (totals.pendingIds.length === 0 || Number(totals.pending) <= 0) {
      alert("No pending payouts to release");
      return;
    }

    hasReleasedPayoutRef.current = false;
    isCheckingTransactionRef.current = false;

    setIsSubmitting(true);
    setIsCheckingTransaction(false);
    setGeneratedKhqr(null);
    setCopied(false);

    try {
      const khqrResponse = await generateMerchantKhqr({
        bakong_account_id: paymentAccount.account_id,
        merchant_id: String(paymentAccount.user_id || userId || ownerId).slice(
          0,
          32
        ),
        acquiring_bank: "Bakong",
        currency: "usd",
        merchant_name: String(owner?.business_name || "Merchant").slice(0, 25),
        amount: Number(totals.pending),
        merchant_city: String(
          paymentAccount.account_city || "Phnom Penh"
        ).slice(0, 15),
        bill_number: `PAYOUT-${ownerId}-${Date.now()}`.slice(0, 25),
        purpose_of_transaction: "Owner payout".slice(0, 25),
        expiration_timestamp: Date.now() + 10 * 60 * 1000,
        merchant_category_code: "5999",
      });

      const qr = khqrResponse?.data?.data?.qr;
      const md5 = khqrResponse?.data?.data?.md5;

      if (!qr || !md5) {
        alert("Failed to generate KHQR.");
        return;
      }

      const imageResponse = await generateKhqrImage({ qr });

      const qrImage =
        imageResponse?.data?.image ||
        imageResponse?.data?.qr_image ||
        imageResponse?.data?.data?.image ||
        imageResponse?.data?.data?.qr_image ||
        imageResponse?.image ||
        imageResponse?.qr_image ||
        null;

      if (!qrImage) {
        alert("KHQR was generated, but QR image could not be created.");
        return;
      }

      setGeneratedKhqr({
        qr,
        md5,
        image: qrImage,
      });
    } catch (err) {
      console.log("KHQR/Payout error:", err?.response?.data || err);

      alert(getReadableErrorMessage(err, "Payment failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans selection:bg-indigo-100">
      <div className="max-w-5xl mx-auto">
        <TopBar
          router={router}
          payouts={payouts}
          totals={totals}
          onOpenModal={handleOpenModal}
        />

        <StateCards
          loading={payoutsLoading}
          error={payoutsError}
          empty={payoutsEmpty}
          ownerId={ownerId}
          fetchPayouts={fetchPayouts}
        />

        {!payoutsLoading &&
          !payoutsError &&
          !payoutsEmpty &&
          payouts.length > 0 && (
            <>
              <OwnerSummary owner={owner} totals={totals} />

              <TransactionsList payouts={payouts} />

              <Pagination
                pagination={payoutsPagination}
                onPaginationClick={handlePaginationClick}
              />
            </>
          )}
      </div>

      {isModalOpen && (
        <ProcessPayoutModal
          totals={totals}
          paymentAccount={paymentAccount}
          khqrError={khqrError}
          khqrLoading={khqrLoading}
          generatedKhqr={generatedKhqr}
          copied={copied}
          isSubmitting={isSubmitting}
          isCheckingTransaction={isCheckingTransaction}
          transactionResult={transactionResult}
          setCopied={setCopied}
          setIsModalOpen={setIsModalOpen}
          handleProcessPayment={handleProcessPayment}
          handleCheckTransaction={handleCheckTransaction}
        />
      )}
    </div>
  );
};

export default PayoutDetailView;
