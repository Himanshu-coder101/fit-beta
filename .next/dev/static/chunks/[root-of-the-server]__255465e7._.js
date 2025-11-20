(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/components/Navbar.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Navbar() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("light");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const saved = localStorage.getItem("ft_theme");
            if (saved) {
                setTheme(saved);
                document.documentElement.classList.toggle("dark", saved === "dark");
            } else {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                setTheme(prefersDark ? "dark" : "light");
                document.documentElement.classList.toggle("dark", prefersDark);
            }
        }
    }["Navbar.useEffect"], []);
    function toggleTheme() {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("ft_theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "w-full px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-white/40 dark:bg-black/30 border-b border-white/20 dark:border-white/10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-10 h-10 rounded-xl bg-gradient-to-br from-ft-blue to-ft-teal flex items-center justify-center text-white font-bold shadow-xl",
                        children: "FT"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-xl tracking-wide",
                        children: "FitTrack Pro"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Navbar.js",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:flex items-center gap-6 text-sm font-medium",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        className: `hover:text-ft-blue transition ${router.pathname === "/dashboard" ? "text-ft-blue" : ""}`,
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/weekly-plan",
                        className: `hover:text-ft-blue transition ${router.pathname === "/weekly-plan" ? "text-ft-blue" : ""}`,
                        children: "Plan"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/onboard/goal",
                        className: "btn-primary",
                        children: "New Plan"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleTheme,
                        className: "small-btn",
                        children: theme === "dark" ? "🌙" : "☀️"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Navbar.js",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Navbar.js",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(Navbar, "Tu3mh+8rMF9coVt5MltchhZpbnk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/BottomNav.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BottomNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function BottomNav() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const navItems = [
        {
            href: "/dashboard",
            label: "Home",
            icon: "🏠"
        },
        {
            href: "/day/1",
            label: "Today",
            icon: "🔥"
        },
        {
            href: "/weekly-plan",
            label: "Plan",
            icon: "📅"
        },
        {
            href: "/feedback-log",
            label: "Logs",
            icon: "📝"
        },
        {
            href: "/profile",
            label: "Profile",
            icon: "👤"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bottom-nav md:hidden",
        children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: item.href,
                className: `flex flex-col items-center text-xs ${router.pathname === item.href ? "text-ft-blue font-semibold" : "text-slate-600 dark:text-slate-300"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg",
                        children: item.icon
                    }, void 0, false, {
                        fileName: "[project]/components/BottomNav.js",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/components/BottomNav.js",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this)
                ]
            }, item.href, true, {
                fileName: "[project]/components/BottomNav.js",
                lineNumber: 18,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/BottomNav.js",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(BottomNav, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BottomNav;
var _c;
__turbopack_context__.k.register(_c, "BottomNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Card.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Card({ title, children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `card ${className}`,
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold mb-3",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/Card.js",
                lineNumber: 4,
                columnNumber: 17
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/Card.js",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Tooltip.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Tooltip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Tooltip({ label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group relative inline-block",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "cursor-pointer px-1 text-slate-400 hover:text-slate-200",
                children: "ⓘ"
            }, void 0, false, {
                fileName: "[project]/components/Tooltip.js",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute hidden group-hover:block z-30 w-52 p-2 text-sm rounded-lg bg-slate-900 text-white border border-slate-700 shadow-lg -right-2 top-6",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/Tooltip.js",
                lineNumber: 5,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Tooltip.js",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Tooltip;
var _c;
__turbopack_context__.k.register(_c, "Tooltip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/feedback.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/feedback.js
// client-safe localStorage helper to save session feedback and summarize it
__turbopack_context__.s([
    "getAllFeedback",
    ()=>getAllFeedback,
    "saveSessionFeedback",
    ()=>saveSessionFeedback,
    "summarizeFeedback",
    ()=>summarizeFeedback
]);
const KEY = 'ft_feedback_v1';
function saveSessionFeedback(feedback) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    feedback.date = new Date().toISOString();
    arr.unshift(feedback);
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 500)));
}
function getAllFeedback() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
}
function summarizeFeedback({ lastN = 28 } = {}) {
    const all = getAllFeedback();
    if (!all.length) return null;
    const slice = all.slice(0, lastN);
    const summary = {
        total: slice.length,
        difficulty: {
            Easy: 0,
            Moderate: 0,
            Hard: 0
        },
        soreness: {
            None: 0,
            Mild: 0,
            High: 0
        },
        missedRepsCount: 0,
        recentDates: slice.map((s)=>s.date)
    };
    for (const f of slice){
        if (f.difficulty && summary.difficulty[f.difficulty] !== undefined) summary.difficulty[f.difficulty]++;
        if (f.soreness && summary.soreness[f.soreness] !== undefined) summary.soreness[f.soreness]++;
        if (f.missedReps) summary.missedRepsCount++;
    }
    return summary;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/weights.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/weights.js
// Simple localStorage-backed per-exercise weight tracker.
// Keyed by exercise name (string). Values stored as { weight: number, unit: 'kg'|'lb', updatedAt: ISOString }
__turbopack_context__.s([
    "getAllWeights",
    ()=>getAllWeights,
    "getExerciseWeight",
    ()=>getExerciseWeight,
    "removeExerciseWeight",
    ()=>removeExerciseWeight,
    "setExerciseWeight",
    ()=>setExerciseWeight
]);
const KEY = 'ft_ex_weights_v1';
/** read whole store */ function readStore() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}
/** write whole store */ function writeStore(obj) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem(KEY, JSON.stringify(obj));
}
function getExerciseWeight(exerciseName) {
    if (!exerciseName || ("TURBOPACK compile-time value", "object") === 'undefined') return null;
    const store = readStore();
    return store[exerciseName] || null;
}
function setExerciseWeight(exerciseName, weight, unit = 'kg') {
    if (!exerciseName || ("TURBOPACK compile-time value", "object") === 'undefined') return null;
    const store = readStore();
    store[exerciseName] = {
        weight: Number(weight) || 0,
        unit: unit || 'kg',
        updatedAt: new Date().toISOString()
    };
    writeStore(store);
    return store[exerciseName];
}
function removeExerciseWeight(exerciseName) {
    if (!exerciseName || ("TURBOPACK compile-time value", "object") === 'undefined') return;
    const store = readStore();
    delete store[exerciseName];
    writeStore(store);
}
function getAllWeights() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return readStore();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/planGenerator.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/planGenerator.js
// Professional plan generator (auto-pick split based on profile by default)
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "generateProfessionalPlan",
    ()=>generateProfessionalPlan,
    "getAlternatives",
    ()=>getAlternatives
]);
const EXERCISE_POOLS = {
    gym: {
        push: [
            {
                name: 'Barbell Bench Press',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Incline Dumbbell Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Machine Chest Press',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Standing Overhead Press',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Dumbbell Lateral Raise',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Cable Triceps Pushdown',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Dips (Assisted/Weighted)',
                equipment: [
                    'bodyweight'
                ]
            }
        ],
        pull: [
            {
                name: 'Pull-ups / Assisted Pull-ups',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Barbell Row',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Seated Cable Row',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Lat Pulldown',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Face Pull',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'EZ-Bar Curl',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Hammer Curl',
                equipment: [
                    'dumbbell'
                ]
            }
        ],
        legs: [
            {
                name: 'Back Squat',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Romanian Deadlift',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Leg Press',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Walking Lunges',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Leg Curl',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Standing Calf Raise',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Goblet Squat',
                equipment: [
                    'dumbbell'
                ]
            }
        ],
        upper: [
            {
                name: 'Incline Dumbbell Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Barbell Row',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Overhead Press',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Lat Pulldown',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Lateral Raise',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Cable Row',
                equipment: [
                    'machine'
                ]
            }
        ],
        lower: [
            {
                name: 'Front Squat',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Deadlift (Conventional or Trap)',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Leg Press',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Hamstring Curl',
                equipment: [
                    'machine'
                ]
            },
            {
                name: 'Bulgarian Split Squat',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Calf Raise',
                equipment: [
                    'machine'
                ]
            }
        ],
        full: [
            {
                name: 'Deadlift',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Bench Press',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Barbell Row',
                equipment: [
                    'barbell'
                ]
            },
            {
                name: 'Goblet Squat',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Hanging Knee Raise',
                equipment: [
                    'bodyweight'
                ]
            }
        ]
    },
    dumbbell: {
        push: [
            {
                name: 'Dumbbell Bench Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Incline Dumbbell Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Seated Dumbbell Overhead Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Dumbbell Lateral Raise',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Overhead Triceps Extension',
                equipment: [
                    'dumbbell'
                ]
            }
        ],
        pull: [
            {
                name: 'One-arm Dumbbell Row',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Dumbbell Romanian Deadlift',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Seated Dumbbell Curl',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Incline Dumbbell Row',
                equipment: [
                    'dumbbell'
                ]
            }
        ],
        legs: [
            {
                name: 'Dumbbell Goblet Squat',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Dumbbell Reverse Lunge',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Dumbbell Romanian Deadlift',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Single-leg Calf Raise (bodyweight)',
                equipment: [
                    'bodyweight'
                ]
            }
        ],
        upper: [
            {
                name: 'Dumbbell Bench Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'One-arm DB Row',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Seated DB Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'DB Lateral Raise',
                equipment: [
                    'dumbbell'
                ]
            }
        ],
        lower: [
            {
                name: 'DB Goblet Squat',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'DB RDL',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'DB Reverse Lunge',
                equipment: [
                    'dumbbell'
                ]
            }
        ],
        full: [
            {
                name: 'Goblet Squat',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Dumbbell Bench Press',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'One-arm DB Row',
                equipment: [
                    'dumbbell'
                ]
            },
            {
                name: 'Dumbbell RDL',
                equipment: [
                    'dumbbell'
                ]
            }
        ]
    },
    body: {
        push: [
            {
                name: 'Push-ups (Knee/Full)',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Pike Push-ups',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Triceps Dips (Chair)',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Diamond Push-ups',
                equipment: [
                    'bodyweight'
                ]
            }
        ],
        pull: [
            {
                name: 'Inverted Row (table/low bar)',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Band Pull Apart (if band)',
                equipment: [
                    'bands',
                    'bodyweight'
                ]
            },
            {
                name: 'Doorway Row',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Assisted/Negative Pull-up',
                equipment: [
                    'bodyweight'
                ]
            }
        ],
        legs: [
            {
                name: 'Bodyweight Squat',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Walking Lunges',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Single-leg Romanian Deadlift (bodyweight or light DB)',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Glute Bridge',
                equipment: [
                    'bodyweight'
                ]
            }
        ],
        upper: [
            {
                name: 'Push-ups',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Inverted Row',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Pike Push-ups',
                equipment: [
                    'bodyweight'
                ]
            }
        ],
        lower: [
            {
                name: 'Squat Variation',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Glute Bridge',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Walking Lunge',
                equipment: [
                    'bodyweight'
                ]
            }
        ],
        full: [
            {
                name: 'Bodyweight Squat',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Push-ups',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Inverted Row',
                equipment: [
                    'bodyweight'
                ]
            },
            {
                name: 'Glute Bridge',
                equipment: [
                    'bodyweight'
                ]
            }
        ]
    }
};
// Helper utilities
function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}
// Determine default split based on experience & days
function autoPickSplit(experience, days) {
    if (experience === 'beginner') {
        if (days <= 3) return {
            type: 'full',
            pattern: Array(days).fill('Full')
        };
        if (days === 4) return {
            type: 'upperlower',
            pattern: [
                'Upper',
                'Lower',
                'Upper',
                'Lower'
            ]
        };
        return {
            type: 'upperlower',
            pattern: Array(days).fill('Upper').map((_, i)=>i % 2 ? 'Lower' : 'Upper').slice(0, days)
        };
    }
    if (experience === 'intermediate') {
        if (days <= 3) return {
            type: 'ppl',
            pattern: [
                'Push',
                'Pull',
                'Legs'
            ].slice(0, days)
        };
        if (days === 4) return {
            type: 'upperlower',
            pattern: [
                'Upper',
                'Lower',
                'Upper',
                'Lower'
            ]
        };
        if (days === 5) return {
            type: 'ppl',
            pattern: [
                'Push',
                'Pull',
                'Legs',
                'Upper',
                'Lower'
            ].slice(0, 5)
        };
        return {
            type: 'ppl',
            pattern: [
                'Push',
                'Pull',
                'Legs',
                'Upper',
                'Lower',
                'Push',
                'Pull'
            ].slice(0, days)
        };
    }
    if (experience === 'advanced') {
        if (days <= 3) return {
            type: 'ppl',
            pattern: [
                'Push',
                'Pull',
                'Legs'
            ].slice(0, days)
        };
        if (days === 4) return {
            type: 'upperlower',
            pattern: [
                'Upper',
                'Lower',
                'Upper',
                'Lower'
            ]
        };
        if (days === 5) return {
            type: 'ppl',
            pattern: [
                'Push',
                'Pull',
                'Legs',
                'Upper',
                'Lower'
            ].slice(0, 5)
        };
        const full = [
            'Push',
            'Pull',
            'Legs',
            'Push',
            'Pull',
            'Legs'
        ];
        return {
            type: 'ppl',
            pattern: full.slice(0, days)
        };
    }
    return {
        type: 'full',
        pattern: Array(days).fill('Full')
    };
}
// convert equipment flags into primary pool keys: 'gym' | 'dumbbell' | 'body'
function pickPoolKey(equipment = []) {
    const eq = new Set(equipment || []);
    if (eq.has('barbell') || eq.has('machine')) return 'gym';
    if (eq.has('dumbbell') || eq.has('bands')) return 'dumbbell';
    return 'body';
}
// Repetition scheme by experience & goal & exercise type
function schemeFor(exType, experience, goal) {
    let sets = experience === 'beginner' ? 3 : experience === 'intermediate' ? 3 : 4;
    let reps = 8;
    let intensity = 70;
    let rest = 90;
    let rir = 2;
    if (goal && goal.toLowerCase().includes('strength')) {
        reps = experience === 'beginner' ? 5 : experience === 'intermediate' ? 5 : 3;
        intensity = experience === 'beginner' ? 75 : experience === 'intermediate' ? 80 : 85;
        rir = 1;
        rest = 120;
    } else if (goal && goal.toLowerCase().includes('fat')) {
        reps = 10;
        intensity = 65;
        rest = 60;
        sets = Math.max(3, Math.round(sets));
        rir = 2;
    } else if (goal && (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('hypertrophy'))) {
        reps = experience === 'beginner' ? 8 : experience === 'intermediate' ? 8 : 6;
        intensity = experience === 'beginner' ? 65 : experience === 'intermediate' ? 72 : 78;
        rest = 75;
        rir = 1;
    } else {
        reps = experience === 'beginner' ? 8 : experience === 'intermediate' ? 8 : 6;
        intensity = experience === 'beginner' ? 65 : experience === 'intermediate' ? 72 : 78;
        rest = 75;
        rir = 2;
    }
    if (exType === 'compound') {
        sets = Math.max(3, sets);
        rest = Math.max(75, rest);
        rir = Math.max(1, rir - 1);
    } else if (exType === 'accessory') {
        sets = 3;
        reps = Math.min(12, Math.max(8, reps + 2));
        rir = Math.max(1, rir + 1);
        rest = Math.min(90, rest);
    }
    return {
        sets,
        reps,
        intensity_pct: intensity,
        rest_sec: rest,
        rir
    };
}
// Tag exercises as 'compound' or 'accessory' heuristically
function tagExerciseRole(name) {
    const lower = name.toLowerCase();
    if (lower.includes('squat') || lower.includes('deadlift') || lower.includes('bench') || lower.includes('press') || lower.includes('row') || lower.includes('pull')) {
        return 'compound';
    }
    return 'accessory';
}
// Generate session exercises by slotting compounds first then accessories
function buildSession(poolKey, sessionType, experience, goal, sessionTimeMins) {
    const pool = EXERCISE_POOLS[poolKey] && EXERCISE_POOLS[poolKey][sessionType.toLowerCase()];
    if (!pool || pool.length === 0) return [];
    let desired = sessionTimeMins <= 30 ? 3 : sessionTimeMins <= 45 ? 5 : 6;
    desired = clamp(desired, 3, 8);
    const compounds = pool.filter((e)=>tagExerciseRole(e.name) === 'compound');
    const accessories = pool.filter((e)=>tagExerciseRole(e.name) === 'accessory');
    const chosen = [];
    for (let ex of compounds){
        if (chosen.length >= desired) break;
        chosen.push(ex);
        if (chosen.length >= 2 && desired <= 4) break;
    }
    for (let ex of accessories){
        if (chosen.length >= desired) break;
        if (!chosen.find((c)=>c.name === ex.name)) chosen.push(ex);
    }
    let idx = 0;
    while(chosen.length < desired && pool.length){
        const cand = pool[idx % pool.length];
        if (!chosen.find((c)=>c.name === cand.name)) chosen.push(cand);
        idx++;
        if (idx > pool.length * 2) break;
    }
    const resulting = chosen.map((ex)=>{
        const role = tagExerciseRole(ex.name);
        const scheme = schemeFor(role, experience, goal);
        return {
            name: ex.name,
            equipment: ex.equipment,
            sets: scheme.sets,
            reps: scheme.reps,
            intensity_pct: scheme.intensity_pct,
            rest_sec: scheme.rest_sec,
            rir: scheme.rir,
            notes: role === 'compound' ? 'Main compound. Focus on form & progressive overload.' : 'Accessory: control tempo and full range of motion.'
        };
    });
    return resulting;
}
function generateProfessionalPlan(profile = {}) {
    const p = {
        goal: profile.goal || 'General Fitness',
        experience: profile.experience || 'beginner',
        daysPerWeek: Number(profile.daysPerWeek) || 3,
        timePerSession: Number(profile.timePerSession) || 40,
        equipment: profile.equipment || [
            'bodyweight'
        ],
        style: profile.style || 'balanced',
        adaptationStyle: profile.adaptationStyle || 'moderate'
    };
    const poolKey = pickPoolKey(p.equipment);
    let splitInfo;
    if (p.style && [
        'ppl',
        'push/pull/legs',
        'push',
        'pull',
        'legs',
        'upper',
        'lower',
        'full'
    ].includes(String(p.style).toLowerCase())) {
        const s = String(p.style).toLowerCase();
        if (s.includes('ppl') || s.includes('push')) {
            const base = [
                'Push',
                'Pull',
                'Legs'
            ];
            const pattern = [];
            for(let i = 0; i < p.daysPerWeek; i++)pattern.push(base[i % base.length]);
            splitInfo = {
                type: 'ppl',
                pattern
            };
        } else if (s.includes('upper')) {
            const pattern = [];
            for(let i = 0; i < p.daysPerWeek; i++)pattern.push(i % 2 === 0 ? 'Upper' : 'Lower');
            splitInfo = {
                type: 'upperlower',
                pattern
            };
        } else if (s.includes('full')) {
            splitInfo = {
                type: 'full',
                pattern: Array(p.daysPerWeek).fill('Full')
            };
        } else {
            splitInfo = autoPickSplit(p.experience, p.daysPerWeek);
        }
    } else {
        splitInfo = autoPickSplit(p.experience, p.daysPerWeek);
    }
    const sessions = [];
    for(let i = 0; i < p.daysPerWeek; i++){
        const sessionType = splitInfo.pattern[i] || splitInfo.pattern[i % splitInfo.pattern.length] || 'Full';
        let poolSessionKey = sessionType.toLowerCase();
        if (!EXERCISE_POOLS[poolKey][poolSessionKey]) {
            if (sessionType.toLowerCase().includes('push')) poolSessionKey = 'push';
            else if (sessionType.toLowerCase().includes('pull')) poolSessionKey = 'pull';
            else if (sessionType.toLowerCase().includes('leg')) poolSessionKey = 'legs';
            else if (sessionType.toLowerCase().includes('full')) poolSessionKey = 'full';
            else poolSessionKey = 'full';
        }
        const exercises = buildSession(poolKey, poolSessionKey, p.experience, p.goal, p.timePerSession);
        sessions.push({
            day: `Day ${i + 1} - ${sessionType}`,
            exercises
        });
    }
    const recommendations = {
        protein_g_per_kg: p.goal && p.goal.toLowerCase().includes('muscle') ? 1.8 : 1.4,
        stepsPerDay: p.goal && p.goal.toLowerCase().includes('fat') ? 9000 : 7000,
        notes: 'This plan is a coach-like starting point. Log feedback to enable adaptive progression.'
    };
    const description = `${p.goal} program — ${p.experience} — ${p.daysPerWeek}x/week — ${splitInfo.type}`;
    return {
        generatedAt: new Date().toISOString(),
        profile: p,
        description,
        sessions,
        recommendations
    };
}
function getAlternatives(exName, poolKey = 'gym', count = 3) {
    try {
        const pools = EXERCISE_POOLS[poolKey] || EXERCISE_POOLS['body'];
        const all = [].concat(...Object.values(pools));
        const tokens = (exName || '').toLowerCase().split(/\W+/).filter(Boolean);
        const scored = all.filter((a)=>a.name !== exName).map((a)=>{
            const nameTokens = a.name.toLowerCase().split(/\W+/).filter(Boolean);
            let score = 0;
            for (const t of tokens)if (nameTokens.includes(t)) score++;
            return {
                ex: a,
                score
            };
        }).sort((a, b)=>b.score - a.score || a.ex.name.localeCompare(b.ex.name));
        const filtered = scored.length ? scored.map((s)=>s.ex) : all;
        return filtered.slice(0, count);
    } catch (e) {
        return [];
    }
}
const __TURBOPACK__default__export__ = generateProfessionalPlan;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/day/[day].js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DayPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Navbar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomNav.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Tooltip.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$feedback$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/feedback.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$weights$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/weights.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$planGenerator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/planGenerator.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
// Small icon helper based on exercise name
function getIconForExercise(name) {
    name = name.toLowerCase();
    if (name.includes("squat")) return "🦵";
    if (name.includes("dead")) return "🏋️‍♂️";
    if (name.includes("bench")) return "🏋️‍♀️";
    if (name.includes("press")) return "💪";
    if (name.includes("row")) return "🔄";
    if (name.includes("curl")) return "💪";
    if (name.includes("pull")) return "⬆️";
    if (name.includes("push")) return "➡️";
    if (name.includes("lunge")) return "🦿";
    if (name.includes("raise")) return "✨";
    return "🔥";
}
// Muscle group color accents
function getColorAccent(name) {
    name = name.toLowerCase();
    if (name.includes("squat") || name.includes("lunge")) return "bg-purple-500";
    if (name.includes("bench") || name.includes("press")) return "bg-red-500";
    if (name.includes("row") || name.includes("pull")) return "bg-blue-500";
    if (name.includes("curl") || name.includes("raise")) return "bg-yellow-500";
    return "bg-teal-500";
}
function DayPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { day } = router.query;
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Swap menu
    const [swapIndex, setSwapIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [alts, setAlts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DayPage.useEffect": ()=>{
            if (!day) return;
            fetch("/api/plan").then({
                "DayPage.useEffect": (r)=>r.json()
            }["DayPage.useEffect"]).then({
                "DayPage.useEffect": (plan)=>{
                    const index = Number(day) - 1;
                    const s = plan.sessions?.[index];
                    if (s) setSession(JSON.parse(JSON.stringify(s)));
                    setLoading(false);
                }
            }["DayPage.useEffect"]);
        }
    }["DayPage.useEffect"], [
        day
    ]);
    function saveWeight(name, inputEl) {
        if (!inputEl.value) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$weights$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setExerciseWeight"])(name, Number(inputEl.value), "kg");
        inputEl.classList.add("ring", "ring-ft-blue");
        setTimeout(()=>inputEl.classList.remove("ring", "ring-ft-blue"), 800);
    }
    function openSwap(i, ex) {
        const eq = ex.equipment?.[0] || "barbell";
        let pool = "gym";
        if (eq === "dumbbell" || eq === "bands") pool = "dumbbell";
        if (eq === "bodyweight") pool = "body";
        const alternatives = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$planGenerator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getAlternatives"])(ex.name, pool, 5);
        setSwapIndex(i);
        setAlts(alternatives);
    }
    function applySwap(i, newEx) {
        const updated = {
            ...session
        };
        updated.exercises[i] = {
            ...newEx,
            sets: session.exercises[i].sets,
            reps: session.exercises[i].reps,
            intensity_pct: session.exercises[i].intensity_pct,
            rest_sec: session.exercises[i].rest_sec,
            rir: session.exercises[i].rir,
            notes: newEx.notes || session.exercises[i].notes
        };
        setSession(updated);
        setSwapIndex(null);
        setAlts([]);
    }
    function submitFeedback(e) {
        e.preventDefault();
        const f = e.target;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$feedback$2e$js__$5b$client$5d$__$28$ecmascript$29$__["saveSessionFeedback"])({
            sessionIndex: Number(day) - 1,
            difficulty: f.difficulty.value,
            soreness: f.soreness.value,
            missedReps: f.missed.checked,
            notes: f.notes.value
        });
        alert("Feedback saved. Your plan will adapt.");
        f.reset();
    }
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/day/[day].js",
                lineNumber: 115,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Loading session…"
                }, void 0, false, {
                    fileName: "[project]/pages/day/[day].js",
                    lineNumber: 117,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/day/[day].js",
                lineNumber: 116,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
    if (!session) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/day/[day].js",
                lineNumber: 125,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500",
                    children: "Session not found."
                }, void 0, false, {
                    fileName: "[project]/pages/day/[day].js",
                    lineNumber: 127,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/day/[day].js",
                lineNumber: 126,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/day/[day].js",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/day/[day].js",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mb-24",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-3xl font-bold mt-4 mb-6",
                        children: session.day
                    }, void 0, false, {
                        fileName: "[project]/pages/day/[day].js",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-5",
                        children: session.exercises.map((ex, i)=>{
                            const savedWeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$weights$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getExerciseWeight"])(ex.name);
                            const savedDisplay = savedWeight ? `${savedWeight.weight}kg` : null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-3xl p-5 shadow-md bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/10 transition",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-3xl",
                                                        children: getIconForExercise(ex.name)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/day/[day].js",
                                                        lineNumber: 155,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-lg",
                                                                children: ex.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/day/[day].js",
                                                                lineNumber: 157,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-slate-600 dark:text-slate-300 text-sm",
                                                                children: ex.notes
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/day/[day].js",
                                                                lineNumber: 158,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/day/[day].js",
                                                        lineNumber: 156,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 154,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-3 h-3 rounded-full ${getColorAccent(ex.name)} shadow`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 164,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/day/[day].js",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2 mt-4 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-3 py-1 rounded-lg bg-slate-200 dark:bg-white/10",
                                                children: [
                                                    ex.sets,
                                                    " x ",
                                                    ex.reps
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 173,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-3 py-1 rounded-lg bg-blue-200 dark:bg-blue-900/30",
                                                children: [
                                                    ex.intensity_pct,
                                                    "% 1RM"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 177,
                                                columnNumber: 19
                                            }, this),
                                            ex.rir !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-3 py-1 rounded-lg bg-teal-200 dark:bg-teal-900/30",
                                                children: [
                                                    "RIR ",
                                                    ex.rir
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 182,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-3 py-1 rounded-lg bg-yellow-200 dark:bg-yellow-900/30",
                                                children: [
                                                    ex.rest_sec,
                                                    "s rest"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 187,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/day/[day].js",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 flex gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "Intensity relative to your estimated max"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 193,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "RIR = reps you leave before failure"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 194,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "Rest time between sets"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 195,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/day/[day].js",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: `w${i}`,
                                                placeholder: "kg",
                                                defaultValue: savedDisplay ? savedDisplay.replace("kg", "") : "",
                                                className: "px-3 py-2 rounded-xl w-32 bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 200,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "small-btn",
                                                onClick: ()=>saveWeight(ex.name, document.getElementById(`w${i}`)),
                                                children: "Save"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 208,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-slate-600 dark:text-slate-400",
                                                children: savedDisplay || "No saved weight"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 217,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/day/[day].js",
                                        lineNumber: 199,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "small-btn",
                                            onClick: ()=>openSwap(i, ex),
                                            children: "Swap Exercise"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 224,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/day/[day].js",
                                        lineNumber: 223,
                                        columnNumber: 17
                                    }, this),
                                    swapIndex === i && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 p-4 rounded-xl bg-slate-100 dark:bg-white/10 border border-white/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-semibold mb-2",
                                                children: "Choose alternative:"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 235,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid gap-2",
                                                children: alts.map((alt, ai)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "p-3 rounded-xl bg-white dark:bg-white/5 border border-white/20 text-left hover:bg-ft-blue/10",
                                                        onClick: ()=>applySwap(i, alt),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-semibold",
                                                                children: alt.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/day/[day].js",
                                                                lineNumber: 244,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs opacity-60",
                                                                children: (alt.equipment || []).join(", ")
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/day/[day].js",
                                                                lineNumber: 245,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, ai, true, {
                                                        fileName: "[project]/pages/day/[day].js",
                                                        lineNumber: 239,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 237,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSwapIndex(null),
                                                className: "mt-3 small-btn",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/day/[day].js",
                                                lineNumber: 252,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/day/[day].js",
                                        lineNumber: 234,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/pages/day/[day].js",
                                lineNumber: 148,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/pages/day/[day].js",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Session Feedback",
                        className: "mt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: submitFeedback,
                            className: "grid gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "font-semibold",
                                            children: "Difficulty"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            name: "difficulty",
                                            className: "mt-1 p-3 rounded-xl bg-white/60 dark:bg-white/10 w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Easy"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/day/[day].js",
                                                    lineNumber: 275,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Moderate"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/day/[day].js",
                                                    lineNumber: 276,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Hard"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/day/[day].js",
                                                    lineNumber: 277,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/day/[day].js",
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "font-semibold",
                                            children: "Soreness"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 282,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            name: "soreness",
                                            className: "mt-1 p-3 rounded-xl bg-white/60 dark:bg-white/10 w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "None"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/day/[day].js",
                                                    lineNumber: 287,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Mild"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/day/[day].js",
                                                    lineNumber: 288,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "High"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/day/[day].js",
                                                    lineNumber: 289,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/day/[day].js",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            name: "missed",
                                            id: "missed"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 294,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "missed",
                                            children: "Missed any reps?"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 295,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/day/[day].js",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "font-semibold",
                                            children: "Notes"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            name: "notes",
                                            className: "mt-1 p-3 rounded-xl bg-white/60 dark:bg-white/10 w-full",
                                            placeholder: "Fatigue, discomfort, performance notes…"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/day/[day].js",
                                            lineNumber: 300,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/day/[day].js",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn-primary w-full mt-2",
                                    children: "Save Feedback"
                                }, void 0, false, {
                                    fileName: "[project]/pages/day/[day].js",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/day/[day].js",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/day/[day].js",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/day/[day].js",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DayPage, "CSwZZJD4OKN2a2EcGQ1JdrvdwC4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DayPage;
var _c;
__turbopack_context__.k.register(_c, "DayPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/day/[day].js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/day/[day]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/day/[day].js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/day/[day].js\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/day/[day].js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__255465e7._.js.map