import { createLazyFileRoute } from "@tanstack/react-router";
import { Ticket, Eye, X } from "lucide-react";
import { useState } from "react";

export const Route = createLazyFileRoute("/_auth/support")({
  component: SupportRouteComponent,
});

type SupportTicket = {
  subject: string;
  description: string;
  date: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  priority?: string;
};

const mockTickets: SupportTicket[] = Array(5).fill({
  subject: "issue with commisions transfere",
  description: "I have issue transfering to token wallet",
  date: "23/11/2025",
  status: "Open",
  createdAt: "January 14, 2026",
  updatedAt: "February 19, 2026",
  priority: "Medium",
});

function SupportActions({ onOpenAddModal }: { onOpenAddModal: () => void }) {
  return (
    <div className="mb-10">
      <button
        onClick={onOpenAddModal}
        className="bg-[#1f3a53] hover:bg-[#15283b] text-white text-[13px] font-semibold px-6 py-2.5 rounded-md transition-colors flex items-center gap-2 shadow-sm"
      >
        <Ticket className="w-4 h-4" />
        Add Ticket
      </button>
    </div>
  );
}

function TicketList({
  onViewTicket,
}: {
  onViewTicket: (ticket: SupportTicket) => void;
}) {
  return (
    <div className="w-full flex flex-col min-w-[800px] overflow-x-auto">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-4 px-8 pb-4 border-b border-transparent">
        <div className="col-span-3 text-slate-400 font-semibold text-sm tracking-wide">
          Subject
        </div>
        <div className="col-span-5 text-slate-400 font-semibold text-sm tracking-wide">
          Description
        </div>
        <div className="col-span-2 text-slate-400 font-semibold text-sm tracking-wide text-center">
          Date
        </div>
        <div className="col-span-2 text-slate-400 font-semibold text-sm tracking-wide text-center">
          Status
        </div>
      </div>

      {/* Ticket Cards */}
      <div className="flex flex-col gap-4 mt-2">
        {mockTickets.map((ticket, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#f8f9fa] hover:bg-[#f1f3f5] transition-colors rounded-2xl items-center"
          >
            <div className="col-span-3 text-slate-800 font-semibold text-[14px]">
              {ticket.subject}
            </div>
            <div className="col-span-5 text-slate-600 font-medium text-[14px]">
              {ticket.description}
            </div>
            <div className="col-span-2 text-slate-700 font-semibold text-[14px] text-center">
              {ticket.date}
            </div>
            <div className="col-span-2 flex items-center justify-center gap-6">
              {/* Status Badge */}
              <div className="border border-emerald-400 text-emerald-500 bg-emerald-50/50 px-6 py-1.5 rounded-md font-medium text-xs tracking-wide">
                {ticket.status}
              </div>
              {/* Action Icon */}
              <button
                onClick={() => onViewTicket(ticket)}
                className="text-slate-800 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200/50"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketDetailsModal({
  ticket,
  onClose,
}: {
  ticket: SupportTicket;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[600px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Ticket Details</h2>
          <button
            onClick={onClose}
            className="text-slate-900 hover:bg-slate-100 p-1.5 rounded-md transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 flex flex-col gap-6">
          {/* Subject Block */}
          <div className="flex flex-col gap-1 pb-6 border-b border-slate-100">
            <span className="text-slate-600 text-sm font-medium">Subject:</span>
            <p className="text-slate-700 font-bold text-lg">{ticket.subject}</p>
          </div>

          {/* Description Block */}
          <div className="flex flex-col gap-1 pb-6 border-b border-slate-100">
            <span className="text-slate-600 text-sm font-medium">
              Description:
            </span>
            <p className="text-slate-700 font-bold text-lg">
              {ticket.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-8 mt-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-500 text-sm font-medium">
                Created At
              </span>
              <span className="text-slate-700 font-bold text-[15px]">
                {ticket.createdAt || ticket.date}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-500 text-sm font-medium">
                Updated At
              </span>
              <span className="text-slate-700 font-bold text-[15px]">
                {ticket.updatedAt || ticket.date}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 items-start">
              <span className="text-slate-500 text-sm font-medium">Status</span>
              <div className="border border-emerald-400 text-emerald-500 bg-emerald-50/50 px-5 py-1 rounded-full font-semibold text-xs tracking-wide">
                {ticket.status}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-500 text-sm font-medium">
                Priority
              </span>
              <span className="text-slate-700 font-bold text-[15px]">
                {ticket.priority || "Medium"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportPagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-auto pt-12 pb-4">
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-bold text-xs">
        &lt;
      </button>
      <button className="w-8 h-8 rounded-full bg-[#295175] flex items-center justify-center text-white shadow-md font-semibold text-xs">
        1
      </button>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs">
        2
      </button>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs">
        3
      </button>
      <div className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold tracking-widest leading-none pb-2 text-xs">
        ...
      </div>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-semibold text-xs">
        10
      </button>
      <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm border border-slate-100 font-bold text-xs">
        &gt;
      </button>
    </div>
  );
}

function AddTicketModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[600px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add Ticket</h2>
          <button
            onClick={onClose}
            className="text-slate-900 hover:bg-slate-100 p-1.5 rounded-md transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 pt-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-slate-700 font-medium text-sm">
              Ticket Title*
            </label>
            <input
              type="text"
              placeholder="Ticket Title"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#295175] focus:ring-1 focus:ring-[#295175]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-slate-700 font-medium text-sm">
              Ticket Description*
            </label>
            <textarea
              rows={5}
              placeholder="Ticket Description"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#295175] focus:ring-1 focus:ring-[#295175] resize-none"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 mt-8">
          <button className="w-full bg-[#1f3a53] hover:bg-[#15283b] text-white text-sm font-semibold py-3.5 rounded-lg transition-colors shadow-sm">
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

function SupportRouteComponent() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#f8fafc] w-full max-w-[1500px] mx-auto">
      <div className="bg-white rounded-[32px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-10 min-h-[85vh] flex flex-col relative">
        {/* Top Actions */}
        <SupportActions onOpenAddModal={() => setIsAddModalOpen(true)} />

        {/* Ticket List */}
        <div className="flex-1 w-full overflow-x-auto">
          <TicketList onViewTicket={setSelectedTicket} />
        </div>

        {/* Pagination */}
        <SupportPagination />

        {/* Modal Portal Element */}
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}

        {isAddModalOpen && (
          <AddTicketModal onClose={() => setIsAddModalOpen(false)} />
        )}
      </div>
    </div>
  );
}
