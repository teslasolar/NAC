/**
 * ISA-88 Recipe Manager - Legal Code as Batch Recipes
 * Treats PA County Code sections as executable recipes
 *
 * ISA-88 Hierarchy applied to Legal Code:
 * - Recipe = Statute/Code Section (e.g., 16 Pa.C.S. §1720)
 * - Procedure = Complete legal process (e.g., Annual Audit)
 * - Unit Procedure = Assigned to specific unit (e.g., Sheriff Audit)
 * - Operation = Major activity (e.g., Account Reconciliation)
 * - Phase = Atomic action (e.g., Verify Balance)
 */

const RecipeType = {
  MASTER: 'master',      // Template recipe (the statute itself)
  SITE: 'site',          // County-specific implementation
  CONTROL: 'control',    // Runtime execution instance
};

const RecipeStatus = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETE: 'complete',
  ABORTED: 'aborted',
  HELD: 'held',
};

class Recipe {
  constructor(id, statute, type = RecipeType.MASTER) {
    this.id = id;
    this.statute = statute;
    this.type = type;
    this.version = '1.0.0';
    this.procedures = [];
    this.parameters = {};
    this.created = new Date().toISOString();
  }

  addProcedure(procedure) {
    this.procedures.push(procedure);
    return this;
  }
}

class Procedure {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.unitProcedures = [];
    this.status = RecipeStatus.IDLE;
  }

  addUnitProcedure(up) {
    this.unitProcedures.push(up);
    return this;
  }
}

class UnitProcedure {
  constructor(id, name, targetUnit) {
    this.id = id;
    this.name = name;
    this.targetUnit = targetUnit; // e.g., 'sheriff', 'treasurer'
    this.operations = [];
    this.status = RecipeStatus.IDLE;
  }

  addOperation(op) {
    this.operations.push(op);
    return this;
  }
}

class Operation {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.phases = [];
    this.status = RecipeStatus.IDLE;
  }

  addPhase(phase) {
    this.phases.push(phase);
    return this;
  }
}

class Phase {
  constructor(id, name, action) {
    this.id = id;
    this.name = name;
    this.action = action; // Function to execute
    this.status = RecipeStatus.IDLE;
    this.parameters = {};
    this.result = null;
  }
}

// Pre-built Legal Code Recipes
const LegalRecipes = {
  // 16 Pa.C.S. §1720 - Audit and Settlement
  AUDIT_SETTLEMENT: () => {
    const recipe = new Recipe('R-1720', '16 Pa.C.S. §1720', RecipeType.MASTER);
    recipe.parameters = {
      fiscalYear: new Date().getFullYear(),
      auditStandard: 'GAGAS',
    };

    const auditProcedure = new Procedure('P-AUDIT', 'Annual Audit Procedure');

    // Create unit procedures for each row officer
    const officers = ['treasurer', 'sheriff', 'register_of_wills',
                      'recorder_of_deeds', 'prothonotary', 'clerk_of_courts',
                      'coroner', 'district_attorney'];

    officers.forEach(officer => {
      const up = new UnitProcedure(`UP-${officer.toUpperCase()}`,
                                    `${officer} Audit`, officer);

      const accountRecon = new Operation('OP-RECON', 'Account Reconciliation');
      accountRecon.addPhase(new Phase('PH-BAL', 'Verify Opening Balance',
        (ctx) => ctx.openingBalance === ctx.priorClosing));
      accountRecon.addPhase(new Phase('PH-TXN', 'Validate Transactions',
        (ctx) => ctx.transactions.every(t => t.authorized)));
      accountRecon.addPhase(new Phase('PH-CLOSE', 'Confirm Closing Balance',
        (ctx) => ctx.closingBalance === ctx.calculated));

      up.addOperation(accountRecon);
      auditProcedure.addUnitProcedure(up);
    });

    recipe.addProcedure(auditProcedure);
    return recipe;
  },

  // 16 Pa.C.S. §1730 - Pre-Audit Claims
  CLAIM_PREAUDIT: () => {
    const recipe = new Recipe('R-1730', '16 Pa.C.S. §1730', RecipeType.MASTER);

    const claimProc = new Procedure('P-CLAIM', 'Claim Pre-Audit Procedure');
    const claimUp = new UnitProcedure('UP-CLAIMS', 'Claims Processing', 'controller');

    const validation = new Operation('OP-VALIDATE', 'Claim Validation');
    validation.addPhase(new Phase('PH-AUTH', 'Verify Authorization', null));
    validation.addPhase(new Phase('PH-BUDGET', 'Check Budget Availability', null));
    validation.addPhase(new Phase('PH-DUP', 'Duplicate Detection', null));
    validation.addPhase(new Phase('PH-APPROVE', 'Controller Approval', null));

    claimUp.addOperation(validation);
    claimProc.addUnitProcedure(claimUp);
    recipe.addProcedure(claimProc);

    return recipe;
  },

  // 16 Pa.C.S. §1602 - System of Accounts
  ACCOUNT_SYSTEM: () => {
    const recipe = new Recipe('R-1602', '16 Pa.C.S. §1602', RecipeType.MASTER);

    const setupProc = new Procedure('P-SETUP', 'Account System Setup');
    const setupUp = new UnitProcedure('UP-CHART', 'Chart of Accounts', 'controller');

    const chartOp = new Operation('OP-CHART', 'Define Chart of Accounts');
    chartOp.addPhase(new Phase('PH-FUND', 'Define Fund Structure', null));
    chartOp.addPhase(new Phase('PH-DEPT', 'Define Departments', null));
    chartOp.addPhase(new Phase('PH-OBJ', 'Define Object Codes', null));
    chartOp.addPhase(new Phase('PH-PROJ', 'Define Project Codes', null));

    setupUp.addOperation(chartOp);
    setupProc.addUnitProcedure(setupUp);
    recipe.addProcedure(setupProc);

    return recipe;
  },
};

module.exports = {
  Recipe,
  Procedure,
  UnitProcedure,
  Operation,
  Phase,
  RecipeType,
  RecipeStatus,
  LegalRecipes,
};
