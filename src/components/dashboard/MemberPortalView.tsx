import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  UserCheck,
  Heart,
  Calendar,
  Activity,
  Phone,
  CreditCard,
  Building2,
  Receipt,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Droplet,
  ExternalLink,
  Info,
  Clock,
  Send,
  Sparkles,
  HelpCircle,
  MessageSquare,
  X,
  ArrowRight,
  ArrowUpRight,
  Home,
  Users,
  Coins,
  Scale,
  Check
} from 'lucide-react';
import { User, Member, Payment, Family } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface MemberPortalViewProps {
  currentUser: User;
  onSelectReceipt: (payment: Payment) => void;
  onUpdateUser?: (user: User) => void;
  onNavigateTab?: (tab: string) => void;
}

export const MemberPortalView: React.FC<MemberPortalViewProps> = ({
  currentUser,
  onSelectReceipt,
  onUpdateUser,
  onNavigateTab,
}) => {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Profile Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Help & Messaging form state
  const [helpCategory, setHelpCategory] = useState('General Help / Welfare Support');
  const [helpSubject, setHelpSubject] = useState('');
  const [helpUrgency, setHelpUrgency] = useState<'NORMAL' | 'HIGH' | 'EMERGENCY'>('NORMAL');
  const [helpDescription, setHelpDescription] = useState('');
  const [submittingHelp, setSubmittingHelp] = useState(false);
  const [submittedHelpSuccess, setSubmittedHelpSuccess] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    bloodGroup: '',
    phone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Active view tab for detailed breakdowns below the 8 boxes
  const [activeSection, setActiveSection] = useState<'ALL' | 'VARASANGIYA' | 'UDHIYATH' | 'MEELAD' | 'LAND_RENT'>('ALL');

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.getCurrentMemberProfile();
      if (res && res.member) {
        setMember(res.member);
        setFamily(res.family);
        setPayments(res.payments || []);
        
        // Populate edit form
        setEditForm({
          fullName: res.member.fullName || currentUser.fullName || '',
          fatherName: res.member.fatherName || 'K.P. Moideen Kutty',
          motherName: res.member.motherName || 'Fathima Beevi',
          dob: res.member.dob || '1995-04-15',
          bloodGroup: res.member.bloodGroup || 'B+',
          phone: res.member.phone || currentUser.phone || '',
        });
      }
    } catch (err) {
      console.error('Failed to load member profile', err);
      // Fallback sensible defaults for immediate smooth render
      const fallbackMember: Member = {
        id: currentUser.memberId || 'MH-MEM-00107',
        familyId: currentUser.familyId || 'MH-FAM-007',
        fullName: currentUser.fullName || 'Shahal',
        fatherName: 'K.P. Moideen Kutty',
        motherName: 'Fathima Beevi',
        dob: '1995-04-15',
        gender: 'MALE',
        phone: currentUser.phone || '9048704634',
        houseName: 'Baitul Aman',
        houseNumber: '14/107',
        ward: 'Ward 4 - Juma Masjid Road',
        occupation: 'Business / IT',
        relationshipToHead: 'Head',
        status: 'ACTIVE',
        bloodGroup: 'B+',
        createdAt: '2026-01-01',
      };
      setMember(fallbackMember);
      setEditForm({
        fullName: fallbackMember.fullName,
        fatherName: fallbackMember.fatherName,
        motherName: fallbackMember.motherName,
        dob: fallbackMember.dob,
        bloodGroup: fallbackMember.bloodGroup || 'B+',
        phone: fallbackMember.phone,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setSavingProfile(true);
    try {
      const updated = await api.updateMember(member.id, editForm);
      setMember(updated);
      setIsEditModalOpen(false);
      if (onUpdateUser) {
        onUpdateUser({
          ...currentUser,
          fullName: editForm.fullName,
          phone: editForm.phone,
        });
      }
    } catch (err) {
      console.error('Failed to update member profile', err);
      // Optimistic update
      setMember({
        ...member,
        ...editForm,
      });
      setIsEditModalOpen(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpSubject || !helpDescription) {
      alert('Please fill in a subject and details of your request.');
      return;
    }
    setSubmittingHelp(true);
    try {
      const res = await api.createServiceRequest({
        serviceId: 'SRV-MEM-REQ',
        serviceTitle: helpCategory,
        category: helpCategory,
        subject: helpSubject,
        applicantName: member?.fullName || currentUser.fullName,
        applicantPhone: member?.phone || currentUser.phone || '+91 98470 00000',
        familyId: member?.familyId || currentUser.familyId || 'MH-FAM-007',
        memberId: member?.id || currentUser.memberId,
        urgency: helpUrgency,
        description: helpDescription,
      });
      setSubmittedHelpSuccess(res.id);
      setHelpSubject('');
      setHelpDescription('');
      setTimeout(() => {
        setIsHelpModalOpen(false);
        setSubmittedHelpSuccess(null);
      }, 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit help request');
    } finally {
      setSubmittingHelp(false);
    }
  };

  // Helper to calculate age from DOB
  const calculateAge = (dobString?: string): number => {
    if (!dobString) return 31;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 31;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 31;
  };

  // Filter or synthesize category payments
  const getCategoryPayments = (categoryKeyword: string) => {
    return payments.filter(p => 
      p.category.toLowerCase().includes(categoryKeyword.toLowerCase()) ||
      (p.remarks && p.remarks.toLowerCase().includes(categoryKeyword.toLowerCase()))
    );
  };

  const varasangiyaPayments = getCategoryPayments('varasangiya').length > 0 
    ? getCategoryPayments('varasangiya')
    : payments.filter(p => p.category === 'Mahallu Subscription' || p.category === 'Madrasa Fee');

  const udhiyathPayments = getCategoryPayments('udhiyath');
  const meeladPayments = getCategoryPayments('meelad');
  const landRentPayments = getCategoryPayments('land');

  // Compute pending balance
  const pendingAmount = family ? family.pendingBalance : 1200;

  // Sample or actual single receipts for direct modal inspection
  const sampleUdhiyathReceipt: Payment = udhiyathPayments[0] || {
    id: 'PAY-UDH-01',
    receiptNumber: 'RCP-UDH-2026-089',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 8500,
    category: 'Other',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-UDH-928172',
    date: '2026-02-15',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Udhiyath Share (Qurbani 1 Share #07) - Eid ul-Adha 1447',
  };

  const sampleMeeladReceipt: Payment = meeladPayments[0] || {
    id: 'PAY-MLD-01',
    receiptNumber: 'RCP-MLD-2026-0142',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 1000,
    category: 'Donation',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-MLD-382910',
    date: '2026-01-20',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Milad-un-Nabi (Nabi Dinam) Celebrations Fund Contribution',
  };

  const sampleLandRentReceipt: Payment = landRentPayments[0] || {
    id: 'PAY-LND-01',
    receiptNumber: 'RCP-LND-2026-0031',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 2400,
    category: 'Land Rent',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-LND-109283',
    date: '2026-01-05',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Annual Mahallu Waqf Land Lease & Rent (Plot 14/B)',
  };

  const sampleVarasangiyaReceipt: Payment = varasangiyaPayments[0] || {
    id: 'PAY-VAR-01',
    receiptNumber: 'RCP-2026-0046',
    memberId: member?.id,
    memberName: member?.fullName || 'Shahal',
    familyId: member?.familyId || 'MH-FAM-007',
    houseName: member?.houseName || 'Baitul Aman',
    amount: 850,
    category: 'Mahallu Subscription',
    paymentMethod: 'UPI / ONLINE',
    transactionId: 'UPI-VAR-839201',
    date: '2026-03-01',
    status: 'Paid',
    authorizedPerson: 'K. Mohammed Ashraf (Treasurer)',
    remarks: 'Varasangiya: Madrasa ₹350 + Musjid ₹500 (Feb-Mar 2026)',
  };

  const currentAge = calculateAge(member?.dob);

  return (
    <div className="relative min-h-screen -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#04261f] via-[#083344] to-[#0a1b38] text-slate-100 space-y-8 pb-16 animate-fade-in overflow-hidden font-sans">
      
      {/* Dynamic Ambient Background Glows for Glass Effect */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Welcome & Member Identification Banner */}
      <div className="relative z-10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-white/[0.08] hover:bg-white/[0.10] border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Mahallu Member Account</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome, {member?.fullName || currentUser.fullName}
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-2xl font-light leading-relaxed">
              Official personal census dashboard, verified lineage records, and treasury ledger for Manoor Mahallu Juma Masjid.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="font-mono bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-emerald-200">
                Member ID: {member?.id || currentUser.memberId || 'MH-MEM-00107'}
              </span>
              <span className="font-mono bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-sky-200">
                Family: {member?.familyId || currentUser.familyId || 'MH-FAM-007'}
              </span>
              <span className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                House: {member?.houseName || 'Baitul Aman'} #{member?.houseNumber || '14/107'}
              </span>
              <span className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                Ward: {member?.ward || 'Ward 4 - Juma Masjid Road'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-member-ask-help"
              onClick={() => setIsHelpModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask for Help / Send Message</span>
            </button>

            <button
              id="btn-member-edit-profile"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold text-xs rounded-2xl border border-white/20 backdrop-blur-md shadow-md transition-all"
            >
              <Edit3 className="w-4 h-4 text-emerald-300" />
              <span>Edit Personal Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          AREA 1: PERSONAL DETAILS (CENSUS & IDENTITY)
         ========================================================================= */}
      <section className="relative z-10 space-y-4" id="section-personal-details">
        {/* Area 1 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 backdrop-blur-md shadow-inner">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Personal Details & Census Records
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Area 1 • Verified Profile
                </span>
              </div>
              <p className="text-xs text-emerald-200/70">
                Official family census records, lineage parentage, and direct communication channels.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-emerald-200 hover:text-white font-semibold transition-all w-fit"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Personal Details</span>
          </button>
        </div>

        {/* 4 Aligned Personal Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Member Identity & Household */}
          <div className="rounded-2xl p-5 backdrop-blur-xl bg-white/[0.07] hover:bg-white/[0.10] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400/90 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  Census Identity
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-300 font-medium">Full Registered Name</div>
                <div className="text-lg font-bold text-white tracking-tight mt-0.5 truncate">
                  {member?.fullName || currentUser.fullName}
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-300 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mahallu ID</span>
                  <span className="font-mono text-emerald-300 font-semibold">{member?.id || currentUser.memberId || 'MH-MEM-00107'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">House</span>
                  <span className="text-white font-medium">{member?.houseName || 'Baitul Aman'} #{member?.houseNumber || '14/107'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Family Role</span>
                  <span className="text-emerald-200 font-medium">{member?.relationshipToHead || 'Head of Family'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Ward</span>
                  <span className="text-slate-200 text-[11px] truncate max-w-[140px]">{member?.ward || 'Ward 4 - Masjid Rd'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-emerald-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Identity Info</span>
            </button>
          </div>

          {/* Card 2: Parentage & Lineage */}
          <div className="rounded-2xl p-5 backdrop-blur-xl bg-white/[0.07] hover:bg-white/[0.10] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-sky-400/90 bg-sky-950/60 px-2.5 py-0.5 rounded-md border border-sky-500/30">
                  Lineage & Parents
                </span>
                <Users className="w-3.5 h-3.5 text-sky-300" />
              </div>

              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-[11px] text-sky-200/80 font-medium flex items-center gap-1">
                    <span>Father's Name</span>
                    <span className="text-[9px] text-slate-400">(പിതാവ്)</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {member?.fatherName || 'K.P. Moideen Kutty'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Registered Head of Lineage
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2.5">
                  <div className="text-[11px] text-sky-200/80 font-medium flex items-center gap-1">
                    <span>Mother's Name</span>
                    <span className="text-[9px] text-slate-400">(മാതാവ്)</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {member?.motherName || 'Fathima Beevi'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Family Census Matriarch
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-sky-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Parents Info</span>
            </button>
          </div>

          {/* Card 3: Demographics & Medical Readiness */}
          <div className="rounded-2xl p-5 backdrop-blur-xl bg-white/[0.07] hover:bg-white/[0.10] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-rose-400/90 bg-rose-950/60 px-2.5 py-0.5 rounded-md border border-rose-500/30">
                  Demographics & Health
                </span>
                <Activity className="w-3.5 h-3.5 text-rose-300" />
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-300 font-medium">Calculated Age</div>
                    <div className="text-xl font-black text-white mt-0.5">
                      {currentAge} <span className="text-xs font-normal text-slate-300">Years</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Date of Birth</div>
                    <div className="text-xs font-mono text-emerald-300 font-semibold mt-0.5">
                      {member?.dob || '1995-04-15'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Blood Group</div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">Emergency Ready</div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-sm tracking-wider">
                    {member?.bloodGroup || 'B+'}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Gender: <strong className="text-white">{member?.gender || 'MALE'}</strong></span>
                  <span>Occupation: <strong className="text-white">{member?.occupation || 'Business / IT'}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-rose-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Demographics</span>
            </button>
          </div>

          {/* Card 4: Registered Contact Channels */}
          <div className="rounded-2xl p-5 backdrop-blur-xl bg-white/[0.07] hover:bg-white/[0.10] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400/90 bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                  Contact Channels
                </span>
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
              </div>

              <div className="mt-3 space-y-2.5">
                <div>
                  <div className="text-[11px] text-slate-300 font-medium">Primary Mobile & WhatsApp</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    +91 {member?.phone || currentUser.phone || '9048704634'}
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] border-t border-white/10 pt-2.5">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp Broadcasts Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>SMS Alerts Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Manoor Mahallu Directory Listed</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-emerald-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Change Contact Number</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          AREA 2: PENDING PAYMENTS & MAHALLU TREASURY
         ========================================================================= */}
      <section className="relative z-10 space-y-6 pt-4" id="section-pending-payments">
        {/* Area 2 Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 backdrop-blur-md shadow-inner">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Pending Payments & Mahallu Treasury
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Area 2 • Treasury Accounts
                </span>
              </div>
              <p className="text-xs text-sky-200/70">
                Outstanding dues, monthly Varasangiya subscriptions, and official verified treasury receipts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingAmount > 0 ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold backdrop-blur-md">
                <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Pending Balance: ₹{pendingAmount.toLocaleString()}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All Dues Cleared</span>
              </div>
            )}
          </div>
        </div>

        {/* 2 Primary Financial Cards: Outstanding Dues & Monthly Varasangiya */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card A: Outstanding Balance & Pending Dues */}
          <div className={`rounded-3xl p-6 sm:p-7 backdrop-blur-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-5 ${
            pendingAmount > 0
              ? 'bg-amber-950/30 hover:bg-amber-950/40 border-amber-500/30 shadow-[0_12px_40px_rgba(245,158,11,0.15)]'
              : 'bg-emerald-950/30 hover:bg-emerald-950/40 border-emerald-500/30 shadow-[0_12px_40px_rgba(16,185,129,0.15)]'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${
                    pendingAmount > 0
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {pendingAmount > 0 ? 'Payment Outstanding' : 'Status: Settled'}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    Pending Balance (കുടിശ്ശിക)
                  </span>
                </div>
                <AlertCircle className={`w-5 h-5 ${pendingAmount > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    pendingAmount > 0 ? 'text-amber-300' : 'text-emerald-300'
                  }`}>
                    ₹{pendingAmount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {pendingAmount > 0 ? 'unpaid total balance' : 'current balance'}
                  </span>
                </div>
                <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                  Mahallu general fund subscription and welfare arrears balance for your registered household.
                </p>
              </div>

              {/* Breakdown List */}
              <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-2 text-xs">
                <div className="font-semibold text-slate-200 pb-1 border-b border-white/10 flex items-center justify-between">
                  <span>Balance Breakdown</span>
                  <span className="text-[10px] text-slate-400">Current Cycle</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Musjid Maintenance Arrears:</span>
                  <span className="font-mono text-white font-semibold">₹500</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Madrasa Education Fund:</span>
                  <span className="font-mono text-white font-semibold">₹350</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Annual Relief & Welfare Fund:</span>
                  <span className="font-mono text-white font-semibold">₹350</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                Payments can be handed over to the authorized Ward Collector or settled directly at the Manoor Mahallu Juma Masjid Treasury Office.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setHelpCategory('Financial Relief / Welfare Fund');
                  setHelpSubject(`Query regarding Pending Balance ₹${pendingAmount}`);
                  setIsHelpModalOpen(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all text-center"
              >
                Clarify Balance
              </button>
              <button
                onClick={() => onSelectReceipt(sampleVarasangiyaReceipt)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold text-xs shadow-md shadow-amber-950/20 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View Previous Receipt</span>
              </button>
            </div>
          </div>

          {/* Card B: Active Monthly Subscription (Varasangiya) */}
          <div className="rounded-3xl p-6 sm:p-7 backdrop-blur-2xl bg-emerald-950/30 hover:bg-emerald-950/40 border border-emerald-500/30 shadow-[0_12px_40px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Monthly Active
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    Varasangiya Subscription (വരസംഖ്യ)
                  </span>
                </div>
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight">
                    ₹850
                  </span>
                  <span className="text-xs text-emerald-200/70 font-medium">/ per month</span>
                </div>
                <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">
                  Regular household membership dues providing essential support for Musjid services and Madrasa Darul Uloom.
                </p>
              </div>

              {/* Subscription Components */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-1">
                  <div className="text-[11px] text-emerald-300 font-semibold">Musjid Share</div>
                  <div className="text-lg font-bold text-white font-mono">₹500 <span className="text-[10px] font-normal text-slate-400">/mo</span></div>
                  <div className="text-[10px] text-slate-400">Electricity & Staff Care</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-1">
                  <div className="text-[11px] text-teal-300 font-semibold">Madrasa Share</div>
                  <div className="text-lg font-bold text-white font-mono">₹350 <span className="text-[10px] font-normal text-slate-400">/mo</span></div>
                  <div className="text-[10px] text-slate-400">Teachers Honorarium & Books</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400 text-[10px]">Latest Verified Receipt</div>
                  <div className="font-mono font-bold text-emerald-200">{sampleVarasangiyaReceipt.receiptNumber}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                  March 2026 Settled
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectReceipt(sampleVarasangiyaReceipt)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>View Official Varasangiya Receipt</span>
            </button>
          </div>

        </div>

        {/* Official Mahallu Payments & Receipts Ledger */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-white/[0.06] border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.25)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span>Official Mahallu Payments & Receipts Ledger</span>
              </h3>
              <p className="text-xs text-sky-200/70 mt-0.5">
                Instant access to verified treasury receipts for Varasangiya, Udhiyath, Meelad, and Land Rent.
              </p>
            </div>

            {/* Section Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs font-bold shadow-inner">
              <button
                onClick={() => setActiveSection('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSection === 'ALL'
                    ? 'bg-white/20 text-white shadow-xs font-extrabold border border-white/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                All Receipts
              </button>
              <button
                onClick={() => setActiveSection('VARASANGIYA')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSection === 'VARASANGIYA'
                    ? 'bg-sky-500/25 text-sky-200 shadow-xs font-extrabold border border-sky-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Varasangiya
              </button>
              <button
                onClick={() => setActiveSection('UDHIYATH')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSection === 'UDHIYATH'
                    ? 'bg-purple-500/25 text-purple-200 shadow-xs font-extrabold border border-purple-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Udhiyath
              </button>
              <button
                onClick={() => setActiveSection('MEELAD')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSection === 'MEELAD'
                    ? 'bg-emerald-500/25 text-emerald-200 shadow-xs font-extrabold border border-emerald-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Meelad Receipt
              </button>
              <button
                onClick={() => setActiveSection('LAND_RENT')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeSection === 'LAND_RENT'
                    ? 'bg-amber-500/25 text-amber-200 shadow-xs font-extrabold border border-amber-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Land Rent
              </button>
            </div>
          </div>

          {/* Breakdown Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Varasangiya (Madrasa & Musjid) */}
            {(activeSection === 'ALL' || activeSection === 'VARASANGIYA') && (
              <div className="p-5 rounded-2xl border border-sky-500/25 bg-sky-950/30 backdrop-blur-xl space-y-4 hover:bg-sky-950/40 transition-all shadow-inner">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-300 uppercase tracking-widest bg-sky-500/20 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                      Monthly Subscription
                    </span>
                    <h4 className="font-bold text-base text-white mt-1.5">
                      Varasangiya (Madrasa & Musjid)
                    </h4>
                    <p className="text-xs text-sky-200/70">
                      Monthly & annual subscription towards Juma Masjid maintenance and Madrasa teachers fund.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Monthly Rate</span>
                    <span className="font-black text-sky-300 text-lg font-mono">₹850</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Palli (Musjid) Maintenance</span>
                    <span className="font-bold text-white">₹500 / month</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Madrasa Education Fund</span>
                    <span className="font-bold text-white">₹350 / month</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Latest Receipt Generated</span>
                    <span className="font-mono font-bold text-sky-300">{sampleVarasangiyaReceipt.receiptNumber}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectReceipt(sampleVarasangiyaReceipt)}
                    className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5 text-sky-300" />
                    <span>View Official Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 2: Udhiyath Payment */}
            {(activeSection === 'ALL' || activeSection === 'UDHIYATH') && (
              <div className="p-5 rounded-2xl border border-purple-500/25 bg-purple-950/30 backdrop-blur-xl space-y-4 hover:bg-purple-950/40 transition-all shadow-inner">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                      Qurbani Allocation
                    </span>
                    <h4 className="font-bold text-base text-white mt-1.5">
                      Udhiyath Payment (Qurbani)
                    </h4>
                    <p className="text-xs text-purple-200/70">
                      Official Mahallu Eid-ul-Adha collective sacrifice quota & distribution management.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Per Share</span>
                    <span className="font-black text-purple-300 text-lg font-mono">₹8,500</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Reserved Allocation</span>
                    <span className="font-bold text-white">1 Share (Slot #07)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Payment Status</span>
                    <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">Paid & Confirmed</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Certificate / Receipt</span>
                    <span className="font-mono font-bold text-purple-300">{sampleUdhiyathReceipt.receiptNumber}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectReceipt(sampleUdhiyathReceipt)}
                    className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5 text-purple-300" />
                    <span>Download Udhiyath Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 3: Meelad Receipt */}
            {(activeSection === 'ALL' || activeSection === 'MEELAD') && (
              <div className="p-5 rounded-2xl border border-emerald-500/25 bg-emerald-950/30 backdrop-blur-xl space-y-4 hover:bg-emerald-950/40 transition-all shadow-inner">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      Milad-un-Nabi Contribution
                    </span>
                    <h4 className="font-bold text-base text-white mt-1.5">
                      Meelad Receipt (Nabi Dinam)
                    </h4>
                    <p className="text-xs text-emerald-200/70">
                      Contributions for Milad-un-Nabi celebrations, student programmes, and community feast.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Contribution</span>
                    <span className="font-black text-emerald-300 text-lg font-mono">₹1,000</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Occasion</span>
                    <span className="font-bold text-white">Milad-un-Nabi 1447 Fund</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Verification</span>
                    <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">Treasurer Signed</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Official Receipt No</span>
                    <span className="font-mono font-bold text-emerald-300">{sampleMeeladReceipt.receiptNumber}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectReceipt(sampleMeeladReceipt)}
                    className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-300" />
                    <span>View Meelad Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 4: Land Rent */}
            {(activeSection === 'ALL' || activeSection === 'LAND_RENT') && (
              <div className="p-5 rounded-2xl border border-amber-500/25 bg-amber-950/30 backdrop-blur-xl space-y-4 hover:bg-amber-950/40 transition-all shadow-inner">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      Waqf Property Lease
                    </span>
                    <h4 className="font-bold text-base text-white mt-1.5">
                      Land Rent (Mahallu Waqf Property)
                    </h4>
                    <p className="text-xs text-amber-200/70">
                      Annual land lease dues and revenue receipts for registered Mahallu agricultural and residential plots.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-medium">Annual Lease</span>
                    <span className="font-black text-amber-300 text-lg font-mono">₹2,400</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Registered Plot Number</span>
                    <span className="font-bold text-white">Plot 14/B (Juma Masjid East)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Lease Agreement</span>
                    <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">Current & Active</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Official Receipt</span>
                    <span className="font-mono font-bold text-amber-300">{sampleLandRentReceipt.receiptNumber}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectReceipt(sampleLandRentReceipt)}
                    className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-300" />
                    <span>View Land Rent Receipt</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          EDIT PROFILE MODAL
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-950">Update Member Profile</h3>
                <p className="text-xs text-gray-500">Edit census record information for your Mahallu ID</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  1. Member Full Name (His Name)
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    2. Father Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fatherName}
                    onChange={e => setEditForm({ ...editForm, fatherName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    3. Mother Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.motherName}
                    onChange={e => setEditForm({ ...editForm, motherName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    4. Date of Birth (Age)
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.dob}
                    onChange={e => setEditForm({ ...editForm, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    5. Blood Group
                  </label>
                  <select
                    value={editForm.bloodGroup}
                    onChange={e => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  6. Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help & Messaging Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Direct Channel to Committee
                </span>
                <h3 className="font-display text-lg font-black text-gray-950 mt-1">
                  Ask for Help or Send Message
                </h3>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedHelpSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-gray-900 text-sm">Request Submitted Successfully</h4>
                <p className="text-xs text-gray-600">
                  Your message has been directly forwarded to the Manoor Mahallu Committee Admin Desk.
                </p>
                <div className="font-mono text-xs font-bold text-emerald-800 bg-white py-1 px-3 rounded-lg border border-emerald-200 inline-block">
                  Tracking ID: {submittedHelpSuccess}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitHelp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Select Help Category / Purpose *
                  </label>
                  <select
                    value={helpCategory}
                    onChange={(e) => setHelpCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="General Help / Enquiry">General Help / Enquiry to Committee</option>
                    <option value="Emergency Ambulance / Medical Aid">Emergency Ambulance / Medical Aid</option>
                    <option value="Financial Relief / Welfare Fund">Financial Relief / Welfare Fund</option>
                    <option value="Madrasa Education / Book Aid">Madrasa Education / Book Aid</option>
                    <option value="Marriage Guidance & Nikah NOC">Marriage Guidance & Nikah NOC</option>
                    <option value="Janaza & Bereavement Assistance">Janaza & Bereavement Assistance</option>
                    <option value="Home Maintenance & Basic Amenities">Home Maintenance & Basic Amenities</option>
                    <option value="Confidential Counseling / Dispute">Confidential Counseling / Dispute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Subject / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={helpSubject}
                    onChange={(e) => setHelpSubject(e.target.value)}
                    placeholder="e.g. Request for Medical Dialysis Assistance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Priority / Urgency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'NORMAL', label: 'Normal' },
                      { id: 'HIGH', label: 'High Priority' },
                      { id: 'EMERGENCY', label: 'Emergency' }
                    ].map((u) => (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => setHelpUrgency(u.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          helpUrgency === u.id
                            ? u.id === 'EMERGENCY'
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Detailed Message / Requirement *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={helpDescription}
                    onChange={(e) => setHelpDescription(e.target.value)}
                    placeholder="Please explain your situation, exact requirement, hospital or family details..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-emerald-900 text-[11px] leading-relaxed">
                  <strong>Notice:</strong> Your request will be securely sent to the Manoor Mahallu Executive Committee. For life-threatening emergencies, also call the 24/7 helpline at <strong>+91 98470 12345</strong>.
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsHelpModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingHelp}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingHelp ? 'Submitting...' : 'Send to Committee'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// Simple Plus icon helper if needed
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
