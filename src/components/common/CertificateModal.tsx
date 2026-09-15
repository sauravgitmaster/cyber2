import React from 'react';
import { CertificateItem } from '../../types';
import { X, ShieldCheck, Download, Printer, CheckCircle, ExternalLink } from 'lucide-react';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e172a] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b1222]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold tracking-wide text-slate-200">
              Verified Academic Credential
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas Area */}
        <div className="p-8 bg-[#0a0f1d] border-b border-slate-800 relative">
          {/* Subtle Guilloche / border styling */}
          <div className="p-6 border-2 border-slate-700/60 rounded-lg bg-gradient-to-b from-[#0f172a]/90 to-[#0b1120] relative">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-mono">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              VERIFIED CREDENTIAL
            </div>

            <div className="text-center space-y-2 mb-6">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                CYBERMENTOR AI ACADEMIC FRAMEWORK
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                {certificate.title}
              </h2>
              <p className="text-xs text-slate-400">
                Issued to demonstrate demonstrated competency in scenario-based digital threat defense.
              </p>
            </div>

            <div className="text-center my-6 py-3 border-y border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-1">THIS CREDENTIAL IS OFFICIALLY AWARDED TO</span>
              <div className="text-2xl font-bold text-blue-300 font-sans tracking-wide">
                {certificate.recipientName}
              </div>
              <span className="text-xs font-mono text-slate-400 mt-1 block">
                Digital Trust Score Verified: {certificate.trustScoreAtIssue}/100
              </span>
            </div>

            <div className="mb-6">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Demonstrated Competencies:
              </div>
              <div className="flex flex-wrap gap-2">
                {certificate.skillsVerified.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800/80 border border-slate-700 text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Credential ID</span>
                <span className="text-slate-300">{certificate.credentialId}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase">Date of Issue</span>
                <span className="text-slate-300">{certificate.issuedDate}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase">Authentication</span>
                <span className="text-blue-400">Cryptographically Sealed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#0b1222] text-xs">
          <span className="text-slate-400 font-mono">
            ID: {certificate.credentialId}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={() => {
                alert(`Certificate link copied to clipboard: https://cybermentor.edu/verify/${certificate.credentialId}`);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Copy Verification Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
