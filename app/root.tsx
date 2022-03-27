import RemixRoot, {
  getRootLinks,
  getRootMeta,
  RootCatchBoundary,
} from "@dvargas92495/ui/components/RemixRoot";
import remixRootLoader from "@dvargas92495/ui/utils/remixRootLoader.server";

export const loader = remixRootLoader;
export const meta = getRootMeta();
export const links = getRootLinks();
export const CatchBoundary = RootCatchBoundary;
export default RemixRoot;

// import React, { useMemo } from "react";
// import {
//   Links,
//   LiveReload,
//   Meta,
//   Outlet,
//   Scripts,
//   ScrollRestoration,
//   useLoaderData,
// } from "remix";
// import createTheme, { ThemeOptions } from "@mui/material/styles/createTheme";
// import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
// import CssBaseline from "@mui/material/CssBaseline";
// import GlobalStyles from "@mui/material/GlobalStyles";
// import { CacheProvider } from "@emotion/react";
// import getEmotionCache, {
//   emotionCache,
// } from "@dvargas92495/ui/utils/getEmotionCache";
// //const getRootLoader = ({  env = {},}: { env?: Record<string, string | undefined> } = {}): LoaderFunction => (  args) =>  rootAuthLoader(    args,    () => ({      ENV: {        API_URL: process.env.API_URL,        CLERK_FRONTEND_API: process.env.CLERK_FRONTEND_API,        HOST: process.env.HOST,       NODE_ENV: process.env.NODE_ENV,        STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,        ...env,      },}),    { loadUser: true });

// import { ClerkApp } from "@clerk/remix";
// const ThemeProvider: React.FC<ThemeOptions> = ({ children, ...options }) => {
//   const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           primary: {
//             main: "#3ba4dc",
//           },
//           secondary: {
//             main: "#f8a94a",
//           },
//           text: {
//             primary: "#333333",
//             secondary: "#888888",
//           },
//           divider: "#333333",
//           ...options.palette,
//         },
//         typography: {
//           fontFamily: ["Avenir Light", "sans-serif"].join(","),
//           h1: {
//             fontFamily: ["Century Gothic", "sans-serif"].join(","),
//             fontSize: "3rem",
//             fontWeight: 600,
//             margin: "3rem 0",
//           },
//           h2: {
//             fontFamily: ["Century Gothic", "sans-serif"].join(","),
//             fontWeight: 600,
//             fontSize: "2.5rem",
//             margin: "2.5rem 0",
//           },
//           h3: {
//             fontFamily: ["Century Gothic", "sans-serif"].join(","),
//             fontWeight: 600,
//             fontSize: "2rem",
//             margin: "2rem 0",
//           },
//           h4: {
//             fontFamily: ["Century Gothic", "sans-serif"].join(","),
//             fontWeight: 600,
//             fontSize: "1.75rem",
//             margin: "1.75rem 0",
//           },
//           h5: {
//             fontFamily: ["Century Gothic", "sans-serif"].join(","),
//             fontWeight: 600,
//             margin: "1.5rem 0",
//           },
//           h6: {
//             fontFamily: ["Century Gothic", "sans-serif"].join(","),
//             fontWeight: 600,
//             margin: "1.25rem 0",
//           },
//           subtitle1: {
//             fontSize: "1.25rem",
//             fontFamily: ["Century Gothic", "sans-serif"].join(","),
//           },
//           ...options.typography,
//         },
//         components: {
//           MuiBreadcrumbs: {
//             styleOverrides: {
//               root: {
//                 margin: 0,
//               },
//             },
//           },
//           MuiCardHeader: {
//             styleOverrides: {
//               subheader: {
//                 margin: 0,
//               },
//               title: {
//                 margin: 0,
//               },
//             },
//           },
//           MuiDialog: {
//             styleOverrides: {
//               paper: {
//                 minWidth: 400,
//               },
//             },
//           },
//           MuiDialogTitle: {
//             styleOverrides: {
//               root: {
//                 "& h2": {
//                   margin: 0,
//                 },
//               },
//             },
//           },
//           MuiFormControlLabel: {
//             styleOverrides: {
//               label: {
//                 margin: 0,
//               },
//             },
//           },
//           MuiInputBase: {
//             styleOverrides: {
//               root: {
//                 margin: 0,
//               },
//             },
//           },
//           MuiInputLabel: {
//             styleOverrides: {
//               root: {
//                 margin: 0,
//               },
//             },
//           },
//           MuiListItem: {
//             styleOverrides: {
//               root: {
//                 display: "list-item",
//                 fontSize: 16,
//                 "& .MuiTypography-root": {
//                   margin: 0,
//                 },
//               },
//             },
//           },
//           MuiListItemText: {
//             styleOverrides: {
//               primary: {
//                 margin: 0,
//               },
//             },
//           },
//           ...options.components,
//         },
//         ...options,
//       }),
//     []
//   );
//   const inputGlobalStyles = useMemo(
//     () =>
//       options.palette?.background?.default ? (
//         <GlobalStyles
//           styles={{
//             body: { background: options.palette?.background?.default },
//           }}
//         />
//       ) : null,
//     [options.palette?.background?.default]
//   );
//   return (
//     <MuiThemeProvider theme={theme}>
//       <CssBaseline />
//       {inputGlobalStyles}
//       {children}
//     </MuiThemeProvider>
//   );
// };

// type Props = { themeProps?: ThemeOptions };  

// export const loader = remixRootLoader;

// const App = ({ themeProps = {} }: Props) => {
//   const data = useLoaderData<{ ENV: Record<string, string> }>();
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width,initial-scale=1" />
//         <Meta />
//         <Links />
//         {typeof document === "undefined" ? "__STYLES__" : null}
//       </head>
//       <body>
//         ok
//         <CacheProvider
//           value={
//             typeof document === "undefined" ? emotionCache : getEmotionCache()
//           }
//         >
//           <ThemeProvider {...themeProps}>
//             <Outlet />
//           </ThemeProvider>
//         </CacheProvider>
//         <ScrollRestoration />
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `window.process = {
//   env: ${JSON.stringify(data?.ENV || {})}
// };`,
//           }}
//         />
//         <Scripts />
//         <LiveReload />
//       </body>
//     </html>
//   );
// };

// export default ClerkApp(() => <App />);
