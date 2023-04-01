import createAPIGatewayProxyHandler from "~/package/backend/createAPIGatewayProxyHandler.server";
import puppeteer from "puppeteer";

export const logic = async ({ method }: { method: string }) => {
  // visit fanduel.com
  // click on sportsbook
  // query all related elements. HTML:
  //   <a
  //   href="/baseball/mlb/san-francisco-giants-@-new-york-yankees-32221751"
  //   title="San Francisco Giants @ New York Yankees"
  //   class="v z bh y av aw t fz h bv"
  //   target="_self"
  //   style="cursor: pointer"
  //   ><div class="v z x y av aw t h">
  //     <div class="v w ae y av aw t h">
  //       <div class="v z bh y gi av aw t gj h">
  //         <div class="v w x am t h gk">
  //           <div
  //             style="
  //               background-image: url('https://assets.sportsbook.fanduel.com/images/team/mlb/san_francisco_giants.png');
  //               background-repeat: no-repeat;
  //               background-position: center center;
  //               background-size: contain;
  //               height: 28px;
  //               width: 28px;
  //               margin-right: 4px;
  //             "
  //           >
  //             <img
  //               src="https://assets.sportsbook.fanduel.com/images/team/mlb/san_francisco_giants.png"
  //               alt="SF Giants Logo"
  //               style="display: none"
  //             />
  //           </div>
  //           <div class="v z x y av aw t h">
  //             <span
  //               aria-label="San Francisco Giants"
  //               class="s t gl gm gn go fk fl fm ga gp h cy ds gq cs"
  //               >SF Giants</span
  //             ><span class="t gr h cq dp gq cs">L Webb</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  //   <div class="v w bh am gs t er h gt">
  //     <svg
  //       id="atSymbol_svg___x40__1_"
  //       x="0"
  //       y="0"
  //       width="15"
  //       height="15"
  //       viewBox="0 0 11.502 11.864"
  //       xml:space="preserve"
  //       aria-label="at"
  //       style="flex-shrink: 0"
  //     >
  //       <path
  //         id="atSymbol_svg___x40_"
  //         fill="#B9C4CB"
  //         d="M8.39 8.554c-.971 0-1.483-.492-1.579-.95h-.068c-.116.444-.697.95-1.504.95-1.142 0-1.791-.909-1.791-2.242v-.629c0-1.306.663-2.215 1.853-2.215.786 0 1.23.485 1.354.875h.055v-.779h.99v3.343c0 .54.362.813.827.813.67 0 1.278-.725 1.278-2.331V5.15c0-1.989-1.449-3.767-4.026-3.767h-.055c-2.406 0-4.245 1.688-4.245 4.423v.314c0 2.912 1.928 4.313 4.204 4.313h.062c1.025 0 1.716-.13 2.201-.342v.882c-.376.178-1.121.328-2.215.328H5.67C2.819 11.301.502 9.585.502 6.16v-.395c0-3.206 2.229-5.25 5.223-5.25h.055c3.227 0 4.977 2.229 4.977 4.601v.349c-.001 1.879-1 3.089-2.367 3.089zM4.48 6.176c0 1.06.458 1.483 1.101 1.483s1.101-.41 1.101-1.429v-.547c0-.902-.492-1.381-1.114-1.381-.608 0-1.087.458-1.087 1.449v.425z"
  //       ></path>
  //     </svg>
  //     <div class="v w x y av aw t er al h"></div>
  //   </div>
  //   <div class="v z x y av aw t h">
  //     <div class="v w ae y av aw t h">
  //       <div class="v z bh y gi av aw t gj h">
  //         <div class="v w x am t h gk">
  //           <div
  //             style="
  //               background-image: url('https://assets.sportsbook.fanduel.com/images/team/mlb/new_york_yankees.png');
  //               background-repeat: no-repeat;
  //               background-position: center center;
  //               background-size: contain;
  //               height: 28px;
  //               width: 28px;
  //               margin-right: 4px;
  //             "
  //           >
  //             <img
  //               src="https://assets.sportsbook.fanduel.com/images/team/mlb/new_york_yankees.png"
  //               alt="NY Yankees Logo"
  //               style="display: none"
  //             />
  //           </div>
  //           <div class="v z x y av aw t h">
  //             <span
  //               aria-label="New York Yankees"
  //               class="s t gl gm gn go fk fl fm ga gp h cy ds gq cs"
  //               >NY Yankees</span
  //             ><span class="t gr h cq dp gq cs">G Cole</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div></a>
  //
  // https://sportsbook.fanduel.com/navigation/mlb
  // GRR THEY ARE BLOCKING AUTOMATION
  if (method === "SETUP") {
    const browser = await puppeteer.launch({
      // executablePath: "/usr/bin/google-chrome-stable",
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto("https://sportsbook.fanduel.com/navigation/mlb", {
      waitUntil: "networkidle0",
    });
    console.log(await page.$eval("body", (b) => b.innerHTML));
    const elements = await page.$$eval(
      `a[href*="/baseball/mlb"]`,
      (elements) => elements
    );
    console.log(elements);
    const events = elements
      .filter((el) => {
        return !el.innerHTML.includes("More wagers");
      })
      .map((el) =>
        Array.from(
          el.querySelectorAll<HTMLSpanElement>(`span[aria-label*=" "]`)
        ).map((s) => s.innerText)
      )
      .map(([away, home]) => ({
        home,
        away,
      }));
    return {
      events,
    };
  }
  throw new Error(`Unknown method: ${method}`);
};

export const handler = createAPIGatewayProxyHandler(logic);
