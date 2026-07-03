"use strict";
// Function to apply TailwindCSS classes to markdown elements
document.addEventListener("DOMContentLoaded", () => {
    // Style all markdown content containers
    document.querySelectorAll(".markdown-content").forEach((container) => {
        // Style headings
        container.querySelectorAll("h1").forEach((h) => {
            h.classList.add(...["text-3xl", "font-bold", "text-inherit", "mb-4"]);
        });
        container.querySelectorAll("h2").forEach((h) => {
            h.classList.add("text-2xl", "font-semibold", "text-inherit", "mb-3");
        });
        container.querySelectorAll("h3").forEach((h) => {
            h.classList.add("text-xl", "font-medium", "text-inherit", "mb-2");
        });
        container.querySelectorAll("h4").forEach((h) => {
            h.classList.add("text-lg", "font-medium", "text-inherit", "mb-2");
        });
        // Style paragraphs
        container.querySelectorAll("p").forEach((p) => {
            p.classList.add("text-inherit", "mb-3", "leading-relaxed");
        });
        // Style lists
        container.querySelectorAll("ul").forEach((ul) => {
            ul.classList.add("list-disc", "list-inside", "text-gray-600", "mb-3", "space-y-1");
        });
        container.querySelectorAll("ol").forEach((ol) => {
            ol.classList.add("list-decimal", "list-inside", "text-gray-600", "mb-3", "space-y-1");
        });
        container.querySelectorAll("li").forEach((li) => {
            li.classList.add("mb-1");
        });
        // Style links
        // Style emphasis
        container.querySelectorAll("strong").forEach((strong) => {
            strong.classList.add("font-semibold", "text-gray-800");
        });
        container.querySelectorAll("em").forEach((em) => {
            em.classList.add("italic");
        });
        // Style code
        container.querySelectorAll("code").forEach((code) => {
            code.classList.add("bg-gray-100", "text-gray-800", "px-1", "py-0.5", "rounded", "text-sm");
        });
        container.querySelectorAll("pre").forEach((pre) => {
            pre.classList.add("bg-gray-100", "p-3", "rounded-lg", "overflow-x-auto", "mb-3");
        });
        // Style blockquotes
        container.querySelectorAll("blockquote").forEach((blockquote) => {
            blockquote.classList.add("border-l-4", "border-gray-300", "pl-4", "italic", "text-gray-600", "mb-3");
        });
    });
});
window.addEventListener('beforeprint', () => {
    document.querySelectorAll('details').forEach(d => d.setAttribute('open', ''));
});
window.addEventListener('afterprint', () => {
    document.querySelectorAll('details').forEach(d => {
        // Remove 'open' if it wasn't originally open
        if (!d.dataset.wasOpen)
            d.removeAttribute('open');
    });
});
