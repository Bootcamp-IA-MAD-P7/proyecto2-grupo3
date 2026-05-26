import { importShared } from './__federation_fn_import-BWXi8Mgw.js';
import { j as jsxRuntimeExports } from './jsx-runtime-CyoIsdjr.js';
import { r as reactDomExports } from './index-D9Af7wOI.js';
import Taximetro, { c as createLucideIcon } from './__federation_expose_TaximetroWidget-l_F1SBTx.js';

var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}

function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "w-full bg-[#0B1120] border-t border-slate-800 py-6 px-6 md:px-10 relative overflow-hidden z-10 mt-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent opacity-30 blur-sm" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col md:flex-row justify-between items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center md:items-start text-center md:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black text-white text-base tracking-widest uppercase", children: "Taxímetro Digital" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs mt-1 font-medium", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Josué Díaz. Todos los derechos reservados."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-black text-xs tracking-wider shadow-[0_0_10px_rgba(255,90,0,0.3)] border border-[#FF7A33]", children: "FACTORÍA 5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold text-xs shadow-inner", children: "PROMOCIÓN 7" })
      ] })
    ] })
  ] });
}

const josueLogo = "/assets/josue-CsUKfdx0.jpg";

function Header() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 w-full bg-[#0B1120] border-b border-slate-800 py-4 px-6 md:px-10 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col md:flex-row items-center justify-between gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative p-[2px] rounded-xl bg-gradient-to-r from-cyan-400 to-purple-600 shadow-[0_0_15px_rgba(34,211,238,0.2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: josueLogo,
          alt: "Josué Díaz Logo",
          className: "w-14 h-14 object-cover rounded-[10px]"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-extrabold tracking-widest uppercase text-[10px] mb-0.5 block", children: "Software Engineer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-black text-white tracking-tight", children: "Josué Díaz" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg md:text-xl font-bold text-slate-200", children: [
        "Proyecto ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#FF5A00]", children: "Número 1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 inline-flex items-center gap-2 px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-2 w-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-cyan-500" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-300 font-medium tracking-wide", children: [
          "Micro Frontend:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: "Taxímetro" })
        ] })
      ] })
    ] })
  ] }) });
}

const {Outlet} = await importShared('react-router-dom');
function MainLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-grow flex items-center justify-center p-4 sm:p-8 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const AlertTriangle = createLucideIcon("AlertTriangle", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
      key: "c3ski4"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const ArrowLeft = createLucideIcon("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const HelpCircle = createLucideIcon("HelpCircle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);

/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const RefreshCcw = createLucideIcon("RefreshCcw", [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "14sxne" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16", key: "1hlbsb" }],
  ["path", { d: "M16 16h5v5", key: "ccwih5" }]
]);

const {isRouteErrorResponse,useNavigate: useNavigate$1,useRouteError} = await importShared('react-router-dom');

function GeneralError() {
  const error = useRouteError();
  const navigate = useNavigate$1();
  let errorMessage = "Ha ocurrido un error inesperado.";
  let errorTitle = "Error del Sistema";
  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || "Hubo un problema con la petición.";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-red-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm w-full bg-white p-8 text-center rounded-3xl shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex p-4 rounded-full bg-red-100 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-12 h-12 text-red-500" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-800 mb-2", children: errorTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm bg-slate-100 p-4 rounded-xl mb-8 text-slate-500 break-all", children: errorMessage }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-bold",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { size: 18 }),
            "Recargar"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate("/"),
          className: "flex items-center justify-center px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-bold",
          children: "Ir al Inicio"
        }
      )
    ] })
  ] }) });
}

const ROUTES = {
  APP: {
    MAIN: "/"
  }
};

const {useNavigate} = await importShared('react-router-dom');
function NotFoundPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-slate-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md animate-[bounce_3s_infinite]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HelpCircle, { className: "w-16 h-16 text-indigo-600" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-9xl font-black text-slate-200 leading-none -mt-4 mb-4", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-slate-800 mb-4", children: "Página no encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 mb-10 text-lg", children: "Lo sentimos, la ruta que intentas consultar no existe o no tienes permisos para verla." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => navigate(ROUTES.APP.MAIN),
        className: "inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-lg shadow-indigo-200",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 20 }),
          "Volver"
        ]
      }
    )
  ] }) });
}

const {createBrowserRouter} = await importShared('react-router-dom');
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: /* @__PURE__ */ jsxRuntimeExports.jsx(GeneralError, {}),
    children: [
      {
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(MainLayout, {}),
        children: [{ index: true, element: /* @__PURE__ */ jsxRuntimeExports.jsx(Taximetro, {}) }]
      },
      { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundPage, {}) }
    ]
  }
]);

const {QueryClient,QueryClientProvider} = await importShared('@tanstack/react-query');

const {StrictMode} = await importShared('react');
const {RouterProvider} = await importShared('react-router-dom');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router }) }) })
);
