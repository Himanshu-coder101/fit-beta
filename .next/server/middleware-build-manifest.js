self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/dashboard": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/dashboard.js"
    ],
    "/onboard/equipment": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/onboard/equipment.js"
    ],
    "/onboard/experience": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/onboard/experience.js"
    ],
    "/onboard/frequency": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/onboard/frequency.js"
    ],
    "/onboard/goal": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/onboard/goal.js"
    ],
    "/onboard/style": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/onboard/style.js"
    ],
    "/onboard/summary": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/onboard/summary.js"
    ],
    "/onboard/time": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/onboard/time.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];