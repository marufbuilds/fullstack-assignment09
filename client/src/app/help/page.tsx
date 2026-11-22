"use client";

// Help center: frequently asked questions plus contact options.

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  Mail,
  MessageSquare,
  PackageSearch,
} from "lucide-react";

import { Notice, PageHeader } from "@/components/ui";

const faqs: { question: string; answer: string }[] = [
  {
    question: "How do I rent equipment?",
    answer:
      "Browse the marketplace, open a listing, choose your start and end dates and send a booking request. The estimated total is shown before you confirm. Complete payment from My rentals to lock in your dates, and the owner approves the rental.",
  },
  {
    question: "Can I list my own equipment?",
    answer:
      "Yes. Accounts start with the customer role, and an administrator enables the owner role for you. Once you are an owner, use Add equipment to submit a listing — it appears on the marketplace after an admin approves it.",
  },
  {
    question: "When is my booking confirmed?",
    answer:
      "A booking is created as pending. Pay through Stripe checkout within the 30 minute hold window, then the owner confirms it. You can follow every step from the My rentals page.",
  },
  {
    question: "Can I cancel a rental?",
    answer:
      "Contact the owner or our support team to cancel. Confirmed bookings that have already been paid are handled case by case so owners are fairly compensated.",
  },
  {
    question: "How do payments work?",
    answer:
      "Payments are processed by Stripe in test mode for this assignment. Your card details never touch the Equiply servers, and each booking shows whether it is paid or unpaid.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email support@equiply.example and we will get back to you within one business day. Include your booking reference when you have one.",
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="wrap section" style={{ maxWidth: 900 }}>
      <PageHeader
        eyebrow="Help center"
        title="Frequently asked questions"
        description="A quick guide to using the Equiply marketplace, from booking your first rental to listing your own gear."
      />

      <div className="stack">
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <article className="card faq" key={faq.question}>
              <button
                onClick={() => setOpen(isOpen ? null : index)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  alignItems: "center",
                  background: "none",
                  border: 0,
                  padding: 0,
                  textAlign: "left",
                  color: "inherit",
                }}
                aria-expanded={isOpen}
              >
                <h3 style={{ margin: 0 }}>{faq.question}</h3>
                <ChevronDown
                  size={20}
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: "transform .2s ease",
                    color: "var(--muted)",
                    flex: "none",
                  }}
                />
              </button>
              {isOpen && (
                <p className="muted" style={{ marginTop: 10 }}>
                  {faq.answer}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="grid3" style={{ marginTop: 34 }}>
        <div className="card card-pad">
          <span className="stat-icon">
            <Mail size={19} />
          </span>
          <h3 className="h3" style={{ fontSize: 17, marginTop: 12 }}>
            Email support
          </h3>
          <p className="muted" style={{ margin: "6px 0 0", fontSize: 14 }}>
            support@equiply.example
          </p>
        </div>

        <div className="card card-pad">
          <span className="stat-icon">
            <MessageSquare size={19} />
          </span>
          <h3 className="h3" style={{ fontSize: 17, marginTop: 12 }}>
            Response time
          </h3>
          <p className="muted" style={{ margin: "6px 0 0", fontSize: 14 }}>
            Within one business day
          </p>
        </div>

        <div className="card card-pad">
          <span className="stat-icon">
            <CircleHelp size={19} />
          </span>
          <h3 className="h3" style={{ fontSize: 17, marginTop: 12 }}>
            Booking help
          </h3>
          <p className="muted" style={{ margin: "6px 0 0", fontSize: 14 }}>
            Keep your booking reference handy
          </p>
        </div>
      </div>

      <div className="notice" style={{ marginTop: 28 }}>
        <strong style={{ display: "block", marginBottom: 4 }}>New to Equiply?</strong>
        Create an account to save favorites, request rentals and follow every booking from
        your dashboard.{" "}
        <Link href="/register" style={{ fontWeight: 700 }}>
          Get started →
        </Link>
      </div>

      <div style={{ marginTop: 22 }}>
        <Link className="btn btn-outline" href="/equipment">
          <PackageSearch size={16} /> Back to marketplace
        </Link>
      </div>
    </div>
  );
}
