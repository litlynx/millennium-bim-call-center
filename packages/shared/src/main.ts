// Entry point for the shared remote when opened standalone.
// Do NOT import the library index here; that would pull React via MF share scope
// before any host initializes it, causing RUNTIME-006 when served directly.
// Hosts will load exposed modules via remoteEntry. Standalone just renders a placeholder.
import './bootstrap';
