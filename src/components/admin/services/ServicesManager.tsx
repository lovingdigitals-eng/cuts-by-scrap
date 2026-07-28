"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  order: number;
  active: boolean;
}

const emptyForm = { name: "", price: "", duration: "", description: "", order: "0", active: true };

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data.services || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setCreating(true);
  }

  function openEdit(service: Service) {
    setForm({
      name: service.name,
      price: String(service.price),
      duration: String(service.duration),
      description: service.description,
      order: String(service.order),
      active: service.active,
    });
    setEditing(service);
  }

  async function save() {
    setSaving(true);
    const payload = {
      name: form.name,
      price: Number(form.price),
      duration: Number(form.duration),
      description: form.description,
      order: Number(form.order),
      active: form.active,
    };

    if (editing) {
      await fetch(`/api/admin/services/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setEditing(null);
    setCreating(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    load();
  }

  const modalOpen = creating || !!editing;

  function closeModal() {
    setEditing(null);
    setCreating(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-chrome-gradient">
          Services
        </h1>
        <Button onClick={openCreate}>Add Service</Button>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <GlassCard key={service.id} className="p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-base font-bold uppercase tracking-wide text-white">
                  {service.name}
                </h3>
                <Badge tone={service.active ? "success" : "muted"}>
                  {service.active ? "Active" : "Hidden"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-chrome">
                ${service.price} · {service.duration} min
              </p>
              <p className="mt-3 text-sm text-white/60">{service.description}</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => openEdit(service)}
                  className="text-xs font-semibold uppercase tracking-wide text-chrome hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(service.id)}
                  className="text-xs font-semibold uppercase tracking-wide text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal}>
        <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-chrome">
          {editing ? "Edit Service" : "New Service"}
        </h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="svc-name">Name</Label>
            <Input id="svc-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="svc-price">Price ($)</Label>
            <Input
              id="svc-price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="svc-duration">Duration (min)</Label>
            <Input
              id="svc-duration"
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="svc-description">Description</Label>
            <Textarea
              id="svc-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="svc-order">Display Order</Label>
            <Input
              id="svc-order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4 rounded border-border-dim"
              />
              Visible on site
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || !form.name || !form.price || !form.duration}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
