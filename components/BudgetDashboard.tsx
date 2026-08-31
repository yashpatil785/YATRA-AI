'use client';

import React, { useState, useMemo } from 'react';
import { useTrip } from '@/context/TripContext';
import { ExpenseRecord, ExpenseCategory } from '@/lib/types';
import {
  IndianRupee,
  PieChart,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Download,
  Share2,
  CheckCircle,
  Car,
  Utensils,
  Hotel,
  Ticket,
  ShieldCheck,
  Zap,
  Printer,
  Plus,
  Trash2,
  Edit2,
  Users,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  CreditCard,
  QrCode,
  ShoppingBag,
  HelpCircle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  transport: {
    label: 'Transit & Cabs',
    icon: Car,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-400/30'
  },
  stay: {
    label: 'Stay & Lodging',
    icon: Hotel,
    color: 'text-teal-400',
    bg: 'bg-teal-500/20',
    border: 'border-teal-400/30'
  },
  food: {
    label: 'Food & Dining',
    icon: Utensils,
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    border: 'border-amber-400/30'
  },
  activities: {
    label: 'Tours & Entry Fees',
    icon: Ticket,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-400/30'
  },
  shopping: {
    label: 'Shopping & Souvenirs',
    icon: ShoppingBag,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-400/30'
  },
  misc: {
    label: 'Misc & Contingency',
    icon: HelpCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
    border: 'border-rose-400/30'
  }
};

const NOMINAL_EXCHANGE_RATES: Record<string, { name: string; rateToINR: number; symbol: string }> = {
  USD: { name: 'US Dollar', rateToINR: 86.5, symbol: '$' },
  EUR: { name: 'Euro', rateToINR: 91.2, symbol: '€' },
  GBP: { name: 'British Pound', rateToINR: 108.4, symbol: '£' },
  AED: { name: 'UAE Dirham', rateToINR: 23.5, symbol: 'د.إ' },
  SGD: { name: 'Singapore Dollar', rateToINR: 64.8, symbol: 'S$' },
  AUD: { name: 'Australian Dollar', rateToINR: 56.1, symbol: 'A$' }
};

export default function BudgetDashboard() {
  const {
    currentItinerary,
    setIsShareModalOpen,
    collaborators,
    expenses,
    addExpense,
    deleteExpense,
    resetExpensesToItinerary,
    settleExpenses
  } = useTrip();

  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'split' | 'analytics' | 'currency'>('expenses');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Expense Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('food');
  const [newDay, setNewDay] = useState(1);
  const [newPaidBy, setNewPaidBy] = useState(collaborators[0]?.name || 'Yash Patil (You)');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'UPI' | 'Cash' | 'Card' | 'NetBanking'>('UPI');
  const [newNotes, setNewNotes] = useState('');

  // Settle Up Modal
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settlePayer, setSettlePayer] = useState(collaborators[1]?.name || 'Aarav Mehta');
  const [settleReceiver, setSettleReceiver] = useState(collaborators[0]?.name || 'Yash Patil (You)');
  const [settleAmount, setSettleAmount] = useState('860');

  // Currency Converter State
  const [foreignCurrency, setForeignCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState('100');

  const preferences = currentItinerary.preferences;
  const totalAllocatedBudget = preferences.totalBudget || 15000;
  const travelersCount = Math.max(1, preferences.travelersCount);

  // Financial calculations from live expenses list
  const totalLoggedSpend = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const remainingBudget = totalAllocatedBudget - totalLoggedSpend;
  const isWithinBudget = remainingBudget >= 0;
  const utilizationPercentage = Math.min(100, Math.round((totalLoggedSpend / totalAllocatedBudget) * 100));
  const perPersonSpend = Math.round(totalLoggedSpend / travelersCount);

  // Category totals from expenses
  const categoryTotals = useMemo(() => {
    const map: Record<ExpenseCategory, number> = {
      transport: 0,
      stay: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      misc: 0
    };
    expenses.forEach((item) => {
      if (map[item.category] !== undefined) {
        map[item.category] += item.amount;
      }
    });
    return map;
  }, [expenses]);

  // Day totals
  const dayTotals = useMemo(() => {
    const map: Record<number, number> = {};
    currentItinerary.days.forEach((d) => {
      map[d.dayNumber] = 0;
    });
    expenses.forEach((item) => {
      const d = item.dayNumber || 1;
      map[d] = (map[d] || 0) + item.amount;
    });
    return map;
  }, [expenses, currentItinerary.days]);

  // Group split calculations (who paid what vs who owes what)
  const groupSplitSummary = useMemo(() => {
    const memberNames = collaborators.map((c) => c.name);
    // Track total paid by each person
    const paidByMember: Record<string, number> = {};
    // Track fair share of each person
    const shareByMember: Record<string, number> = {};

    memberNames.forEach((name) => {
      paidByMember[name] = 0;
      shareByMember[name] = 0;
    });

    expenses.forEach((exp) => {
      // Ensure payer exists
      if (!paidByMember[exp.paidBy]) {
        paidByMember[exp.paidBy] = 0;
      }
      paidByMember[exp.paidBy] += exp.amount;

      // Split amount among recipients
      const recipients = exp.splitAmong && exp.splitAmong.length > 0 ? exp.splitAmong : memberNames;
      const splitAmount = exp.amount / recipients.length;
      recipients.forEach((rec) => {
        if (!shareByMember[rec]) {
          shareByMember[rec] = 0;
        }
        shareByMember[rec] += splitAmount;
      });
    });

    // Net balance = paid - fair share
    const netBalances: { name: string; paid: number; share: number; net: number }[] = [];
    const allKnownMembers = Array.from(new Set([...memberNames, ...Object.keys(paidByMember)]));

    allKnownMembers.forEach((name) => {
      const paid = Math.round(paidByMember[name] || 0);
      const share = Math.round(shareByMember[name] || 0);
      const net = paid - share;
      netBalances.push({ name, paid, share, net });
    });

    return netBalances;
  }, [expenses, collaborators]);

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesCat = selectedCategoryFilter === 'all' || exp.category === selectedCategoryFilter;
      const matchesDay = selectedDayFilter === 'all' || exp.dayNumber.toString() === selectedDayFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.paidBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesDay && matchesSearch;
    });
  }, [expenses, selectedCategoryFilter, selectedDayFilter, searchQuery]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || isNaN(Number(newAmount))) return;

    addExpense({
      title: newTitle.trim(),
      amount: Math.round(Number(newAmount)),
      category: newCategory,
      date: `Day ${newDay}`,
      dayNumber: newDay,
      paidBy: newPaidBy,
      splitAmong: collaborators.map((c) => c.name),
      paymentMethod: newPaymentMethod,
      notes: newNotes.trim() || undefined
    });

    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setIsAddModalOpen(false);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleSettleUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleAmount || isNaN(Number(settleAmount)) || Number(settleAmount) <= 0) return;

    settleExpenses(settlePayer, settleReceiver, Math.round(Number(settleAmount)));
    setIsSettleModalOpen(false);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleExportPDF = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Amount (INR)', 'Category', 'Day', 'Paid By', 'Payment Mode', 'Notes'];
    const rows = expenses.map((e) => [
      e.id,
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      e.category,
      `Day ${e.dayNumber}`,
      `"${e.paidBy}"`,
      e.paymentMethod,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YatraAI_Budget_${currentItinerary.destination.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Currency calculation
  const convertedToINR = useMemo(() => {
    const amt = parseFloat(foreignAmount) || 0;
    const rate = NOMINAL_EXCHANGE_RATES[foreignCurrency]?.rateToINR || 1;
    return Math.round(amt * rate);
  }, [foreignAmount, foreignCurrency]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 text-white border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/15 via-orange-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-400/30 text-xs font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" />
                Yatra AI Budget Tracker
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10 text-[11px] font-bold">
                {travelersCount} Traveler(s) • {preferences.durationDays} Days • {preferences.budgetTier} Tier
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Travel Budget & Expense Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time expense ledger, multi-traveler group cost splits, category burn-rate analytics, and AI travel savings insights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-950/40 border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>

            <button
              onClick={() => setIsSettleModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/30 font-bold text-xs backdrop-blur-md transition-colors cursor-pointer"
              title="Settle up group balances"
            >
              <Users className="w-3.5 h-3.5 text-teal-400" />
              <span>Settle Up</span>
            </button>

            <button
              onClick={resetExpensesToItinerary}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold text-xs backdrop-blur-md transition-colors cursor-pointer"
              title="Sync entry fee estimates from active itinerary"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync POIs</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs backdrop-blur-md transition-colors cursor-pointer"
              title="Export expenses to spreadsheet CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs backdrop-blur-md transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Summary Stats */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Spend vs Allocated */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Total Actual Spend</span>
              <span className="text-[10px] text-teal-300 font-bold">{expenses.length} Records</span>
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-white">₹{totalLoggedSpend.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ ₹{totalAllocatedBudget.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  utilizationPercentage > 90 ? 'bg-rose-400' : utilizationPercentage > 75 ? 'bg-amber-400' : 'bg-teal-400'
                }`}
                style={{ width: `${utilizationPercentage}%` }}
              />
            </div>
          </div>

          {/* Card 2: Remaining Balance */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remaining Buffer</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className={`text-2xl font-black ${isWithinBudget ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{Math.abs(remainingBudget).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">{isWithinBudget ? 'Surplus Left' : 'Over Target'}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] mt-2 font-medium">
              {isWithinBudget ? (
                <span className="text-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{100 - utilizationPercentage}% of cap untouched</span>
                </span>
              ) : (
                <span className="text-rose-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Exceeded by {utilizationPercentage - 100}%</span>
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Per-Person Share */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Per Traveler Share</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-amber-300">₹{perPersonSpend.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ person</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2">
              Based on {travelersCount} group member(s).
            </p>
          </div>

          {/* Card 4: Daily Average Burn */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Daily Burn Rate</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-black text-orange-300">
                ₹{Math.round(totalLoggedSpend / Math.max(1, preferences.durationDays)).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ day</span>
            </div>
            <p className="text-[11px] text-emerald-300 mt-2 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Optimized without peak surges</span>
            </p>
          </div>

        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
            activeSubTab === 'expenses'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Expenses Ledger ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('split')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
            activeSubTab === 'split'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Group Split & Settle ({collaborators.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Category & Daily Analytics</span>
        </button>

        <button
          onClick={() => setActiveSubTab('currency')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
            activeSubTab === 'currency'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Savings & Currency Tools</span>
        </button>
      </div>

      {/* SUB-VIEW 1: ITEMIZED EXPENSES LEDGER */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-4">
          
          {/* Controls Bar: Search & Filter Chips */}
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search expense by title, payer, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-bold shrink-0 hidden sm:inline">Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="all">All Categories</option>
                <option value="transport">Transit & Cabs</option>
                <option value="stay">Stay & Lodging</option>
                <option value="food">Food & Dining</option>
                <option value="activities">Tours & Entry Fees</option>
                <option value="shopping">Shopping</option>
                <option value="misc">Miscellaneous</option>
              </select>

              {/* Day Filter */}
              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="all">All Days</option>
                {currentItinerary.days.map((d) => (
                  <option key={d.dayNumber} value={d.dayNumber.toString()}>
                    Day {d.dayNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expenses List */}
          {filteredExpenses.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-slate-400 flex items-center justify-center mx-auto">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No expenses matched your filter</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing search filters or click Log Expense to add a new transaction.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow transition-all cursor-pointer inline-flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Expense</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredExpenses.map((exp) => {
                const catInfo = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG.misc;
                const IconComponent = catInfo.icon;
                return (
                  <div
                    key={exp.id}
                    className="bg-white/5 backdrop-blur-xl p-4.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-md flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl ${catInfo.bg} ${catInfo.color} ${catInfo.border} border flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-black text-white">{exp.title}</h4>
                          {exp.isPlannedEstimate && (
                            <span className="px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-400/20">
                              Estimated
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300">
                            Day {exp.dayNumber}
                          </span>
                          <span>•</span>
                          <span className="text-slate-300">Paid by <strong className="text-white">{exp.paidBy}</strong></span>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 font-bold">
                            {exp.paymentMethod}
                          </span>
                        </div>
                        {exp.notes && (
                          <p className="text-[11px] text-slate-300/80 italic pt-0.5">{exp.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 space-y-2">
                      <span className="text-base font-black text-white tracking-tight">
                        ₹{exp.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Delete expense entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: GROUP EXPENSE SPLIT & SETTLEMENT */}
      {activeSubTab === 'split' && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  <span>Travel Group Balance Matrix</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Automatic per-person expense splitting and settlement calculations for this trip.
                </p>
              </div>

              <button
                onClick={() => setIsSettleModalOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-xs shadow-lg shadow-teal-950/40 transition-all hover:scale-105 cursor-pointer shrink-0"
              >
                <QrCode className="w-4 h-4" />
                <span>Settle via UPI</span>
              </button>
            </div>

            {/* Member Net Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {groupSplitSummary.map((member) => {
                const getsBack = member.net > 0;
                const isEven = member.net === 0;
                return (
                  <div
                    key={member.name}
                    className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{member.name}</span>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                        isEven
                          ? 'bg-slate-500/20 text-slate-300 border-slate-400/20'
                          : getsBack
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      }`}>
                        {isEven ? 'Settled' : getsBack ? `+₹${member.net.toLocaleString()} gets back` : `-₹${Math.abs(member.net).toLocaleString()} owes`}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-white/10">
                      <div className="flex justify-between">
                        <span>Total Paid Out:</span>
                        <strong className="text-white">₹{member.paid.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fair Group Share:</span>
                        <strong className="text-slate-300">₹{member.share.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suggested Settlements Section */}
            <div className="bg-white/5 p-4.5 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Recommended Simplified Settlements
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-rose-300">Aarav Mehta</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-emerald-300">Yash Patil (You)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <strong className="text-white font-black text-sm">₹860</strong>
                    <button
                      onClick={() => {
                        setSettlePayer('Aarav Mehta');
                        setSettleReceiver('Yash Patil (You)');
                        setSettleAmount('860');
                        setIsSettleModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/30 font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Record Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CATEGORY & DAILY ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Category Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((catKey) => {
              const catInfo = CATEGORY_CONFIG[catKey];
              const IconComp = catInfo.icon;
              const catAmount = categoryTotals[catKey] || 0;
              const catPercent = totalLoggedSpend > 0 ? Math.round((catAmount / totalLoggedSpend) * 100) : 0;
              return (
                <div
                  key={catKey}
                  className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl ${catInfo.bg} ${catInfo.color} ${catInfo.border} border flex items-center justify-center shadow-xs`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-400">{catPercent}%</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{catInfo.label}</p>
                    <h3 className="text-xl font-black text-white mt-1">₹{catAmount.toLocaleString()}</h3>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${catInfo.bg} rounded-full`} style={{ width: `${catPercent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Burn Rate Card */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Day-by-Day Spend Trajectory</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentItinerary.days.map((day) => {
                const daySpent = dayTotals[day.dayNumber] || 0;
                const dailyCap = Math.round(totalAllocatedBudget / currentItinerary.days.length);
                const dayPercent = Math.min(100, Math.round((daySpent / dailyCap) * 100));
                return (
                  <div
                    key={day.dayNumber}
                    className="bg-white/5 p-4.5 rounded-2xl border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-orange-400">Day {day.dayNumber} ({day.date})</span>
                      <span className="text-xs font-bold text-slate-400">{dayPercent}% cap</span>
                    </div>
                    <div className="text-xl font-black text-white">
                      ₹{daySpent.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cap: ₹{dailyCap.toLocaleString()} / day
                    </p>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full ${
                          daySpent > dailyCap ? 'bg-rose-400' : 'bg-teal-400'
                        }`}
                        style={{ width: `${dayPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: AI SAVINGS & CURRENCY TOOLS */}
      {activeSubTab === 'currency' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: AI Cost-Saving Recommendations */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-black text-white">YatraAI Local Cost-Saving Recommendations</h3>
            </div>

            <div className="space-y-3">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
                <div className="flex items-center space-x-2 text-xs font-black text-orange-400">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span>Rental Scooter & EV Advantage</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Opting for a rental gearless scooter for North Goa circuits will save roughly <strong className="text-white">₹800/day</strong> compared to private taxis.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
                <div className="flex items-center space-x-2 text-xs font-black text-teal-300">
                  <Ticket className="w-4 h-4 text-teal-400" />
                  <span>Inclusive Farm Buffet Strategy</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Sahakari Spice Farm ticket on Day 2 includes an authentic Saraswat buffet lunch, saving <strong className="text-white">₹1,200</strong> in outside restaurant dining.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xs">
                <div className="flex items-center space-x-2 text-xs font-black text-indigo-300">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>ASI Digital Ticket QR Passes</span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Booking Aguada Fort passes via official ASI portals avoids spot ticket counter queues and offers a <strong className="text-white">₹25 online discount</strong> per head.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live Foreign Currency Converter */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-black text-white">Live Currency to INR Converter</h3>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Select Currency:</label>
                <select
                  value={foreignCurrency}
                  onChange={(e) => setForeignCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#020617] border border-white/15 text-white text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {Object.entries(NOMINAL_EXCHANGE_RATES).map(([code, info]) => (
                    <option key={code} value={code}>
                      {code} - {info.name} ({info.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Amount ({foreignCurrency}):</label>
                <input
                  type="number"
                  value={foreignAmount}
                  onChange={(e) => setForeignAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-black focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="100"
                />
              </div>

              {/* Conversion Result Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-emerald-950/60 border border-teal-500/40 text-center space-y-1">
                <span className="text-[11px] text-teal-300 font-bold uppercase tracking-wider">Estimated Value in Indian Rupees</span>
                <div className="text-3xl font-black text-white">
                  ₹{convertedToINR.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-400">
                  1 {foreignCurrency} = ₹{NOMINAL_EXCHANGE_RATES[foreignCurrency]?.rateToINR} INR (Nominal benchmark)
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* MODAL: LOG NEW EXPENSE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#020617] border border-white/20 rounded-3xl p-6 w-full max-w-lg shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-400/30">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-white">Log Travel Expense</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Expense / Vendor Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fisherman's Wharf Seafood Lunch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1200"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-black placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transit & Cabs</option>
                    <option value="stay">Stay & Lodging</option>
                    <option value="activities">Tours & Entry Fees</option>
                    <option value="shopping">Shopping</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Day of Trip</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {currentItinerary.days.map((d) => (
                      <option key={d.dayNumber} value={d.dayNumber}>
                        Day {d.dayNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Paid By</label>
                  <select
                    value={newPaidBy}
                    onChange={(e) => setNewPaidBy(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {collaborators.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Mode</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as 'UPI' | 'Cash' | 'Card' | 'NetBanking')}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="NetBanking">NetBanking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Split with everyone; includes tip"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-950/40 transition-all hover:scale-105"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SETTLE UP GROUP BALANCES */}
      {isSettleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#020617] border border-white/20 rounded-3xl p-6 w-full max-w-md shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-400/30">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-white">Settle Group Balances</h3>
              </div>
              <button
                onClick={() => setIsSettleModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSettleUp} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Simulated UPI QR Payment</span>
                <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                  <QrCode className="w-24 h-24 text-slate-950" />
                </div>
                <p className="text-[11px] text-teal-300 font-bold">UPI ID: yatra.split@okhdfcbank</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Sender (Payer)</label>
                  <select
                    value={settlePayer}
                    onChange={(e) => setSettlePayer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {collaborators.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Receiver</label>
                  <select
                    value={settleReceiver}
                    onChange={(e) => setSettleReceiver(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#020617] border border-white/15 text-slate-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {collaborators.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Settlement Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-black focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-xs shadow-lg shadow-teal-950/40 transition-all hover:scale-105"
                >
                  Mark Settled via UPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
