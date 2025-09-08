// Render a minimal placeholder without importing React so the remote can be
// opened directly (e.g., via `serve -s dist`) without requiring shared deps.
const container = document.getElementById('app');

if (container) {
  const wrapper = document.createElement('div');
  wrapper.style.fontFamily =
    'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"';
  wrapper.style.padding = '1rem';
  wrapper.style.color = '#374151';
  wrapper.innerText =
    'Shared library built successfully. This package exposes components/utilities for hosts via Module Federation.';
  container.appendChild(wrapper);
}
