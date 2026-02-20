'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { resendConfirmationEmail } from '../../actions';

interface EmailSentConfirmationProps {
  email?: string;
  title?: string;
  description?: string;
  onResend?: () => void;
  showResendButton?: boolean;
}

const EmailSentConfirmation: React.FC<EmailSentConfirmationProps> = ({
  email = 'user@example.com',
  title = 'Check your inbox',
  description = 'We\'ve sent you an email with a verification link. Please check your inbox and click the link to continue.',
  onResend,
  showResendButton = true,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setResendError(null);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      
      const result = await resendConfirmationEmail(formData);
      
      if (result.error) {
        setResendError(result.error);
      } else {
        setResendSuccess(true);
        setTimeout(() => {
          setResendSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setResendError('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md bg-transparent border-none shadow-none">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-primary/10 rounded-full p-3">
                <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-lg">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{email}</span>
          </div>

          {showResendButton && (
            <div className="space-y-2">
              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the email?{' '}
                <button
                  onClick={handleResend}
                  disabled={isResending || resendSuccess}
                  className="text-foreground font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span> Sending...
                    </>
                  ) : resendSuccess ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 inline mr-1" /> Email sent!
                    </>
                  ) : (
                    'Resend email'
                  )}
                </button>
              </div>
              {resendError && (
                <p className="text-sm text-destructive text-center">{resendError}</p>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Make sure to check your spam folder if you don't see the email in your inbox.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function EmailSentContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <EmailSentConfirmation
      email={email}
      title="Check your inbox"
      description="We've sent you an email with a verification link. Please check your inbox and click the link to continue."
      showResendButton={true}
    />
  );
}

export default function EmailSentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
        <Card className="w-full max-w-md bg-transparent border-none shadow-none">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="relative bg-primary/10 rounded-full p-3">
                  <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Check your inbox
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Loading...
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    }>
      <EmailSentContent />
    </Suspense>
  );
}