import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authApi } from "../../api";
import { Button, Input } from "../../components/ui";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully! You can now log in.");
        toast.success("Email verified!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Invalid or expired verification link.");
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    setResending(true);
    try {
      const response = await authApi.resendVerification(resendEmail);
      toast.success(response.message || "Verification email sent!");
      setResendEmail("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-lg">CE</span>
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
            <h2 className="text-xl font-bold text-gray-900">{message}</h2>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verification Complete</h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>
            <Link to="/login" className="block">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>

            <div className="border-t border-gray-100 pt-6 text-left">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5 justify-center">
                <Mail className="w-4 h-4 text-gray-500" />
                Resend Verification Email
              </h3>
              <p className="text-xs text-gray-500 text-center mb-4">
                Enter your email address below to receive another verification link.
              </p>
              <form onSubmit={handleResend} className="space-y-3">
                <Input
                  type="email"
                  placeholder="you@university.edu"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={resending} className="w-full">
                  Resend Link
                </Button>
              </form>
            </div>

            <div className="pt-2">
              <Link to="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
