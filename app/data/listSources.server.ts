const listSources = async () => {
  return [
    {
      label: "Chase Credit",
      snapshot: `${process.env.API_URL}/snapshot?source=chase-credit`,
    },
    {
      label: "Venmo Credit",
      snapshot: `${process.env.API_URL}/snapshot?source=venmo-credit`,
    },
    {
      label: "Venmo Balance",
      snapshot: `${process.env.API_URL}/snapshot?source=venmo-balance`,
    },
    {
      label: "Citibank Checking",
      snapshot: `${process.env.API_URL}/snapshot?source=citi-checking`,
    },
    {
      label: "Mercury Checking",
      snapshot: `${process.env.API_URL}/snapshot?source=mercury-checking`,
    },
    {
      label: "Splitwise Balance",
      snapshot: `${process.env.API_URL}/snapshot?source=splitwise`,
    },
    {
      label: "Ethereum Wallet",
      snapshot: `${process.env.API_URL}/snapshot?source=ethereum-wallet`,
    },
    { label: "Robinhood", snapshot: `${process.env.API_URL}/snapshot?source=robinhood` },
    { label: "Fundrise", snapshot: `${process.env.API_URL}/snapshot?source=fundrise` },
    {
      label: "Fidelity 401K",
      snapshot: `${process.env.API_URL}/snapshot?source=fidelity`,
    },
    { label: "Catch IRA", snapshot: `${process.env.API_URL}/snapshot?source=catch` },
    { label: "Wefunder", snapshot: `${process.env.API_URL}/snapshot?source=wefunder` },
  ];
};

export default listSources;
