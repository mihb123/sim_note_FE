import { verifyEmailService } from "@/features/auth/api/authService";
import { useState } from "react";
import { EmailIcon } from "@/features/auth/components/Icon";

export default function VerificationPage() {
  const [isLoading, setIsLoading] = useState(false);

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
        <EmailIcon />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Please verify your email</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
          We've sent a verification link to your email address. Please check your inbox to continue.
        </p>
        <button onClick={sendVerificationEmail} disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Sending...' : 'Resend Verification Email'}
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          <a href="/" className="font-medium text-sky-600 hover:underline dark:text-sky-500">
            Back to Home Page
          </a>
        </p>
      </div>
    </div>
  );
}