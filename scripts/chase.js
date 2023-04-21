// SEE IF YOU CAN USE THEIR API INSTEAD OF THIS HACKY SOLUTION
const gather = async () => {
  const oldFetch = window.fetch;
  const DETAILS_REGEX =
    /card-transaction-details\?digital-account-identifier=(\d+)&transaction-post-date=(\d+)&transaction-post-time=(\d+)&transaction-identifier=(\d+)%23(\d+)$/;
  const transactions = [];
  window.fetch = async (...args) => {
    if (args[0].url && DETAILS_REGEX.test(args[0].url.toString())) {
      return oldFetch(...args).then(async (r) => {
        const response = r.clone();
        const payload = await response.json();
        transactions.push(payload.transactionDetails);
        return r;
      });
    }
    return oldFetch(...args);
  };
  const details = document.querySelectorAll("[id*='transactionDetailIcon']");
  await details
    .map((d, i) => async () => {
      d.click();
      const close = await new Promise((r) => {
        const timeout = setTimeout(() => {
          throw new Error("details timeout");
        }, 10000);
        const interval = setInterval(() => {
          const close = document.querySelector(`a.flyout-close`);
          if (close && transactions.length === i + 1) {
            clearInterval(interval);
            clearTimeout(timeout);
            r(close);
          }
        }, 100);
      });
      close.click();
      await new Promise((r) => setTimeout(r, 1000));
    })
    .reduce((p, c) => p.then(c), Promise.resolve());
  console.log(transactions);
  window.fetch = oldFetch;
};

// gather();
