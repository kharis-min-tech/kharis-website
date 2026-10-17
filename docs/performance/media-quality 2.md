# Media quality

The main site now uses SiteImage to request quality 95 by default, with explicit lower-quality thumbnail overrides retained. Original Cloudflare pictures remain unchanged. Responsive widths are retained, and the event split photos now request full mobile width instead of half-width thumbnails on narrow screens.

The Sunday banner source video is H.264, 1280 by 720 at 60fps, about 2 Mbps. A denoise, sharpen and upscale trial did not provide a meaningful improvement and was not deployed. No recovered HD detail is claimed. Both main-site clips are 720p; three KP2 clips are 1024 by 576, and the remaining KP2 clip is portrait 606 by 1080. Better originals are needed for true resolution upgrades to these videos.

On large screens the Sunday banner starts with an existing 2048-pixel service photograph, with the original video available through the play control. Smaller screens may autoplay the existing clip, subject to reduced-motion preference. Video data is requested only when the banner is in view and playing.

Globe controls, hover cards and the country picker remain lightweight DOM overlays over the canvas. Country picker options support keyboard arrows, Escape and outside-click dismissal. Page transitions use opacity and transforms with a stationary shared header, and reduced motion disables the movement.
