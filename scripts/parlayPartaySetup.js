// https://sportsbook.fanduel.com/navigation/mlb

const gather = () => {
  const SYMBOLS = {
    "New York Mets": "NYM",
    "San Francisco Giants": "SFG",
    "Chicago Cubs": "CHC",
    "Minnesota Twins": "MIN",
    "Philadelphia Phillies": "PHI",
    "Tampa Bay Rays": "TBR",
    "Pittsburgh Pirates": "PIT",
    "Toronto Blue Jays": "TOR",
    "Atlanta Braves": "ATL",
    "Baltimore Orioles": "BAL",
    "Detroit Tigers": "DET",
    "Arizona Diamondbacks": "ARI",
    "Cleveland Guardians": "CLE",
    "Los Angeles Angels": "LAA",
    "Colorado Rockies": "COL",
    "Milwaukee Brewers": "MIL",
    "Chicago White Sox": "CHW",
    "Cincinnati Reds": "CIN",
    "Miami Marlins": "MIA",
    "New York Yankees": "NYY",
    "Washington Nationals": "WAS",
    "Boston Red Sox": "BOS",
    "Kansas City Royals": "KCR",
    "St. Louis Cardinals": "STL",
    "Texas Rangers": "TEX",
    "Houston Astros": "HOU",
    "San Diego Padres": "SDP",
    "Oakland Athletics": "OAK",
    "Seattle Mariners": "SEA",
    "Los Angeles Dodgers": "LAD",
  };
  setTimeout(async () => {
    const events = Array.from(
      document.querySelectorAll(`a[href*="/baseball/mlb"]`)
    )
      .filter((el) => {
        return !el.innerHTML.includes("More wagers");
      })
      .map((el) => {
        const [away, home] = Array.from(
          el.querySelectorAll(`span[aria-label*=" "]`)
        ).map((s) => s.innerText);
        const spreadEl = el.nextElementSibling.querySelectorAll(
          `div[aria-label*="Run Line"]`
        )[1];
        const spread = spreadEl
          .getAttribute("aria-label")
          .match(/Run Line, ([-.\d]+),/)?.[1];
        const [awayMl, homeMl] = Array.from(
          el.nextElementSibling.querySelectorAll(`div[aria-label*="Moneyline"]`)
        )
          .map((ml) =>
            Number(
              ml.getAttribute("aria-label").match(/Moneyline, ([+-.\d]+)$/)?.[1]
            )
          )
          .map((ml) => (ml > 0 ? 100 / (100 + ml) : -ml / (100 - ml)));
        const weight = (homeMl / (awayMl + homeMl)).toFixed(2);
        return `${SYMBOLS[away]}\t${SYMBOLS[home]}\t${spread}\t${weight}`;
      })
      .join("\n");
    window.navigator.clipboard.writeText(
      `${events}\n\t\t\tWager\n\t\t\tOutput\n\t\t\tRecord`
    );
    console.log("done!");
  }, 5000);
};

const evaluateOdds = () => {
  const SYMBOLS = {
    "New York Mets": "NYM",
    "San Francisco Giants": "SFG",
    "Chicago Cubs": "CHC",
    "Minnesota Twins": "MIN",
    "Philadelphia Phillies": "PHI",
    "Tampa Bay Rays": "TBR",
    "Pittsburgh Pirates": "PIT",
    "Toronto Blue Jays": "TOR",
    "Atlanta Braves": "ATL",
    "Baltimore Orioles": "BAL",
    "Detroit Tigers": "DET",
    "Arizona Diamondbacks": "ARI",
    "Cleveland Guardians": "CLE",
    "Los Angeles Angels": "LAA",
    "Colorado Rockies": "COL",
    "Milwaukee Brewers": "MIL",
    "Chicago White Sox": "CHW",
    "Cincinnati Reds": "CIN",
    "Miami Marlins": "MIA",
    "New York Yankees": "NYY",
    "Washington Nationals": "WAS",
    "Boston Red Sox": "BOS",
    "Kansas City Royals": "KCR",
    "St. Louis Cardinals": "STL",
    "Texas Rangers": "TEX",
    "Houston Astros": "HOU",
    "San Diego Padres": "SDP",
    "Oakland Athletics": "OAK",
    "Seattle Mariners": "SEA",
    "Los Angeles Dodgers": "LAD",
  };
  const NAMES = Object.fromEntries(
    Object.entries(SYMBOLS).map(([k, v]) => [v, k])
  );
  setTimeout(async () => {
    const picks = await window.navigator.clipboard.readText();
    const rows = picks.split("\n");
    const header = rows[0].split("\t");
    const parlays = header.map(() => []);
    rows.slice(1).forEach((row) => {
      const cells = row.split("\t");
      cells.forEach((cell, i) => {
        parlays[i].push(cell);
      });
    });
    const events = Array.from(
      document.querySelectorAll(`a[href*="/baseball/mlb"]`)
    ).filter((el) => {
      return !el.innerHTML.includes("More wagers");
    });
    const outputs = await parlays
      .map((parlay) => async () => {
        parlay.forEach((pick, i) => {
          if (pick) {
            const el = events[i];
            const name = NAMES[pick];
            el.nextElementSibling
              .querySelector(`div[aria-label*="${name}, Run Line"]`)
              .click();
          }
        });
        const selected = document.querySelectorAll(
          `div[aria-label*=" Selected"]`
        );
        await new Promise((r) => setTimeout(r, 1500));
        const output = Number(
          selected.length > 1
            ? document
                .getElementById("root")
                .innerText.match(/Leg Parlay\n\+(\d*)\n/s)[1]
            : selected[0]
                .getAttribute("aria-label")
                .match(/, ([+-.\d]+) Selected$/)[1]
        );
        selected.forEach((e) => e.click());
        return `$${((output > 0 ? output / 100 : 100 / -output) + 1).toFixed(
          2
        )}`;
      })
      .reduce(
        (p, c) => p.then((a) => c().then((b) => [...a, b])),
        Promise.resolve([])
      );
    const out = outputs.join("\t");
    window.navigator.clipboard.writeText(out);
    console.log("done!");
  }, 5000);
};
