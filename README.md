# proportional-proof-of-work-js
JavaScript portion of the proportional proof of work PHP code

This package itself doesn't provide the proportional aspect of the title, but this is intended to work in conjunction with the laravel package which adjusts the computational intensity in relation to session activity (work-based throttling).

The concept really is a library that can perform as a combination of CSRF and Throttle. A page or endpoint protected by the PPOW middleware requires the client to perform some work- the intensity requirement would be determined by the number of accesses recently and the baseline value of the resource. The client computes a hash collision, which takes time, and essentially self-throttles as the work requirement increases, making scraping and automation impractical. A normally behaving client would never notice the minimal amount of work required.

The author is presently investigating two approaches- one which works as part of form submission and another which can protect GET assets with a knowledeable client (site-specific JavaScript code).

This is in the early alpha stages, though the core proof of work functionality seems correct and compatible between PHP and JavaScript.

Laravel (WIP): https://github.com/jessica-mulein/proportional-proof-of-work-laravel / https://packagist.org/packages/jessica-mulein/proportional-proof-of-work-laravel

Laravel Integration Demo (WIP): https://github.com/jessica-mulein/proportional-proof-of-work-laravel-demo
