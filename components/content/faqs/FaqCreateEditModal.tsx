"use client";

import React, { useState } from "react";
import { FaqItem, FaqStatus } from "../types";

interface FaqCreateEditModalProps {
  isOpen: boolean;
  faqToEdit: FaqItem | null;
  onClose: () => void;
  onSave: (faqData: {
    id?: string;
    question: string;
    answer: string;
    category: "shipping" | "returns" | "materials" | "warranty" | "general";
    status: FaqStatus;
  }) => void;
}

interface FaqFormContentProps {
  faqToEdit: FaqItem | null;
  onClose: () => void;
  onSave: (faqData: {
    id?: string;
    question: string;
    answer: string;
    category: "shipping" | "returns" | "materials" | "warranty" | "general";
    status: FaqStatus;
  }) => void;
}

const FaqFormContent: React.FC<FaqFormContentProps> = ({
  faqToEdit,
  onClose,
  onSave,
}) => {
  const [question, setQuestion] = useState(faqToEdit?.question ?? "");
  const [answer, setAnswer] = useState(faqToEdit?.answer ?? "");
  const [category, setCategory] = useState<
    "shipping" | "returns" | "materials" | "warranty" | "general"
  >(faqToEdit?.category ?? "general");
  const [status, setStatus] = useState<FaqStatus>(
    faqToEdit?.status ?? "published"
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Question headline is required");
      return;
    }
    if (!answer.trim()) {
      setError("Answer text is required");
      return;
    }

    onSave({
      id: faqToEdit?.id,
      question: question.trim(),
      answer: answer.trim(),
      category,
      status,
    });
    onClose();
  };

  return (
    <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-250 z-10 border-t border-border-default/60 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
      {/* Grab Handle */}
      <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto -mt-1 mb-1" />

      {/* Modal Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h3
            id="faq-modal-title"
            className="text-[17px] font-semibold text-on-surface"
          >
            {faqToEdit ? "Edit FAQ Item" : "New FAQ Item"}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-[12px] border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Question Input */}
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
            Question
          </span>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How do I initiate a return or exchange?"
            className="w-full h-10 px-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest transition-colors"
          />
        </label>

        {/* Answer Textarea */}
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
            Answer Details
          </span>
          <textarea
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Clear, helpful and concise instructions for your customers..."
            className="w-full p-3 bg-surface-container-low rounded-xl text-[13px] text-on-surface placeholder:text-on-surface-variant/50 border border-border-default/50 focus:border-border-strong focus:outline-none focus:bg-surface-container-lowest resize-none transition-colors"
          />
        </label>

        {/* Category & Visibility Selectors */}
        <div className="grid grid-cols-2 gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Category Tag
            </span>
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as
                    | "shipping"
                    | "returns"
                    | "materials"
                    | "warranty"
                    | "general"
                )
              }
              className="w-full h-10 px-2.5 bg-surface-container-low rounded-xl text-[13px] text-on-surface border border-border-default/50 focus:border-border-strong focus:outline-none"
            >
              <option value="shipping">Shipping</option>
              <option value="returns">Returns</option>
              <option value="materials">Materials</option>
              <option value="warranty">Warranty</option>
              <option value="general">General</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Visibility
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FaqStatus)}
              className="w-full h-10 px-2.5 bg-surface-container-low rounded-xl text-[13px] text-on-surface border border-border-default/50 focus:border-border-strong focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary text-[13px] font-medium transition-all cursor-pointer shadow-xs"
          >
            {faqToEdit ? "Update FAQ" : "Save FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export const FaqCreateEditModal: React.FC<FaqCreateEditModalProps> = ({
  isOpen,
  faqToEdit,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 transition-opacity animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <FaqFormContent
        key={faqToEdit?.id ?? "new-faq"}
        faqToEdit={faqToEdit}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};
