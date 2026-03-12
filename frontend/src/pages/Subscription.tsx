import { CheckCircle2, Sparkles, CreditCard, Shield, Zap, X, Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionService } from "@/lib/subscriptionService";
import { useState } from "react";

type PaymentMethod = 'credit_card' | 'paypal' | 'google_pay';

export default function Subscription() {
  const { user, isPremium, refreshSubscription } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpgradeClick = () => {
    setError(null);
    setSuccess(null);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    setError(null);
    setSuccess(null);
    setIsProcessing(true);

    try {
      // Simulate payment processing for 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Actually upgrade the subscription
      const response = await subscriptionService.upgrade(30); // 30 days
      setSuccess(response.message);
      
      // Refresh subscription status in context
      await refreshSubscription();
      
      // Close modal after success
      setTimeout(() => {
        setShowPaymentModal(false);
      }, 2000);
    } catch (err: any) {
      setError(err.error || "Failed to upgrade subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod('credit_card');
    setError(null);
  };

  const handleCancelSubscriptionClick = () => {
    setError(null);
    setSuccess(null);
    setShowCancelModal(true);
  };

  const handleConfirmCancellation = async () => {
    setError(null);
    setSuccess(null);
    setIsCancelling(true);

    try {
      const response = await subscriptionService.cancel();
      setSuccess(response.message);
      
      // Refresh subscription status in context
      await refreshSubscription();
      
      // Close modal after success
      setTimeout(() => {
        setShowCancelModal(false);
      }, 2000);
    } catch (err: any) {
      setError(err.error || "Failed to cancel subscription. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setError(null);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose the right plan for your productivity needs. Unlock advanced AI features and unlimited possibilities.
          </p>
        </div>

        {/* Status Messages */}
        {error && !showPaymentModal && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300">
            {error}
          </div>
        )}
        
        {success && !showPaymentModal && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-800 dark:text-green-300">
            {success}
          </div>
        )}

      {/* Current Subscription Info */}
      {user && (
        <div className="mb-8 p-4 bg-card border rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Current Subscription</h3>
            {isPremium && (
              <button
                onClick={handleCancelSubscriptionClick}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
              >
                Cancel Subscription
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Plan:</span>
            <span className={isPremium ? "text-primary font-semibold" : ""}>
              {user.subscription_plan === 'premium' ? 'Premium' : 'Free'}
            </span>
            {user.subscription_expires_at && (
              <>
                <span className="mx-2">•</span>
                <span className="font-medium">Expires:</span>
                <span>{formatDate(user.subscription_expires_at)}</span>
              </>
            )}
            {user.subscription_status === 'cancelled' && (
              <>
                <span className="mx-2">•</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">Cancelled</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl border-2 border-border bg-card flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Free Plan</h3>
            <p className="text-muted-foreground text-sm mb-6 h-10">Essential tools for everyday note-taking.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-muted-foreground font-medium"> / month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Up to 200 notes</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>Basic note templates</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>100 AI actions / month</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm line-through">
                <Shield className="w-5 h-5 shrink-0" />
                <span>Advanced Search capabilities</span>
              </li>
            </ul>
          </div>
          <button 
            className="w-full py-2.5 px-4 rounded-xl border-2 border-primary/20 bg-secondary/50 font-semibold text-primary/80 hover:bg-secondary transition-colors" 
            disabled={!isPremium}
          >
            {isPremium ? 'Available' : 'Current Plan'}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="p-8 rounded-2xl border-2 border-primary bg-primary/5 shadow-xl shadow-primary/10 flex flex-col justify-between relative transform lg:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" /> Most Popular
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-primary">Premium Plan</h3>
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-muted-foreground text-sm mb-6 h-10">Advanced tools and unlimited AI for power users.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-foreground">$12</span>
              <span className="text-muted-foreground font-medium"> / month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Unlimited notes</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>All premium note templates</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Unlimited AI tools & transformations</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Advanced search & insights dashboard</span>
              </li>
            </ul>
          </div>
          <button 
            onClick={handleUpgradeClick}
            disabled={isPremium}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg focus:ring-4 focus:ring-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-4 h-4" />
            {isPremium ? 'Current Plan' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Complete Payment</h2>
                  <p className="text-sm text-muted-foreground">Premium Subscription</p>
                </div>
              </div>
              {!isProcessing && (
                <button
                  onClick={handleCancelPayment}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Price */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-bold">$12.00</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Billing Period</span>
                  <span>Monthly (30 days)</span>
                </div>
              </div>

              {isProcessing ? (
                /* Processing State */
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Processing Payment...</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please wait while we process your payment securely.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>256-bit SSL Encrypted</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-3 block">Select Payment Method</label>
                    <div className="space-y-3">
                      {/* Credit Card */}
                      <button
                        onClick={() => setSelectedPaymentMethod('credit_card')}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          selectedPaymentMethod === 'credit_card'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'credit_card' ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedPaymentMethod === 'credit_card' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Credit / Debit Card</span>
                      </button>

                      {/* PayPal */}
                      <button
                        onClick={() => setSelectedPaymentMethod('paypal')}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          selectedPaymentMethod === 'paypal'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'paypal' ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedPaymentMethod === 'paypal' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          P
                        </div>
                        <span className="font-medium">PayPal</span>
                      </button>

                      {/* Google Pay */}
                      <button
                        onClick={() => setSelectedPaymentMethod('google_pay')}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          selectedPaymentMethod === 'google_pay'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'google_pay' ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {selectedPaymentMethod === 'google_pay' && (
                            <div className="w-3 h-3 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          G
                        </div>
                        <span className="font-medium">Google Pay</span>
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelPayment}
                      className="flex-1 py-2.5 px-4 rounded-xl border-2 border-border hover:bg-secondary transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Pay $12.00
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Cancel Subscription</h2>
                  <p className="text-sm text-muted-foreground">Are you sure?</p>
                </div>
              </div>
              {!isCancelling && (
                <button
                  onClick={handleCloseCancelModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {isCancelling ? (
                /* Processing State */
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Cancelling Subscription...</h3>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we process your request.
                  </p>
                </div>
              ) : (
                <>
                  {/* Warning Message */}
                  <div className="mb-6">
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        What happens when you cancel?
                      </h4>
                      <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-6 list-disc">
                        <li>Your Premium features will remain active until the expiration date</li>
                        <li>You won't be charged for the next billing cycle</li>
                        <li>After expiration, you'll be downgraded to the Free plan</li>
                        <li>You can re-subscribe anytime</li>
                      </ul>
                    </div>

                    {user?.subscription_expires_at && (
                      <p className="text-sm text-muted-foreground">
                        Your Premium access will continue until{' '}
                        <span className="font-semibold text-foreground">
                          {formatDate(user.subscription_expires_at)}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-green-800 dark:text-green-300 text-sm">
                      {success}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCloseCancelModal}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors font-medium"
                    >
                      Keep Subscription
                    </button>
                    <button
                      onClick={handleConfirmCancellation}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel Subscription
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
