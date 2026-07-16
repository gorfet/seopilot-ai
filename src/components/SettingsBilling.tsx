import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Settings, 
  Lock, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  Zap, 
  Globe, 
  Users, 
  FileText, 
  ArrowRight,
  Info,
  ChevronRight,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  Calendar
} from "lucide-react";

interface SavedCard {
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  name: string;
}

interface SettingsBillingProps {
  userPlan: string;
  setUserPlan: (plan: string) => void;
  whiteLabelName: string;
  setWhiteLabelName: (name: string) => void;
  currentUser?: { email: string; role: string } | null;
  savedCard: SavedCard | null;
  setSavedCard: (card: SavedCard | null) => void;
  billingHistory: Array<{
    id: string;
    date: string;
    amount: string;
    status: string;
    planName: string;
    invoiceNo: string;
  }>;
  setBillingHistory: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    date: string;
    amount: string;
    status: string;
    planName: string;
    invoiceNo: string;
  }>>>;
}

export default function SettingsBilling({
  userPlan,
  setUserPlan,
  whiteLabelName,
  setWhiteLabelName,
  currentUser,
  savedCard,
  setSavedCard,
  billingHistory,
  setBillingHistory
}: SettingsBillingProps) {
  const [jwtProtected, setJwtProtected] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<any>(null);
  
  // Payment Method and Form States
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [billingZip, setBillingZip] = useState("");
  
  // Form status state
  const [checkoutError, setCheckoutError] = useState("");
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isSdkLoading, setIsSdkLoading] = useState(false);

  // Dynamically load and configure PayPal Smart Buttons SDK
  useEffect(() => {
    if (!showCheckoutModal || paymentMethod !== "paypal" || !selectedPlanForCheckout) {
      return;
    }

    let isMounted = true;
    setIsSdkLoading(true);
    setCheckoutError("");

    const clientId = (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "test";
    const scriptId = `paypal-sdk-script-${clientId}`;

    const initializeButtons = () => {
      if (!isMounted) return;
      setIsSdkLoading(false);

      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = ""; // Clear out previous buttons or duplicate frames
      }

      const pWindow = window as any;
      if (pWindow.paypal && pWindow.paypal.Buttons) {
        try {
          pWindow.paypal.Buttons({
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal"
            },
            createOrder: (data: any, actions: any) => {
              const amountValue = selectedPlanForCheckout.price.replace(/[^0-9.]/g, "");
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "USD",
                    value: amountValue || "0"
                  },
                  description: `SEOPilot AI - ${selectedPlanForCheckout.name} Subscription`
                }]
              });
            },
            onApprove: async (data: any, actions: any) => {
              if (!isMounted) return;
              setIsProcessingCheckout(true);
              setCheckoutError("");
              
              try {
                const details = await actions.order.capture();
                if (!isMounted) return;

                const payerEmail = details.payer?.email_address || "paypal-sandbox-user@seopilot.ai";
                const payerName = details.payer?.name?.given_name || "PayPal Member";

                const newPayPalMethod: SavedCard = {
                  brand: "PAYPAL",
                  last4: "Express",
                  expMonth: "07",
                  expYear: "31",
                  name: `${payerName} (${payerEmail})`
                };

                setSavedCard(newPayPalMethod);
                setUserPlan(selectedPlanForCheckout.id);

                const newInvoice = {
                  id: `inv-${Math.random().toString(36).substr(2, 9)}`,
                  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                  amount: `${selectedPlanForCheckout.price}.00`,
                  status: "Paid",
                  planName: selectedPlanForCheckout.name,
                  invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
                };

                setBillingHistory((prev: any[]) => [newInvoice, ...prev]);
                setIsProcessingCheckout(false);
                setCheckoutSuccess(true);

                setTimeout(() => {
                  if (isMounted) {
                    setShowCheckoutModal(false);
                    setCheckoutSuccess(false);
                  }
                }, 2000);

              } catch (err: any) {
                console.error("PayPal Capture Error:", err);
                if (isMounted) {
                  setCheckoutError("Failed to complete transaction processing. Please try again.");
                  setIsProcessingCheckout(false);
                }
              }
            },
            onError: (err: any) => {
              console.error("PayPal Smart Button Error:", err);
              if (isMounted) {
                setCheckoutError("PayPal checkout processing error. Please check your credentials or credentials setup.");
                setIsProcessingCheckout(false);
              }
            },
            onCancel: () => {
              if (isMounted) {
                setCheckoutError("PayPal checkout session was cancelled by user.");
                setIsProcessingCheckout(false);
              }
            }
          }).render("#paypal-button-container");
        } catch (renderError) {
          console.error("Failed to render PayPal Smart Buttons:", renderError);
          if (isMounted) {
            setCheckoutError("Renderer error: Could not attach PayPal buttons container.");
          }
        }
      } else {
        if (isMounted) {
          setCheckoutError("PayPal SDK script failed initialization. Please reload the portal.");
        }
      }
    };

    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.async = true;
      script.onload = () => {
        initializeButtons();
      };
      script.onerror = () => {
        if (isMounted) {
          setCheckoutError("Failed to load official PayPal gateway components. Verify VITE_PAYPAL_CLIENT_ID configuration.");
          setIsSdkLoading(false);
        }
      };
      document.body.appendChild(script);
    } else {
      if ((window as any).paypal) {
        initializeButtons();
      } else {
        script.addEventListener("load", initializeButtons);
      }
    }

    return () => {
      isMounted = false;
      if (script) {
        script.removeEventListener("load", initializeButtons);
      }
    };
  }, [showCheckoutModal, paymentMethod, selectedPlanForCheckout]);

  const plans = [
    {
      id: "free",
      name: "Free Tier",
      price: "$0",
      priceNum: 0,
      period: "forever",
      description: "Basic diagnostic package for single site owners and bloggers.",
      features: [
        "1 Tracked website target",
        "Standard crawl checks only",
        "Limited basic AI chat queries",
        "Dynamic on-page header stats",
      ],
      cta: "Current Tier"
    },
    {
      id: "pro",
      name: "Pro Strategist",
      price: "$49",
      priceNum: 49,
      period: "mo",
      description: "Ultimate toolkit for professional bloggers, freelancers, and marketers.",
      features: [
        "Unlimited website tracking",
        "Complete technical, content, & speed audits",
        "Unlimited LSI Keyword ideas generator",
        "Full AI strategic content generation drafts",
        "Competitor gap highlights comparison",
        "Weekly automated crawling schedules"
      ],
      cta: "Upgrade to Pro"
    },
    {
      id: "admin",
      name: "Enterprise Admin",
      price: "$149",
      priceNum: 149,
      period: "mo",
      description: "Full authorization for agencies, teams, and e-commerce brands.",
      features: [
        "Everything in Pro strategist",
        "Full white-label downloadable agency PDF reports",
        "JWT secured authorization keys API proxy",
        "Multi-user team management controls",
        "Priority dedicated crawler queue logs",
      ],
      cta: "Upgrade to Enterprise Admin"
    }
  ];

  const detectCardType = (num: string) => {
    const clean = num.replace(/\s+/g, "");
    if (clean.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(clean)) return "mastercard";
    if (/^3[47]/.test(clean)) return "amex";
    if (clean.startsWith("6")) return "discover";
    return "generic";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    // Limit to 16 digits
    if (value.length > 16) value = value.slice(0, 16);
    
    // Format with spaces
    const matches = value.match(/\d{1,4}/g);
    const formatted = matches ? matches.join(" ") : "";
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      setCardExpiry(value.slice(0, 2) + "/" + value.slice(2));
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCardCvv(value);
    }
  };

  const openCheckout = (plan: any) => {
    // If selecting Free plan, switch instantly without card
    if (plan.id === "free") {
      setUserPlan("free");
      // Add $0 invoice
      const newInvoice = {
        id: `inv-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
        amount: "$0.00",
        status: "Paid",
        planName: plan.name,
        invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setBillingHistory(prev => [newInvoice, ...prev]);
      return;
    }

    setSelectedPlanForCheckout(plan);
    setShowCheckoutModal(true);
    setCheckoutError("");
    setCheckoutSuccess(false);
    setPaymentMethod("paypal");
    setPaypalEmail(currentUser?.email || "");
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "paypal") {
      if (!paypalEmail || !paypalEmail.includes("@")) {
        setCheckoutError("Please enter a valid PayPal email address.");
        return;
      }

      setIsProcessingCheckout(true);
      setCheckoutError("");

      setTimeout(() => {
        // Success simulation with PayPal
        const newPayPalMethod: SavedCard = {
          brand: "PAYPAL",
          last4: "Express",
          expMonth: "07",
          expYear: "31",
          name: paypalEmail.trim()
        };

        setSavedCard(newPayPalMethod);
        setUserPlan(selectedPlanForCheckout.id);
        
        // Create new invoice record
        const newInvoice = {
          id: `inv-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
          amount: `${selectedPlanForCheckout.price}.00`,
          status: "Paid",
          planName: selectedPlanForCheckout.name,
          invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
        };

        setBillingHistory(prev => [newInvoice, ...prev]);
        setIsProcessingCheckout(false);
        setCheckoutSuccess(true);

        // Close modal shortly
        setTimeout(() => {
          setShowCheckoutModal(false);
          setCheckoutSuccess(false);
          setPaypalEmail("");
        }, 1500);

      }, 1800);
      return;
    }

    if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 13) {
      setCheckoutError("Please enter a valid card number.");
      return;
    }
    if (!cardExpiry || !cardExpiry.includes("/")) {
      setCheckoutError("Expiry date is invalid.");
      return;
    }
    if (cardCvv.length < 3) {
      setCheckoutError("CVV is invalid.");
      return;
    }
    if (!cardName.trim()) {
      setCheckoutError("Cardholder name is required.");
      return;
    }
    if (!billingZip.trim()) {
      setCheckoutError("ZIP code is required.");
      return;
    }

    setIsProcessingCheckout(true);
    setCheckoutError("");

    setTimeout(() => {
      // Success simulation with credit card
      const brand = detectCardType(cardNumber);
      const last4 = cardNumber.replace(/\s+/g, "").slice(-4);
      const [month, year] = cardExpiry.split("/");

      const newCard: SavedCard = {
        brand: brand.toUpperCase(),
        last4: last4 || "4242",
        expMonth: month,
        expYear: year || "29",
        name: cardName.trim()
      };

      setSavedCard(newCard);
      setUserPlan(selectedPlanForCheckout.id);
      
      // Create new invoice record
      const newInvoice = {
        id: `inv-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
        amount: `${selectedPlanForCheckout.price}.00`,
        status: "Paid",
        planName: selectedPlanForCheckout.name,
        invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setBillingHistory(prev => [newInvoice, ...prev]);
      setIsProcessingCheckout(false);
      setCheckoutSuccess(true);

      // Close modal shortly
      setTimeout(() => {
        setShowCheckoutModal(false);
        setCheckoutSuccess(false);
        // Reset form
        setCardNumber("");
        setCardExpiry("");
        setCardCvv("");
        setCardName("");
        setBillingZip("");
      }, 1500);

    }, 1800);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleRemoveCard = () => {
    if (confirm("Are you sure you want to remove your payment method? Future subscription renewals will fail.")) {
      setSavedCard(null);
    }
  };

  // Card brand styling helper
  const getCardBrandLogoClass = (brandName: string) => {
    switch (brandName.toLowerCase()) {
      case "paypal": return "from-blue-800 to-sky-600";
      case "visa": return "from-blue-600 to-indigo-800";
      case "mastercard": return "from-amber-600 to-red-600";
      case "amex": return "from-teal-600 to-emerald-700";
      case "discover": return "from-orange-500 to-amber-600";
      default: return "from-slate-700 to-slate-900";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-sans">Settings & SaaS Billing</h2>
          <p className="text-slate-400 text-sm mt-1">Configure white-label descriptors, secure webhook proxy requirements, and handle client payment accounts</p>
        </div>
        {currentUser && (
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs flex items-center gap-2 font-sans text-slate-300">
            <span className="text-slate-500">Active Profile:</span>
            <span className="text-sky-400 font-semibold">{currentUser.email}</span>
            <span className="px-1.5 py-0.5 bg-sky-500/10 text-sky-400 rounded text-[9px] uppercase font-bold font-mono">{currentUser.role}</span>
          </div>
        )}
      </div>

      {/* Subscription Pricing Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Subscription Packages</h3>
            <p className="text-xs text-slate-500 mt-1">Configure client subscription levels to adjust available scanning parameters</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            Active Plan: <span className="text-sky-400 font-bold uppercase">{userPlan}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = userPlan === plan.id;
            return (
              <div 
                key={plan.id}
                className={`p-6 bg-slate-900/20 border rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                  isCurrent 
                    ? "border-sky-500/40 bg-slate-900/40 shadow-lg shadow-sky-500/5 scale-[1.02] z-10" 
                    : "border-slate-900 hover:border-slate-800"
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-6 px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider bg-sky-500 text-slate-950 rounded-full border border-sky-400">
                    CURRENT SYSTEM TIER
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900/50">
                    <h4 className="text-sm font-bold text-slate-200 font-sans">{plan.name}</h4>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white font-sans">{plan.price}</span>
                      <span className="text-[10px] text-slate-500 font-mono">/{plan.period}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-normal mt-3 font-sans font-normal">{plan.description}</p>
                  
                  <ul className="mt-5 space-y-2.5 text-[11px] text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex gap-2 items-start font-sans font-medium leading-relaxed">
                        <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  id={`upgrade-button-${plan.id}`}
                  onClick={() => openCheckout(plan)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold font-sans mt-6 border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent 
                      ? "bg-slate-950 text-slate-500 border-slate-900 cursor-not-allowed" 
                      : "bg-slate-900 hover:bg-slate-800 text-white border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {isCurrent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Current Active Plan</span>
                    </>
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method section */}
      <div className="space-y-4 pt-4 border-t border-slate-900/60">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Payment Information</h3>
          <p className="text-xs text-slate-500 mt-1">Manage client credit card details securely for recurring renewals</p>
        </div>

        {savedCard ? (
          <div className="p-5 bg-slate-900/20 border border-slate-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {savedCard.brand === "PAYPAL" ? (
              <div className="flex items-center gap-4">
                {/* Virtual Miniature PayPal Graphic */}
                <div className="w-14 h-9 rounded-md bg-gradient-to-br from-[#003087] to-[#0079c1] p-1 flex flex-col justify-center items-center shadow-md">
                  <span className="text-[10px] font-sans italic font-black text-white leading-none tracking-tighter">PayPal</span>
                  <span className="text-[6px] font-mono font-bold text-sky-200 uppercase mt-0.5 tracking-widest leading-none">Express</span>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-200 font-sans">PayPal Account Connected</p>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                    Account: <span className="text-sky-400 font-semibold font-mono">{savedCard.name}</span> | Express Subscription Billing
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {/* Virtual Miniature Card Graphic */}
                <div className={`w-14 h-9 rounded-md bg-gradient-to-br ${getCardBrandLogoClass(savedCard.brand)} p-1.5 flex flex-col justify-between shadow-md`}>
                  <div className="flex justify-between items-start">
                    <div className="w-2.5 h-2 bg-yellow-400/80 rounded-[2px]" />
                    <span className="text-[7px] font-mono font-bold text-white/50">{savedCard.brand}</span>
                  </div>
                  <span className="text-[7px] text-white font-mono tracking-wider">•••• {savedCard.last4}</span>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-slate-200 capitalize font-sans">{savedCard.brand} ending in {savedCard.last4}</p>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                    Cardholder: <span className="text-slate-400 font-semibold">{savedCard.name}</span> | Exp: <span className="text-slate-400 font-semibold">{savedCard.expMonth}/{savedCard.expYear}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                id="update-card-details-btn"
                onClick={() => {
                  // Open checkout modal with active plan to simulate card update
                  const activePlanObj = plans.find(p => p.id === userPlan) || plans[1];
                  openCheckout(activePlanObj);
                }}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-[11px] font-semibold transition cursor-pointer"
              >
                Update Card
              </button>
              <button
                id="remove-card-details-btn"
                onClick={handleRemoveCard}
                className="p-2 bg-slate-950 hover:bg-red-950/40 text-slate-500 hover:text-red-400 border border-slate-900 hover:border-red-900/40 rounded-xl transition cursor-pointer"
                title="Remove Card"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-900/10 border border-dashed border-slate-850 rounded-2xl text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="max-w-md mx-auto">
              <p className="text-xs font-semibold text-slate-300">No payment method on file</p>
              <p className="text-[11px] text-slate-500 mt-1">Upgrade to a premium subscription plan above to configure card credentials and start automated scanning.</p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Forms container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-900/60">
        
        {/* JWT API Proxy Credentials settings card */}
        <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-sans">SaaS API & JWT Security</h3>
            <p className="text-xs text-slate-500 mt-0.5">Toggle rate limiting and secure webhook proxy requirements</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-900 rounded-xl">
              <div>
                <span className="block text-xs font-bold text-slate-200 font-sans">Enable Session Token Checks</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Locks API endpoints to valid JWT payloads</span>
              </div>
              <button
                type="button"
                onClick={() => setJwtProtected(!jwtProtected)}
                className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${jwtProtected ? 'bg-sky-500' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${jwtProtected ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">My API Client Secret</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  disabled
                  value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => alert("Secret Key is managed securely by the platform environments.")}
                  className="px-3.5 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 text-xs rounded-xl transition cursor-pointer"
                >
                  Reveal
                </button>
              </div>
            </div>

            <div className="p-3 bg-sky-500/5 border border-sky-500/10 rounded-xl text-xs leading-relaxed text-slate-400">
              <span className="text-sky-400 font-bold uppercase font-mono block mb-1">PRO TIP: API SECRETS</span>
              All credentials and token exchanges are securely proxy-routed. We store secrets outside browser bundles to secure metadata.
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold font-sans border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              >
                Save Security Settings
              </button>
            </div>
          </form>
        </div>

        {/* Agency White-label Reports settings card */}
        <div className="p-6 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-sans">Agency White-label Setup</h3>
            <p className="text-xs text-slate-500 mt-0.5">Customize PDF headers and export reports with your own company metadata</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Agency Display Name</label>
              <input
                type="text"
                value={whiteLabelName}
                onChange={(e) => setWhiteLabelName(e.target.value)}
                placeholder="e.g. Acme SEO Consultants Ltd."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Report Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Actionable organic growth audit blueprint for search engine rankings"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-medium">
                <Check className="w-4 h-4" />
                <span>Agency metadata settings saved successfully!</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-sky-500/10 cursor-pointer"
              >
                Apply Branding
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Invoice Ledger Section */}
      <div className="space-y-4 pt-4 border-t border-slate-900/60">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Invoice Ledger & billing history</h3>
          <p className="text-xs text-slate-500 mt-1">Audit past subscription receipts and generate printable client accounting statements</p>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/30 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Invoice No</th>
                  <th className="px-5 py-3">Billing Date</th>
                  <th className="px-5 py-3">Subscribed Package</th>
                  <th className="px-5 py-3">Charged Amount</th>
                  <th className="px-5 py-3">Invoiced Status</th>
                  <th className="px-5 py-3 text-right">Receipt Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60">
                {billingHistory.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-300">{invoice.invoiceNo}</td>
                    <td className="px-5 py-3.5 text-slate-400">{invoice.date}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-300">{invoice.planName}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-white font-medium">{invoice.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => alert(`Generating PDF statement for receipt ${invoice.invoiceNo}...`)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition border border-slate-850 hover:border-slate-700 cursor-pointer inline-flex items-center gap-1"
                        title="Download Receipt Statement"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-[10px] px-1 font-semibold">PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PayPal & Card checkout modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-slate-950 border border-slate-900 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl shadow-black/80 relative overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header glow */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent"></div>
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-900">
              <div>
                <h3 className="text-base font-bold text-white font-sans">Payment Checkout Gateway</h3>
                <p className="text-[11px] text-slate-500 mt-1 font-sans">Secure Express Gateway Proxy</p>
              </div>
              <button
                onClick={() => {
                  if (!isProcessingCheckout) setShowCheckoutModal(false);
                }}
                className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-900 transition cursor-pointer"
                title="Cancel Checkout"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 overflow-y-auto py-5 space-y-6 scrollbar-none pr-1">
              
              {/* Order summary bar */}
              <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Plan Selected</span>
                  <p className="text-sm font-bold text-white font-sans mt-0.5">{selectedPlanForCheckout?.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-sky-400 font-sans">{selectedPlanForCheckout?.price}</span>
                  <span className="text-[10px] text-slate-500 font-mono">/mo</span>
                </div>
              </div>

              {/* Payment method selector tab row */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/40 p-1 rounded-xl border border-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("paypal");
                    setCheckoutError("");
                  }}
                  className={`py-2 text-[11px] font-bold font-sans rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === "paypal"
                      ? "bg-gradient-to-r from-[#003087]/15 to-[#0079c1]/15 text-sky-400 border border-sky-500/20 shadow-md"
                      : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <span className="font-sans italic font-black text-xs">PayPal</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-[#ffc439]/10 text-[#ffc439] rounded">Express</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    setCheckoutError("");
                  }}
                  className={`py-2 text-[11px] font-bold font-sans rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-slate-900 text-white border border-slate-800 shadow-md"
                      : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span>Credit Card</span>
                </button>
              </div>

              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6">
                {paymentMethod === "paypal" ? (
                  <div className="space-y-5 text-xs font-sans">
                    {/* Secure PayPal banner */}
                    <div className="p-4 bg-gradient-to-r from-blue-950/20 to-sky-950/10 border border-blue-900/30 rounded-2xl flex items-start gap-3">
                      <Lock className="w-5 h-5 text-[#0079c1] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 font-sans">PayPal Live Gateway Secure Link</h4>
                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5 font-sans">
                          Sign in with your PayPal account in the secure pop-up to authorize and complete this transaction instantly.
                        </p>
                      </div>
                    </div>

                    {/* PayPal Smart Buttons dynamic target container */}
                    <div className="relative min-h-[140px] bg-slate-950/40 p-4 border border-slate-900 rounded-xl flex flex-col justify-center">
                      {isSdkLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 rounded-xl z-10 gap-2">
                          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-[10px] text-slate-400 font-medium">Loading PayPal Components...</p>
                        </div>
                      )}

                      {checkoutSuccess ? (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex flex-col items-center justify-center gap-2.5 font-medium min-h-[100px] text-center">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                          <div>
                            <p className="font-bold text-sm text-white">PayPal Order Captured!</p>
                            <p className="text-[11px] text-slate-400 mt-1">Your account has been upgraded to {selectedPlanForCheckout?.name}.</p>
                          </div>
                        </div>
                      ) : (
                        <div id="paypal-button-container" className="w-full z-10"></div>
                      )}
                    </div>

                    {checkoutError && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{checkoutError}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 text-xs font-sans">
                    {/* LIVE DIGITAL CREDIT CARD VISUAL */}
                    <div className="relative mx-auto w-full max-w-[320px] aspect-[1.58/1] rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
                      {/* Visual card overlay brand accent glow */}
                      <div className={`absolute -right-10 -bottom-10 w-44 h-44 bg-gradient-to-tr ${getCardBrandLogoClass(detectCardType(cardNumber))} rounded-full blur-[40px] opacity-40`} />

                      <div className="flex justify-between items-start z-10">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">SEO PILOT SAAS</span>
                           <span className="text-[10px] font-sans text-slate-400 font-medium block mt-0.5">Secure Credit Ledger</span>
                        </div>
                        <span className="text-xs font-mono font-black text-white/60 tracking-widest uppercase">
                          {detectCardType(cardNumber)}
                        </span>
                      </div>

                      <div className="space-y-4 z-10">
                        {/* Card Number display */}
                        <p className="text-base font-mono tracking-widest text-white/90 text-center select-none font-medium">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        
                        {/* Card footer details */}
                        <div className="flex justify-between text-[9px] font-mono text-slate-400">
                          <div>
                            <span className="text-[7px] text-slate-600 block uppercase">Cardholder</span>
                            <span className="block truncate max-w-[150px] uppercase font-bold text-white/80">{cardName || "Your Full Name"}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[7px] text-slate-600 block uppercase">Expires</span>
                            <span className="block font-bold text-white/80">{cardExpiry || "MM/YY"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4242 4242 4242 4242"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none focus:border-sky-500/50 font-mono"
                          />
                          <CreditCard className="absolute right-3.5 top-3.5 w-4.5 h-4.5 text-slate-700" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expiration Date</label>
                        <input
                          type="text"
                          required={paymentMethod === "card"}
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none focus:border-sky-500/50 font-mono text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">CVC / CVV</label>
                        <input
                          type="password"
                          required={paymentMethod === "card"}
                          value={cardCvv}
                          onChange={handleCvvChange}
                          placeholder="•••"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none focus:border-sky-500/50 font-mono text-center"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">Name on Card</label>
                        <input
                          type="text"
                          required={paymentMethod === "card"}
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Johnathan Doe"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none focus:border-sky-500/50 font-sans"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">Billing Postal / ZIP Code</label>
                        <input
                          type="text"
                          required={paymentMethod === "card"}
                          value={billingZip}
                          onChange={(e) => setBillingZip(e.target.value)}
                          placeholder="90210"
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none focus:border-sky-500/50 font-mono"
                        />
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{checkoutError}</span>
                      </div>
                    )}

                    {checkoutSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2.5 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>Payment completed! Subscription upgraded to {selectedPlanForCheckout?.name}.</span>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Footer triggers */}
            <div className="pt-4 border-t border-slate-900 flex justify-end gap-3 bg-slate-950 z-10">
              <button
                type="button"
                disabled={isProcessingCheckout}
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              {paymentMethod !== "paypal" && (
                <button
                  form="checkout-form"
                  type="submit"
                  disabled={isProcessingCheckout || checkoutSuccess}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10 cursor-pointer"
                >
                  {isProcessingCheckout ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Secure Payment...</span>
                    </>
                  ) : checkoutSuccess ? (
                    <span>Verified ✔</span>
                  ) : (
                    <>
                      <span>Pay {selectedPlanForCheckout?.price}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
