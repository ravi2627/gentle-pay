import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientWithStats extends Client {
  totalPaid: number;
  totalOutstanding: number;
}

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string;
}

export const useClients = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all clients for current user
  const {
    data: clients = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Client[];
    },
  });

  // Fetch clients with payment stats
  const {
    data: clientsWithStats = [],
    isLoading: isLoadingWithStats,
  } = useQuery({
    queryKey: ["clients-with-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientsError) throw clientsError;

      // Get invoices for stats
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("client_id, amount, status");

      if (invoicesError) throw invoicesError;

      // Calculate stats per client
      const clientStats = (clientsData as Client[]).map((client) => {
        const clientInvoices = invoicesData?.filter((inv) => inv.client_id === client.id) || [];
        const totalPaid = clientInvoices
          .filter((inv) => inv.status === "paid")
          .reduce((sum, inv) => sum + Number(inv.amount), 0);
        const totalOutstanding = clientInvoices
          .filter((inv) => inv.status !== "paid")
          .reduce((sum, inv) => sum + Number(inv.amount), 0);

        return {
          ...client,
          totalPaid,
          totalOutstanding,
        };
      });

      return clientStats as ClientWithStats[];
    },
  });

  // Create client
  const createClient = useMutation({
    mutationFn: async (clientData: CreateClientData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("clients")
        .insert({
          user_id: user.id,
          name: clientData.name,
          email: clientData.email || null,
          phone: clientData.phone || null,
          company: clientData.company || null,
          notes: clientData.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients-with-stats"] });
      toast({
        title: "Client added",
        description: `${data.name} has been added to your clients.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create client",
        variant: "destructive",
      });
    },
  });

  // Update client
  const updateClient = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateClientData) => {
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients-with-stats"] });
      toast({
        title: "Client updated",
        description: `${data.name} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update client",
        variant: "destructive",
      });
    },
  });

  // Delete client
  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients-with-stats"] });
      toast({
        title: "Client removed",
        description: "The client has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete client",
        variant: "destructive",
      });
    },
  });

  return {
    clients,
    clientsWithStats,
    isLoading,
    isLoadingWithStats,
    error,
    refetch,
    createClient,
    updateClient,
    deleteClient,
  };
};
