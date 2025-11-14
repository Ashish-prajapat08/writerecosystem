import React from 'react';
import { ArrowLeft, XCircle, AlertTriangle, CreditCard, RefreshCw, HelpCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ErrorDetails {
  title: string;
  message: string;
  details: string;
  icon: React.ReactElement;
  suggestions: string[];
}

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  const [isRetrying, setIsRetrying] = React.useState(false);

  const getErrorDetails = (): ErrorDetails => {
    switch (reason) {
      case 'cancelled':
        return {
          title: 'Payment Cancelled',
          message: 'You cancelled the payment process.',
          details: 'The payment was not completed because you exited the payment gateway.',
          icon: <XCircle className="w-16 h-16 text-amber-500 mx-auto" />,
          suggestions: [
            'If this was accidental, click "Try Again" to restart the payment process',
            'Ensure you have sufficient funds in your account',
            'Check if your payment method is valid and not expired'
          ]
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          message: error || 'Your payment could not be processed.',
          details: getDetailedErrorMessage(code),
          icon: <XCircle className="w-16 h-16 text-red-500 mx-auto" />,
          suggestions: getSuggestionsBasedOnError(code)
        };
      case 'card_declined':
        return {
          title: 'Card Declined',
          message: 'Your card was declined by the bank.',
          details: 'This could be due to insufficient funds, incorrect card details, or bank restrictions.',
          icon: <CreditCard className="w-16 h-16 text-red-500 mx-auto" />,
          suggestions: [
            'Check if your card has sufficient funds',
            'Verify your card details are correct',
            'Contact your bank to ensure there are no restrictions on your card',
            'Try using a different payment method'
          ]
        };
      case 'network_error':
        return {
          title: 'Network Issue',
          message: 'A network error occurred during payment processing.',
          details: 'There was a problem connecting to the payment gateway.',
          icon: <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />,
          suggestions: [
            'Check your internet connection and try again',
            'Wait a few minutes and retry the payment',
            'If the problem persists, try again later'
          ]
        };
      default:
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed.',
          details: 'An unexpected error occurred during the payment process.',
          icon: <XCircle className="w-16 h-16 text-red-500 mx-auto" />,
          suggestions: [
            'Please try again in a few moments',
            'Ensure your payment details are correct',
            'Check with your bank if there are any issues with your payment method'
          ]
        };
    }
  };

  const getDetailedErrorMessage = (code: string | null): string => {
    // Map common error codes to user-friendly messages
    const errorMap: Record<string, string> = {
      'payment_failed': 'The payment was declined by your bank or payment provider.',
      'card_declined': 'Your card was declined. Please try a different card or payment method.',
      'insufficient_funds': 'Your account has insufficient funds to complete this transaction.',
      'expired_card': 'Your card has expired. Please use a different payment method.',
      'invalid_card': 'The card details entered are invalid. Please check and try again.',
      'processing_error': 'There was an error processing your payment. Please try again.',
      'issuer_unavailable': 'Could not connect to your bank. Please try again later.',
      'authentication_failed': 'Payment authentication failed. Please try again.',
    };
    
    return code && errorMap[code] ? errorMap[code] : 'An unknown error occurred during the payment process.';
  };

  const getSuggestionsBasedOnError = (code: string | null): string[] => {
    const commonSuggestions = [
      'Check if your payment details are correct',
      'Ensure your card has not expired',
      'Verify you have sufficient funds in your account'
    ];
    
    const specificSuggestions: Record<string, string[]> = {
      'card_declined': [
        'Try using a different card or payment method',
        'Contact your bank to ensure the card is active and has no restrictions'
      ],
      'insufficient_funds': [
        'Add funds to your account or use a different payment method',
        'Check your account balance before trying again'
      ],
      'expired_card': [
        'Use a different card with a valid expiration date',
        'Update your card information if you have a new card'
      ],
      'network_error': [
        'Check your internet connection and try again',
        'Wait a few minutes and retry the payment'
      ]
    };
    
    const codeKey = code || '';
    return [...commonSuggestions, ...(specificSuggestions[codeKey] || [])];
  };

  const handleTryAgain = () => {
    if (isRetrying) return; // Prevent multiple clicks
    
    setIsRetrying(true);
    // Navigate back after a short delay to ensure state is set
    setTimeout(() => {
      navigate('/ebookhub');
    }, 2000);
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-xl border border-slate-800 p-6 sm:p-8 text-center">
        {errorDetails.icon}
        
        <h1 className="text-2xl font-bold text-white mt-4 mb-2">{errorDetails.title}</h1>
        <p className="text-slate-300 mb-4">{errorDetails.message}</p>
        
        <div className="bg-slate-800/50 p-4 rounded-lg mb-6 text-left">
          <div className="flex items-start mb-2">
            <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-slate-300 text-sm">{errorDetails.details}</span>
          </div>
        </div>
        
        <div className="bg-slate-800/30 p-4 rounded-lg mb-6 text-left">
          <h3 className="text-slate-200 font-medium mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-400" />
            Suggested Solutions:
          </h3>
          <ul className="text-slate-400 text-sm space-y-2">
            {errorDetails.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 mr-2 flex-shrink-0"></span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleTryAgain}
            disabled={isRetrying}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Redirecting...' : 'Try Again'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-slate-800 text-white font-medium rounded-lg transition-all duration-300 hover:bg-slate-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back Home
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Need help? Contact our support team at support@writersecosystem.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;