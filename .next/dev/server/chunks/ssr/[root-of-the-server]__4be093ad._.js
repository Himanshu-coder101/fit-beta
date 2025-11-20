module.exports = [
"[project]/components/Navbar.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function Navbar() {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('light');
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem("ft_theme");
        if (saved) setTheme(saved);
        else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
        }
    }, []);
    const toggleTheme = ()=>{
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("ft_theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
        className: "w-full py-4 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-white/30 dark:bg-black/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-10 h-10 rounded-xl bg-gradient-to-br from-ft-blue to-ft-teal flex items-center justify-center text-white font-bold shadow",
                        children: "FT"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "font-semibold text-lg",
                        children: "FitTrack Pro"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Navbar.js",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        className: "px-3 py-2 rounded hover:bg-slate-200/50 dark:hover:bg-white/10",
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/weekly-plan",
                        className: "px-3 py-2 rounded hover:bg-slate-200/50 dark:hover:bg-white/10",
                        children: "Plan"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/onboard/goal",
                        className: "btn-primary",
                        children: "Create Plan"
                    }, void 0, false, {
                        fileName: "[project]/components/Navbar.js",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: toggleTheme,
                        className: "small-btn",
                        children: theme === "dark" ? "🌙" : "☀️"
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
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Navbar.js",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/Card.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function Card({ title, children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `card ${className}`,
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
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
}),
"[project]/lib/feedback.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const raw = undefined;
    const arr = undefined;
}
function getAllFeedback() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
    const raw = undefined;
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
}),
"[project]/lib/planGenerator.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/lib/progression.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/progression.js
// Applies weekly progression to sets/reps/intensity based on adaptation style & feedback
/**
 * ex = {
 *   name,
 *   sets,
 *   reps,
 *   intensity_pct,
 *   rest_sec,
 *   rir
 * }
 *
 * Returns modified exercise object
 */ __turbopack_context__.s([
    "applyProgressionToExercises",
    ()=>applyProgressionToExercises
]);
function applyProgressionToExercises(exercises, adaptationStyle, feedbackSummary) {
    if (!Array.isArray(exercises)) return exercises;
    return exercises.map((ex)=>{
        const updated = {
            ...ex
        };
        // Determine adjustment intensity
        let factor = 1.0;
        if (adaptationStyle === 'conservative') factor = 0.5;
        if (adaptationStyle === 'moderate') factor = 1.0;
        if (adaptationStyle === 'aggressive') factor = 1.4;
        // Feedback logic
        let easyBias = 0;
        let hardBias = 0;
        let sorenessBias = 0;
        if (feedbackSummary) {
            const { difficulty, soreness } = feedbackSummary;
            const total = feedbackSummary.total || 1;
            const easyRate = (difficulty.Easy || 0) / total;
            const hardRate = (difficulty.Hard || 0) / total;
            const sorenessRate = (soreness.High || 0) / total;
            easyBias = easyRate * 0.5;
            hardBias = hardRate * -0.7;
            sorenessBias = sorenessRate * -0.5;
        }
        const combinedAdjustment = factor + easyBias + hardBias + sorenessBias;
        // Adjust RIR (lower RIR = harder)
        updated.rir = Math.max(0, Math.round((updated.rir - 0.2 * combinedAdjustment) * 10) / 10);
        // Adjust intensity
        updated.intensity_pct = Math.min(90, Math.round(updated.intensity_pct * (1 + 0.02 * combinedAdjustment)));
        // Adjust sets for compound lifts only
        const isCompound = ex.name.toLowerCase().includes("bench") || ex.name.toLowerCase().includes("squat") || ex.name.toLowerCase().includes("dead") || ex.name.toLowerCase().includes("press") || ex.name.toLowerCase().includes("row");
        if (isCompound) {
            updated.sets = Math.min(6, Math.max(3, Math.round(updated.sets + 0.2 * combinedAdjustment)));
        }
        return updated;
    });
}
}),
"[project]/lib/phaseManager.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/phaseManager.js
// Controls training phases based on time since plan creation
__turbopack_context__.s([
    "getPhaseForWeeks",
    ()=>getPhaseForWeeks,
    "getWeeksSince",
    ()=>getWeeksSince,
    "suggestSplit",
    ()=>suggestSplit
]);
function getWeeksSince(dateString) {
    try {
        const start = new Date(dateString);
        const now = new Date();
        const diff = now - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    } catch  {
        return 0;
    }
}
function getPhaseForWeeks(weeks) {
    if (weeks < 2) return "Foundation Phase";
    if (weeks < 5) return "Volume Phase";
    if (weeks < 8) return "Intensity Phase";
    if (weeks < 10) return "Peak Performance Phase";
    return "Deload / Reset Phase";
}
function suggestSplit(experience, days) {
    if (experience === "beginner") {
        if (days === 3) return "Full Body Split";
        if (days === 4) return "Upper / Lower Split";
        return "Full Body Hybrid";
    }
    if (experience === "intermediate") {
        if (days === 3) return "PPL (3-day version)";
        if (days === 4) return "Upper / Lower Split";
        if (days === 5) return "PPL + Upper/Lower";
        return "PPL (full 6-day)";
    }
    if (experience === "advanced") {
        if (days <= 4) return "Upper / Lower Powerbuilding";
        if (days === 5) return "PPL + Strength Days";
        return "PPL (high volume)";
    }
    return "General Balanced Split";
}
}),
"[project]/lib/trainingEngine.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/trainingEngine.js
__turbopack_context__.s([
    "adaptExistingPlan",
    ()=>adaptExistingPlan,
    "generateAdaptivePlan",
    ()=>generateAdaptivePlan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$planGenerator$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/planGenerator.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progression$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/progression.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phaseManager$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phaseManager.js [ssr] (ecmascript)");
;
;
;
function generateAdaptivePlan(profile = {}) {
    const basePlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$planGenerator$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["generateProfessionalPlan"])(profile);
    const now = new Date().toISOString();
    basePlan.generatedAt = now;
    basePlan.profile = {
        ...basePlan.profile || {},
        ...profile,
        adaptationStyle: profile.adaptationStyle || 'moderate'
    };
    const initialPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phaseManager$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getPhaseForWeeks"])(0);
    basePlan.phaseInfo = {
        weeksSinceStart: 0,
        phase: initialPhase,
        split: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phaseManager$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["suggestSplit"])(profile.experience || 'beginner', Number(profile.daysPerWeek) || 3)
    };
    // Apply progression even on week 1 (mild)
    basePlan.sessions = basePlan.sessions.map((s)=>({
            ...s,
            exercises: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progression$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["applyProgressionToExercises"])(s.exercises, profile.adaptationStyle, null // no feedback on week 1
            )
        }));
    return basePlan;
}
function adaptExistingPlan(existingPlan, feedbackSummary = null, profile = {}) {
    if (!existingPlan) {
        return generateAdaptivePlan(profile);
    }
    const combinedProfile = {
        ...existingPlan.profile || {},
        ...profile
    };
    const adaptationStyle = combinedProfile.adaptationStyle || 'moderate';
    const weeks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phaseManager$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getWeeksSince"])(existingPlan.generatedAt);
    const phase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phaseManager$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getPhaseForWeeks"])(weeks);
    existingPlan.phaseInfo = {
        weeksSinceStart: weeks,
        phase,
        split: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phaseManager$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["suggestSplit"])(combinedProfile.experience || 'beginner', Number(combinedProfile.daysPerWeek) || 3)
    };
    const newSessions = existingPlan.sessions.map((s)=>{
        const progressedExercises = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$progression$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["applyProgressionToExercises"])(s.exercises, adaptationStyle, feedbackSummary);
        return {
            ...s,
            exercises: progressedExercises
        };
    });
    const updatedPlan = {
        ...existingPlan,
        sessions: newSessions,
        generatedAt: new Date().toISOString(),
        profile: combinedProfile,
        adaptationSummary: {
            usedStyle: adaptationStyle,
            weeksSinceStart: weeks,
            difficultyIndex: feedbackSummary ? ((feedbackSummary.difficulty.Easy || 0) - (feedbackSummary.difficulty.Hard || 0)) / (feedbackSummary.total || 1) : 0
        }
    };
    return updatedPlan;
}
}),
"[project]/pages/dashboard.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Navbar.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Card.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$feedback$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/feedback.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trainingEngine$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/trainingEngine.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
function Dashboard() {
    const [plan, setPlan] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [feedbackSummary, setFeedbackSummary] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const savedProfile = localStorage.getItem('ft_profile');
        if (savedProfile) setProfile(JSON.parse(savedProfile));
        fetch('/api/plan').then((r)=>r.json()).then((p)=>{
            setPlan(p);
            setLoading(false);
        }).catch(()=>setLoading(false));
        const fb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$feedback$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["summarizeFeedback"])({
            lastN: 20
        });
        setFeedbackSummary(fb);
    }, []);
    function regeneratePlan() {
        if (!plan || !profile) {
            alert("No plan or profile found.");
            return;
        }
        const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$feedback$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["summarizeFeedback"])({
            lastN: 20
        }) || {};
        const newPlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$trainingEngine$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["adaptExistingPlan"])(plan, summary, profile);
        localStorage.setItem('ft_plan', JSON.stringify(newPlan));
        setPlan(newPlan);
        alert("Plan updated with adaptive progression!");
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/pages/dashboard.js",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                    className: "container p-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-slate-600 dark:text-slate-300",
                        children: "Loading dashboard..."
                    }, void 0, false, {
                        fileName: "[project]/pages/dashboard.js",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/dashboard.js",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Navbar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "container p-8 grid md:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: "md:col-span-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            title: "Your Weekly Program",
                            children: [
                                !plan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-slate-600 dark:text-slate-300",
                                    children: "No plan yet — create one."
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 63,
                                    columnNumber: 23
                                }, this),
                                plan && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid gap-3",
                                    children: plan.sessions.map((s, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold",
                                                            children: s.day
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard.js",
                                                            lineNumber: 69,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/day/${idx + 1}`,
                                                            className: "small-btn",
                                                            children: "Open"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard.js",
                                                            lineNumber: 70,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 68,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-600 dark:text-slate-300 mt-2",
                                                    children: [
                                                        s.exercises.length,
                                                        " exercises — ",
                                                        profile?.timePerSession || 40,
                                                        " mins"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 72,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, s.day, true, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 67,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/dashboard.js",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/dashboard.js",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                title: "Profile",
                                children: profile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Goal:"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 84,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                profile.goal
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Exp:"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 85,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                profile.experience
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Days/week:"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 86,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                profile.daysPerWeek
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 86,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Time:"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 87,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                profile.timePerSession,
                                                " mins"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 87,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Adaptation:"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 88,
                                                    columnNumber: 20
                                                }, this),
                                                " ",
                                                profile.adaptationStyle
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 88,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-slate-600",
                                    children: "No profile"
                                }, void 0, false, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 90,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard.js",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Adaptive Coach Summary",
                                    children: [
                                        !feedbackSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-slate-600",
                                            children: "No feedback yet. Start logging your sessions!"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 94,
                                            columnNumber: 36
                                        }, this),
                                        feedbackSummary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                            children: "Total logs:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard.js",
                                                            lineNumber: 97,
                                                            columnNumber: 22
                                                        }, this),
                                                        " ",
                                                        feedbackSummary.total
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 97,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                            children: "Easy:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard.js",
                                                            lineNumber: 98,
                                                            columnNumber: 22
                                                        }, this),
                                                        " ",
                                                        feedbackSummary.difficulty.Easy
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 98,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                            children: "Moderate:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard.js",
                                                            lineNumber: 99,
                                                            columnNumber: 22
                                                        }, this),
                                                        " ",
                                                        feedbackSummary.difficulty.Moderate
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 99,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                            children: "Hard:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard.js",
                                                            lineNumber: 100,
                                                            columnNumber: 22
                                                        }, this),
                                                        " ",
                                                        feedbackSummary.difficulty.Hard
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 100,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                            children: "Missed reps:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/dashboard.js",
                                                            lineNumber: 101,
                                                            columnNumber: 22
                                                        }, this),
                                                        " ",
                                                        feedbackSummary.missedRepsCount
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/dashboard.js",
                                                    lineNumber: 101,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 96,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard.js",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Card$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                title: "Actions",
                                className: "mt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: regeneratePlan,
                                            className: "btn-primary text-center",
                                            children: "Regenerate Adaptive Plan"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/onboard/goal",
                                            className: "small-btn text-center",
                                            children: "Create New Plan"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 110,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/weekly-plan",
                                            className: "small-btn text-center",
                                            children: "View Full Plan"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/dashboard.js",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/dashboard.js",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/dashboard.js",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/dashboard.js",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/dashboard.js",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4be093ad._.js.map