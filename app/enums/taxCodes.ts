const CODES = [
  { id: 1520, label: "Computer & Office Equipment" },
  { id: 3000, label: "Owner's Capital" },
  { id: 3110, label: "Owner's Investment" },
  { id: 3120, label: "Owner's Draw" },
  { id: 4300, label: "Service" },
  { id: 4400, label: "Markup on Reimbursable Expenses" },
  { id: 4715, label: "Other Income" },
  { id: 5300, label: "Subcontractors" },
  { id: 6110, label: "Automobile Expense" },
  { id: 6140, label: "Business License & Fees" },
  { id: 6155, label: "Dues & Subscriptions" },
  { id: 6320, label: "Insurance" },
  { id: 6680, label: "Wages & Salaries" },
] as const;

export const taxCodeByLabel = Object.fromEntries(
  CODES.map((c) => [c.label, c.id])
) as Record<typeof CODES[number]["label"], typeof CODES[number]["id"]>;

export default CODES;
