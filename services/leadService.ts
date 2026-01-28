import { supabase } from '../lib/supabase';
import { Lead, CRMStatus, HistoryItem } from '../types';

// Fetch all leads with their history
export const fetchLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      history (*)
    `)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  // Sort history for each lead (newest first)
  return data.map((lead: any) => ({
    ...lead,
    history: lead.history.sort((a: HistoryItem, b: HistoryItem) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }));
};

// Create a new lead and its initial history entry
export const createLead = async (lead: Lead): Promise<void> => {
  // 1. Insert Lead
  const { error: leadError } = await supabase
    .from('leads')
    .insert({
      id: lead.id,
      username: lead.username,
      platform: lead.platform,
      message_text: lead.message_text,
      timestamp: lead.timestamp,
      crm_status: lead.crm_status,
      tags: lead.tags,
      analysis: lead.analysis
    });

  if (leadError) throw leadError;

  // 2. Insert Initial History
  if (lead.history.length > 0) {
    const historyItems = lead.history.map(h => ({
      id: h.id,
      lead_id: lead.id,
      date: h.date,
      type: h.type,
      content: h.content,
      author: h.author
    }));

    const { error: historyError } = await supabase
      .from('history')
      .insert(historyItems);

    if (historyError) throw historyError;
  }
};

// Update status and add a history record
export const updateLeadStatus = async (leadId: string, newStatus: CRMStatus): Promise<void> => {
  // Update Status
  const { error: updateError } = await supabase
    .from('leads')
    .update({ crm_status: newStatus })
    .eq('id', leadId);

  if (updateError) throw updateError;

  // Add History Record
  const { error: historyError } = await supabase
    .from('history')
    .insert({
      id: Date.now().toString(),
      lead_id: leadId,
      date: new Date().toISOString(),
      type: 'status_change',
      content: `Status updated to ${newStatus}`
    });

  if (historyError) throw historyError;
};

// Add a note to a lead
export const addLeadNote = async (leadId: string, content: string): Promise<void> => {
  const { error } = await supabase
    .from('history')
    .insert({
      id: Date.now().toString(),
      lead_id: leadId,
      date: new Date().toISOString(),
      type: 'note',
      content: content
    });

  if (error) throw error;
};

// Clear all data (For the reset button)
export const clearAllData = async (): Promise<void> => {
  const { error: hError } = await supabase.from('history').delete().neq('id', '0');
  if (hError) throw hError;
  
  const { error: lError } = await supabase.from('leads').delete().neq('id', '0');
  if (lError) throw lError;
};