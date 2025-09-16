import { supabaseAdmin, TABLES } from './supabase';

/**
 * Database transaction utility for ensuring data consistency
 * Supabase doesn't support traditional transactions, so we implement compensating actions
 */

export interface TransactionStep {
  name: string;
  execute: () => Promise<any>;
  compensate?: () => Promise<void>;
}

export class DatabaseTransaction {
  private steps: TransactionStep[] = [];
  private executedSteps: { step: TransactionStep; result: any }[] = [];

  addStep(step: TransactionStep) {
    this.steps.push(step);
    return this;
  }

  async execute(): Promise<{ success: boolean; results: any[]; error?: string }> {
    try {
      const results: any[] = [];
      
      // Execute all steps
      for (const step of this.steps) {
        console.log(`Executing transaction step: ${step.name}`);
        const result = await step.execute();
        this.executedSteps.push({ step, result });
        results.push(result);
      }

      console.log(`Transaction completed successfully with ${this.steps.length} steps`);
      return { success: true, results };

    } catch (error) {
      console.error('Transaction failed, initiating compensating actions:', error);
      
      // Execute compensating actions in reverse order
      for (let i = this.executedSteps.length - 1; i >= 0; i--) {
        const { step } = this.executedSteps[i];
        if (step.compensate) {
          try {
            console.log(`Compensating step: ${step.name}`);
            await step.compensate();
          } catch (compensateError) {
            console.error(`Compensation failed for step ${step.name}:`, compensateError);
            // Continue with other compensations
          }
        }
      }

      return { 
        success: false, 
        results: [], 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

/**
 * Convenience function for simple transactions
 */
export async function withTransaction<T>(
  steps: TransactionStep[]
): Promise<{ success: boolean; results: T[]; error?: string }> {
  const transaction = new DatabaseTransaction();
  steps.forEach(step => transaction.addStep(step));
  return transaction.execute() as Promise<{ success: boolean; results: T[]; error?: string }>;
}

/**
 * Database operation helpers with built-in error handling
 */
export const dbOps = {
  /**
   * Create a lead with compensation
   */
  createLead: (leadData: any) => ({
    name: 'create_lead',
    execute: async () => {
      const { data, error } = await supabaseAdmin
        .from(TABLES.LEADS)
        .insert(leadData)
        .select()
        .single();
      
      if (error) throw new Error(`Failed to create lead: ${error.message}`);
      return data;
    },
    compensate: async () => {
      // Note: We can't easily delete the lead without the ID
      // This is a limitation of the compensation pattern
      console.log('Lead creation compensation: Manual cleanup may be required');
    }
  }),

  /**
   * Update lead with user ID
   */
  linkLeadToUser: (leadId: string, userId: string) => ({
    name: 'link_lead_to_user',
    execute: async () => {
      const { data, error } = await supabaseAdmin
        .from(TABLES.LEADS)
        .update({ user_id: userId, updated_at: new Date().toISOString() })
        .eq('id', leadId)
        .select()
        .single();
      
      if (error) throw new Error(`Failed to link lead to user: ${error.message}`);
      return data;
    },
    compensate: async () => {
      await supabaseAdmin
        .from(TABLES.LEADS)
        .update({ user_id: null, updated_at: new Date().toISOString() })
        .eq('id', leadId);
    }
  }),

  /**
   * Create a user account
   */
  createUser: (userData: any) => ({
    name: 'create_user',
    execute: async () => {
      const { data, error } = await supabaseAdmin
        .from(TABLES.USERS)
        .insert(userData)
        .select()
        .single();
      
      if (error) throw new Error(`Failed to create user: ${error.message}`);
      return data;
    },
    compensate: async () => {
      // Note: This requires the user ID from the result
      console.log('User creation compensation: Manual cleanup may be required');
    }
  }),

  /**
   * Update multiple leads to link to user
   */
  linkLeadsToUser: (email: string, userId: string) => ({
    name: 'link_leads_to_user',
    execute: async () => {
      const { data, error } = await supabaseAdmin
        .from(TABLES.LEADS)
        .update({ user_id: userId, updated_at: new Date().toISOString() })
        .eq('email', email)
        .is('user_id', null);
      
      if (error) throw new Error(`Failed to link leads to user: ${error.message}`);
      return data;
    },
    compensate: async () => {
      await supabaseAdmin
        .from(TABLES.LEADS)
        .update({ user_id: null, updated_at: new Date().toISOString() })
        .eq('email', email)
        .eq('user_id', userId);
    }
  }),

  /**
   * Update multiple reports to link to user and upgrade access type
   */
  upgradeReportsToAccount: (leadIds: string[], userId: string) => ({
    name: 'upgrade_reports_to_account',
    execute: async () => {
      const { data, error } = await supabaseAdmin
        .from(TABLES.REPORTS)
        .update({ 
          user_id: userId, 
          access_type: 'account',
          updated_at: new Date().toISOString()
        })
        .in('lead_id', leadIds);
      
      if (error) throw new Error(`Failed to upgrade reports: ${error.message}`);
      return data;
    },
    compensate: async () => {
      await supabaseAdmin
        .from(TABLES.REPORTS)
        .update({ 
          user_id: null, 
          access_type: 'guest',
          updated_at: new Date().toISOString()
        })
        .in('lead_id', leadIds);
    }
  }),

  /**
   * Create an audit report
   */
  createReport: (reportData: any) => ({
    name: 'create_report',
    execute: async () => {
      const { data, error } = await supabaseAdmin
        .from(TABLES.REPORTS)
        .insert(reportData)
        .select()
        .single();
      
      if (error) throw new Error(`Failed to create report: ${error.message}`);
      return data;
    },
    compensate: async () => {
      console.log('Report creation compensation: Manual cleanup may be required');
    }
  })
};
