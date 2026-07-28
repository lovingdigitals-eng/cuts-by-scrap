"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

const emptyForm = { question: "", answer: "", order: "0" };

export function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    setFaqs(data.faqs || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm({ ...emptyForm, order: String(faqs.length) });
    setCreating(true);
  }

  function openEdit(faq: Faq) {
    setForm({ question: faq.question, answer: faq.answer, order: String(faq.order) });
    setEditing(faq);
  }

  function closeModal() {
    setEditing(null);
    setCreating(false);
  }

  async function save() {
    setSaving(true);
    const payload = { question: form.question, answer: form.answer, order: Number(form.order) };
    if (editing) {
      await fetch(`/api/admin/faq/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    closeModal();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
          FAQ
        </h1>
        <Button onClick={openCreate}>Add Question</Button>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : (
        <div className="space-y-4">
          {faqs
            .sort((a, b) => a.order - b.order)
            .map((faq) => (
              <GlassCard key={faq.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-heading text-base font-bold text-white">{faq.question}</p>
                    <p className="mt-2 text-sm text-white/60">{faq.answer}</p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button
                      onClick={() => openEdit(faq)}
                      className="text-xs font-semibold uppercase tracking-wide text-chrome hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(faq.id)}
                      className="text-xs font-semibold uppercase tracking-wide text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
        </div>
      )}

      <Modal open={creating || !!editing} onClose={closeModal}>
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          {editing ? "Edit Question" : "New Question"}
        </h3>
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="faq-question">Question</Label>
            <Input
              id="faq-question"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="faq-answer">Answer</Label>
            <Textarea
              id="faq-answer"
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="faq-order">Display Order</Label>
            <Input
              id="faq-order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || !form.question || !form.answer}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
