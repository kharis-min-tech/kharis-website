// Run before first paint. The dove entrance belongs only to a fresh homepage load.
export const SITE_INTRO_BOOTSTRAP = `(function(){document.documentElement.dataset.siteIntro=location.pathname==='/'?'pending':'seen';})();`;
