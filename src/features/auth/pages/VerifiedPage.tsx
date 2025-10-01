import { useSearchParams } from "react-router-dom";
import { FailureIcon, SuccessIcon } from "@auth/components/Icon";
import { verifyEmailService } from "@auth/api/authService";
import { useState } from "react";

export default function VerifiedPage() {
  const [searchParams] = useSearchParams();
  const isVerified = searchParams.get("verified") === "1";
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendVerificationEmail = () => {
    setIsLoading(true);
    verifyEmailService()
      .then(() => {
        alert("Verification email sent! Please check your mail.");
      })
      .catch(() => {
        alert("Failed to send verification email. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        {isVerified ? <SuccessIcon /> : <FailureIcon />}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          {isVerified ? "Email Verified Successfully" : "Verification Failed"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
          {isVerified 
            ? "Your email has been verified. You can now log in to your account." 
            : "The verification link is invalid or has expired. Please try again."
          }
        </p>
        {isVerified ? (
          <a href="/" className="w-full inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
            Go to Home
          </a>
        ) : (
          <button onClick={sendVerificationEmail} disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        )}
      </div>
    </div>
  );
}
