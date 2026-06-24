import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout, GlowButton } from "@/components/resqnet/kit";
import { UserPlus, Phone, Trash2, Edit2, Users, Loader2, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmergencyContacts,
  addEmergencyContact,
  deleteEmergencyContact,
} from "@/lib/api/resqnet.api";

export const Route = createFileRoute("/contacts-setup")({
  head: () => ({ meta: [{ title: "Contacts — ResQNet" }] }),
  component: ContactsSetup,
});

function ContactsSetup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["emergency_contacts", user?.id],
    queryFn: () => getEmergencyContacts(user!.id),
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: (contact: any) => addEmergencyContact(user!.id, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency_contacts", user?.id] });
      setIsAdding(false);
      setNewContact({ name: "", relation: "", phone: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmergencyContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency_contacts", user?.id] });
    },
  });

  const handleAdd = () => {
    if (!newContact.name || !newContact.phone) return;
    addMutation.mutate({
      name: newContact.name,
      relation: newContact.relation,
      phone: newContact.phone,
      priority: contacts.length + 1,
    });
  };

  return (
    <DashboardLayout withNav>
      <div className="max-w-md mx-auto p-4 md:p-6 w-full space-y-6 pt-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Emergency Contacts</h1>
              <p className="text-xs text-muted-foreground">{contacts.length} Active</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" /> Add
          </button>
        </div>

        {/* Add Contact Form */}
        {isAdding && (
          <div className="bg-card border border-primary/30 rounded-3xl p-5 shadow-lg relative animate-in fade-in slide-in-from-top-4">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-bold text-lg mb-4">Add New Contact</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase">Name</label>
                <input
                  autoFocus
                  placeholder="e.g. Meera Singh"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase">Relation</label>
                <input
                  placeholder="e.g. Mother, Spouse"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold uppercase">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full mt-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <GlowButton
                onClick={handleAdd}
                disabled={addMutation.isPending || !newContact.name || !newContact.phone}
                className="w-full mt-4 h-11"
              >
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Contact"}
              </GlowButton>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col">
            {contacts.map((c, index) => (
              <div
                key={c.id}
                className={`flex items-center justify-between p-4 ${
                  index !== contacts.length - 1 ? "border-b border-border" : ""
                } hover:bg-secondary/30 transition-colors`}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-sm">{c.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.relation} • {c.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center hover:bg-success/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this contact?")) {
                        deleteMutation.mutate(c.id);
                      }
                    }}
                    className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors disabled:opacity-50"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === c.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
            {contacts.length === 0 && !isAdding && (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No contacts added yet. Click "Add" above to add your first emergency contact.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
