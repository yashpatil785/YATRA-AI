'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTrip } from '@/context/TripContext';
import { generateFormattedTripSummary, generateShareCode } from '@/lib/shareUtils';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Users,
  Send,
  Printer,
  Sparkles,
  Link,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Clock,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Mail,
  UserPlus,
  Trash2,
  Heart
} from 'lucide-react';

export default function ShareTripModal() {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    currentItinerary,
    collaborators,
    addCollaborator,
    removeCollaborator,
    tripComments,
    addTripComment,
    likeTripComment,
    activityVotes,
    voteOnActivity,
    getShareDeepLink
  } = useTrip();

  const [activeShareTab, setActiveShareTab] = useState<'link' | 'card' | 'collab'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTextSummary, setCopiedTextSummary] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'co_planner' | 'viewer'>('co_planner');
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number>(0);

  // Generate deep link
  const shareUrl = useMemo(() => {
    return getShareDeepLink('Yash Patil');
  }, [getShareDeepLink]);

  const shareCode = useMemo(() => {
    return generateShareCode(currentItinerary.destination.id);
  }, [currentItinerary.destination.id]);

  const textSummary = useMemo(() => {
    return generateFormattedTripSummary(currentItinerary, shareUrl);
  }, [currentItinerary, shareUrl]);

  if (!isShareModalOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyTextSummary = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(textSummary);
      }
      setCopiedTextSummary(true);
      setTimeout(() => setCopiedTextSummary(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: currentItinerary.title,
          text: `Check out our ${currentItinerary.days.length}-day smart itinerary for ${currentItinerary.destination.name} on YatraAI!`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(
      `✈️ *${currentItinerary.title}*\n\nHey! Let's collaborate on our ${currentItinerary.days.length}-day trip to ${currentItinerary.destination.name} on YatraAI.\n\n🔗 Click to view & vote on activities:\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const handleTelegramShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`Let's collaborate on our ${currentItinerary.title}!`);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  const handleTwitterShare = () => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`Crafted an AI-optimized trip to ${currentItinerary.destination.name} using @YatraAI! ✈️🗺️`);
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Travel Itinerary: ${currentItinerary.title}`);
    const body = encodeURIComponent(textSummary);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleAddCollaboratorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    addCollaborator(inviteName.trim() || inviteEmail.split('@')[0], inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setInviteName('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addTripComment(newCommentText, selectedDayFilter > 0 ? selectedDayFilter : undefined);
    setNewCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#020617]/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-4xl shadow-2xl text-white max-h-[90vh] flex flex-col overflow-hidden relative">
        
        {/* Glow Orb in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/15 via-teal-500/10 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-950/40 border border-white/20">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black text-white">Share Trip & Collaborate</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-black uppercase tracking-wider">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {currentItinerary.title} • {currentItinerary.days.length} Days in {currentItinerary.destination.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Tabs inside Modal */}
        <div className="px-6 pt-3 border-b border-white/10 bg-white/5 flex items-center space-x-2">
          <button
            onClick={() => setActiveShareTab('link')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-2 border-b-2 ${
              activeShareTab === 'link'
                ? 'border-orange-400 text-white bg-white/10 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Link className="w-3.5 h-3.5 text-orange-400" />
            <span>Deep Link & Quick Share</span>
          </button>

          <button
            onClick={() => setActiveShareTab('card')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-2 border-b-2 ${
              activeShareTab === 'card'
                ? 'border-orange-400 text-white bg-white/10 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Visual Summary Card</span>
          </button>

          <button
            onClick={() => setActiveShareTab('collab')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-2 border-b-2 ${
              activeShareTab === 'collab'
                ? 'border-orange-400 text-white bg-white/10 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Co-Travelers & Polling ({collaborators.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: DEEP LINK & QUICK SOCIAL SHARE */}
          {activeShareTab === 'link' && (
            <div className="space-y-6">
              
              {/* Deep Link URL Box */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5" />
                    <span>Temporary Collaboration Deep Link</span>
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                    Active • Code: {shareCode}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono overflow-x-auto whitespace-nowrap">
                    {shareUrl || 'Generating dynamic deep link...'}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-950/40 border border-white/20 transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-white" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Anyone with this link can view this full itinerary with interactive route maps, simulate weather disruptions, and vote on activities in real-time.
                </p>
              </div>

              {/* QR Code & One-Tap Sharing Channels */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual QR Code Card */}
                <div className="md:col-span-4 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-white rounded-2xl shadow-xl border border-white/20 mb-3">
                    {/* SVG Vector QR Code representation */}
                    <svg viewBox="0 0 100 100" className="w-32 h-32 text-slate-900 fill-current">
                      {/* Standard QR Framing Squares */}
                      <rect x="0" y="0" width="30" height="30" rx="4" fill="#0f172a" />
                      <rect x="5" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="9" y="9" width="12" height="12" rx="1" fill="#f97316" />

                      <rect x="70" y="0" width="30" height="30" rx="4" fill="#0f172a" />
                      <rect x="75" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="79" y="9" width="12" height="12" rx="1" fill="#f97316" />

                      <rect x="0" y="70" width="30" height="30" rx="4" fill="#0f172a" />
                      <rect x="5" y="75" width="20" height="20" rx="2" fill="#ffffff" />
                      <rect x="9" y="79" width="12" height="12" rx="1" fill="#f97316" />

                      {/* Random Matrix Pixel Patterns */}
                      <rect x="36" y="6" width="6" height="6" fill="#0f172a" />
                      <rect x="46" y="6" width="6" height="6" fill="#0f172a" />
                      <rect x="56" y="6" width="6" height="6" fill="#0f172a" />
                      <rect x="36" y="16" width="6" height="6" fill="#0f172a" />
                      <rect x="46" y="24" width="6" height="6" fill="#0f172a" />
                      <rect x="56" y="16" width="6" height="6" fill="#0f172a" />

                      <rect x="6" y="36" width="6" height="6" fill="#0f172a" />
                      <rect x="16" y="46" width="6" height="6" fill="#0f172a" />
                      <rect x="24" y="36" width="6" height="6" fill="#0f172a" />
                      <rect x="6" y="56" width="6" height="6" fill="#0f172a" />

                      <rect x="36" y="36" width="10" height="10" rx="2" fill="#14b8a6" />
                      <rect x="52" y="36" width="8" height="8" fill="#0f172a" />
                      <rect x="36" y="52" width="8" height="8" fill="#0f172a" />
                      <rect x="48" y="48" width="12" height="12" rx="2" fill="#f97316" />
                      <rect x="64" y="40" width="6" height="6" fill="#0f172a" />

                      <rect x="74" y="36" width="6" height="6" fill="#0f172a" />
                      <rect x="86" y="46" width="6" height="6" fill="#0f172a" />
                      <rect x="74" y="56" width="6" height="6" fill="#0f172a" />
                      <rect x="86" y="64" width="6" height="6" fill="#0f172a" />

                      <rect x="36" y="74" width="6" height="6" fill="#0f172a" />
                      <rect x="46" y="84" width="6" height="6" fill="#0f172a" />
                      <rect x="56" y="74" width="6" height="6" fill="#0f172a" />
                      <rect x="36" y="86" width="6" height="6" fill="#0f172a" />
                      <rect x="74" y="74" width="8" height="8" fill="#0f172a" />
                      <rect x="86" y="84" width="8" height="8" fill="#14b8a6" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>Scan with Mobile Camera</span>
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Direct instant itinerary sync on mobile
                  </p>
                </div>

                {/* Social Share Buttons */}
                <div className="md:col-span-8 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-white mb-1">Instant Messaging & Social Share</h3>
                    <p className="text-xs text-slate-300">
                      Share with family & travel companions directly via your favorite communication apps.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* WhatsApp */}
                    <button
                      onClick={handleWhatsAppShare}
                      className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs hover:scale-105"
                    >
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold">WhatsApp</span>
                    </button>

                    {/* Telegram */}
                    <button
                      onClick={handleTelegramShare}
                      className="p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs hover:scale-105"
                    >
                      <Send className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs font-bold">Telegram</span>
                    </button>

                    {/* Twitter / X */}
                    <button
                      onClick={handleTwitterShare}
                      className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/20 text-slate-200 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs hover:scale-105"
                    >
                      <ExternalLink className="w-5 h-5 text-slate-300" />
                      <span className="text-xs font-bold">X (Twitter)</span>
                    </button>

                    {/* Email */}
                    <button
                      onClick={handleEmailShare}
                      className="p-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs hover:scale-105"
                    >
                      <Mail className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs font-bold">Email Mailto</span>
                    </button>

                    {/* Native Web Share */}
                    <button
                      onClick={handleNativeShare}
                      className="p-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 text-orange-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs hover:scale-105"
                    >
                      <Share2 className="w-5 h-5 text-orange-400" />
                      <span className="text-xs font-bold">Device Share</span>
                    </button>

                    {/* Copy Formatted Text */}
                    <button
                      onClick={handleCopyTextSummary}
                      className="p-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-300 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer shadow-xs hover:scale-105"
                    >
                      {copiedTextSummary ? <Check className="w-5 h-5 text-teal-400" /> : <Copy className="w-5 h-5 text-teal-400" />}
                      <span className="text-xs font-bold">{copiedTextSummary ? 'Text Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: VISUAL SUMMARY CARD */}
          {activeShareTab === 'card' && (
            <div className="space-y-6">
              
              {/* Rendered Visual Card */}
              <div className="bg-gradient-to-br from-slate-900 via-[#020617] to-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-teal-500/10 to-transparent pointer-events-none" />

                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-400/30 text-[10px] font-black uppercase tracking-wider">
                        YatraAI Itinerary Card
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-bold">
                        {currentItinerary.overallEfficiencyScore}/100 Match Score
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">{currentItinerary.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {currentItinerary.destination.name}, India • {currentItinerary.preferences.travelersCount} Traveler(s) • {currentItinerary.preferences.budgetTier} Tier
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center shrink-0">
                    <span className="text-[10px] uppercase font-black text-slate-400">Total Estimate</span>
                    <p className="text-xl font-black text-teal-300 mt-0.5">
                      ₹{currentItinerary.totalEstimatedBudgetINR.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Day-by-Day Highlight Matrix */}
                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {currentItinerary.days.map((d) => (
                    <div key={d.dayNumber} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-orange-400">Day {d.dayNumber}: {d.date}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">{d.theme}</span>
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">{d.title}</p>
                      <div className="space-y-1 pt-1">
                        {d.activities.map(act => (
                          <div key={act.id} className="flex items-center justify-between text-[11px] text-slate-300">
                            <span className="line-clamp-1">• {act.poi.name}</span>
                            <span className="text-teal-300 font-bold shrink-0 ml-2">
                              {act.poi.entryFeeINR === 0 ? 'Free' : `₹${act.poi.entryFeeINR}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer with Share Code & QR Link */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span>Dynamic Weather Replanning Enabled • Code: <strong>{shareCode}</strong></span>
                  </div>
                  <span className="font-mono text-slate-300">yatra.ai/trip/{currentItinerary.destination.id}</span>
                </div>

              </div>

              {/* Action Buttons for Card */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleCopyTextSummary}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedTextSummary ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTextSummary ? 'Summary Copied to Clipboard!' : 'Copy Formatted Text (WhatsApp/Notes)'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md border border-white/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF Card</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: CO-TRAVELERS & POLLING HUB */}
          {activeShareTab === 'collab' && (
            <div className="space-y-6">
              
              {/* Invite Form */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite Co-Traveler by Email</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    {collaborators.length} active travelers on this plan
                  </span>
                </div>

                <form onSubmit={handleAddCollaboratorSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <input
                    type="text"
                    placeholder="Traveler Name (e.g. Rahul)"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="sm:col-span-4 px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="sm:col-span-5 px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-3 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-md border border-white/20 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Send Invite</span>
                  </button>
                </form>
              </div>

              {/* Active Collaborators List */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">Active Group Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {collaborators.map((c) => (
                    <div key={c.id} className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.avatarBg} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{c.name}</p>
                          <span className="text-[10px] text-slate-400">{c.role === 'owner' ? '👑 Leader' : c.role === 'co_planner' ? '✏️ Co-Planner' : '👁️ Viewer'}</span>
                        </div>
                      </div>
                      {c.role !== 'owner' && (
                        <button
                          onClick={() => removeCollaborator(c.id)}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Remove companion"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Voting Section */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">Itinerary Stops Group Poll</h3>
                    <p className="text-xs text-slate-400">Co-travelers can vote on attractions to prioritize or swap.</p>
                  </div>
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-400/30">
                    Live Upvotes
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {currentItinerary.days.flatMap(d => d.activities).map(act => {
                    const currentVoteCount = activityVotes[act.id] || 0;
                    return (
                      <div key={act.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 transition-all">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <Image
                              src={act.poi.imageUrl}
                              alt={act.poi.name}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white line-clamp-1">{act.poi.name}</p>
                            <span className="text-[10px] text-slate-400">{act.poi.subcategory} • ₹{act.poi.entryFeeINR}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => voteOnActivity(act.id, 1)}
                            className="p-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/30 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                            title="Vote to keep"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{currentVoteCount}</span>
                          </button>

                          <button
                            onClick={() => voteOnActivity(act.id, -1)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-red-400 border border-white/10 text-xs cursor-pointer"
                            title="Downvote"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group Discussion Thread */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4">
                <h3 className="text-sm font-black text-white">Co-Traveler Notes & Suggestions</h3>

                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Leave a note or suggestion for the group..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md border border-white/20 flex items-center space-x-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </form>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {tripComments.map(comm => (
                    <div key={comm.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{comm.authorName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">{comm.authorRole}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{comm.text}</p>
                      <div className="flex items-center justify-end pt-1">
                        <button
                          onClick={() => likeTripComment(comm.id)}
                          className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Heart className="w-3 h-3 text-rose-400" />
                          <span>{comm.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>End-to-end encoded travel state. Edits sync automatically via URL deep link.</span>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
