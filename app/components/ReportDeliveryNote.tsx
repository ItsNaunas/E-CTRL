'use client';

export default function ReportDeliveryNote({ email }: { email: string }) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white mb-6">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Check your email!
          </h2>
          <p className="text-lg text-white/70 mb-4">
            Your complete Amazon audit report with PDF attachment is on its way to <strong className="text-white">{email}</strong>
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg mb-4">
            <span className="text-green-400">✓</span>
            <span className="text-sm font-medium">PDF Report Sent</span>
          </div>
          <p className="text-sm text-white/60 mb-8">
            Didn&apos;t receive it? Check your spam folder or contact us at contact@e-ctrl.co.uk
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="font-semibold text-white mb-3">What&apos;s in your report:</h3>
            <div className="grid gap-3 text-sm text-left">
              <div className="flex items-center gap-3">
                <span className="text-[#FF7D2B]"></span>
                <span className="text-white/90">Detailed performance analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FF7D2B]"></span>
                <span className="text-white/90">Specific keyword recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FF7D2B]"></span>
                <span className="text-white/90">Image optimization checklist</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FF7D2B]"></span>
                <span className="text-white/90">Conversion rate improvement tips</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FF7D2B]"></span>
                <span className="text-white/90">Complete PDF report with all details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
