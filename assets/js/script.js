"use strict";

/* =========================================================
   DENIS LETEIPAN PORTFOLIO
   Modern 2026 JavaScript
========================================================= */


/* =========================================================
   HELPERS
========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const html = document.documentElement;

const sidebar = $("[data-sidebar]");
const sidebarButton = $("[data-sidebar-btn]");

const navigationLinks = $$("[data-nav-link]");
const navigationTargets = $$("[data-nav-target]");
const pages = $$("[data-page]");

const themeToggle = $("#theme-toggle");
const themeIcon = $("#theme-icon");

const filterButtons = $$("[data-filter-btn]");
const filterItems = $$("[data-filter-item]");
const projectCount = $("#project-count");

const form = $("#contact-form");
const formInputs = $$("[data-form-input]");
const formButton = $("#form-submit");

const testimonialItems = $$("[data-testimonial-item]");
const modalContainer = $("[data-modal-container]");
const modalCloseButton = $("[data-modal-close-btn]");
const modalOverlay = $("[data-overlay]");

const modalAvatar = $("#modal-avatar");
const modalTitle = $("#modal-title");
const modalMessage = $("#modal-message");


/* =========================================================
   SAFE EVENT HELPER
========================================================= */

const on = (element, event, handler, options) => {

  if (!element) {
    return;
  }

  element.addEventListener(
    event,
    handler,
    options
  );

};


/* =========================================================
   SIDEBAR
========================================================= */

on(
  sidebarButton,
  "click",
  () => {

    if (!sidebar) {
      return;
    }

    const isOpen =
      sidebar.classList.toggle("active");

    sidebarButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  }
);


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageName) {

  if (!pageName) {
    return;
  }

  pages.forEach((page) => {

    const isCurrentPage =
      page.dataset.page === pageName;

    page.classList.toggle(
      "active",
      isCurrentPage
    );

  });


  navigationLinks.forEach((link) => {

    const isCurrentLink =
      link.dataset.navLink === pageName;

    link.classList.toggle(
      "active",
      isCurrentLink
    );

  });


  /*
    Close mobile sidebar after navigation.
  */

  if (
    sidebar &&
    window.innerWidth <= 960
  ) {

    sidebar.classList.remove(
      "active"
    );

    if (sidebarButton) {

      sidebarButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  /*
    Keep every page navigation at the top.
  */

  window.scrollTo({
    top: 0,
    behavior:
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth"
  });

}


/*
  Desktop + mobile navigation
*/

navigationLinks.forEach((link) => {

  on(
    link,
    "click",
    () => {

      const pageName =
        link.dataset.navLink;

      showPage(pageName);

    }
  );

});


/*
  Hero CTA buttons
*/

navigationTargets.forEach((button) => {

  on(
    button,
    "click",
    () => {

      const pageName =
        button.dataset.navTarget;

      showPage(pageName);

    }
  );

});


/* =========================================================
   THEME
========================================================= */

const THEME_STORAGE_KEY =
  "leteipan-theme";


function getSystemTheme() {

  return window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches
    ? "light"
    : "dark";

}


function getSavedTheme() {

  try {

    return localStorage.getItem(
      THEME_STORAGE_KEY
    );

  } catch (error) {

    return null;

  }

}


function saveTheme(theme) {

  try {

    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme
    );

  } catch (error) {

    /*
      Storage can fail in privacy-restricted
      browser contexts. The theme still works
      for the current session.
    */

  }

}


function setTheme(theme) {

  const validTheme =
    theme === "light"
      ? "light"
      : "dark";

  html.dataset.theme =
    validTheme;


  if (themeIcon) {

    themeIcon.setAttribute(
      "name",
      validTheme === "light"
        ? "sunny-outline"
        : "moon-outline"
    );

  }


  if (themeToggle) {

    const isLight =
      validTheme === "light";

    themeToggle.setAttribute(
      "aria-pressed",
      String(isLight)
    );

    themeToggle.setAttribute(
      "aria-label",
      isLight
        ? "Switch to dark theme"
        : "Switch to light theme"
    );

    themeToggle.setAttribute(
      "title",
      isLight
        ? "Switch to dark theme"
        : "Switch to light theme"
    );

  }


  saveTheme(validTheme);

}


/*
  Initialise theme immediately.
*/

const storedTheme =
  getSavedTheme();

setTheme(
  storedTheme || getSystemTheme()
);


/*
  Toggle theme.
*/

on(
  themeToggle,
  "click",
  () => {

    const currentTheme =
      html.dataset.theme || "dark";

    const nextTheme =
      currentTheme === "light"
        ? "dark"
        : "light";

    setTheme(nextTheme);

  }
);


/* =========================================================
   SYSTEM THEME CHANGE
========================================================= */

const colorSchemeQuery =
  window.matchMedia(
    "(prefers-color-scheme: light)"
  );


on(
  colorSchemeQuery,
  "change",
  (event) => {

    /*
      Only follow the operating system when
      the visitor has never manually selected
      a theme.
    */

    if (!getSavedTheme()) {

      setTheme(
        event.matches
          ? "light"
          : "dark"
      );

    }

  }
);


/* =========================================================
   PORTFOLIO FILTER
========================================================= */

function updateProjectCount(count) {

  if (!projectCount) {
    return;
  }

  projectCount.textContent =
    `${count} ${
      count === 1
        ? "project"
        : "projects"
    }`;

}


function filterProjects(category = "all") {

  let visibleCount = 0;


  filterItems.forEach((item) => {

    const itemCategory =
      (
        item.dataset.category ||
        ""
      ).toLowerCase();


    const shouldShow =
      category === "all" ||
      itemCategory === category;


    item.classList.toggle(
      "is-hidden",
      !shouldShow
    );


    if (shouldShow) {
      visibleCount += 1;
    }

  });


  updateProjectCount(
    visibleCount
  );


  filterButtons.forEach((button) => {

    const buttonCategory =
      (
        button.dataset.filterBtn ||
        ""
      ).toLowerCase();


    const isActive =
      buttonCategory === category;


    button.classList.toggle(
      "active",
      isActive
    );


    button.setAttribute(
      "aria-selected",
      String(isActive)
    );

  });

}


/*
  Filter button events.
*/

filterButtons.forEach((button) => {

  on(
    button,
    "click",
    () => {

      const category =
        (
          button.dataset.filterBtn ||
          "all"
        ).toLowerCase();

      filterProjects(category);

    }
  );

});


/*
  Initialise portfolio.
*/

filterProjects("all");


/* =========================================================
   TESTIMONIAL MODAL
========================================================= */

let activeTestimonial = null;


function openTestimonial(item) {

  if (
    !item ||
    !modalContainer
  ) {
    return;
  }


  activeTestimonial =
    item;


  const name =
    item.dataset.name ||
    "Client";

  const avatar =
    item.dataset.avatar ||
    "./assets/images/avatar-1.png";

  const message =
    item.dataset.message ||
    "";


  if (modalTitle) {
    modalTitle.textContent =
      name;
  }


  if (modalAvatar) {

    modalAvatar.src =
      avatar;

    modalAvatar.alt =
      name;

  }


  if (modalMessage) {

    modalMessage.textContent =
      message;

  }


  modalContainer.classList.add(
    "active"
  );

  modalContainer.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );


  if (modalCloseButton) {

    window.requestAnimationFrame(
      () => modalCloseButton.focus()
    );

  }

}


function closeTestimonial() {

  if (!modalContainer) {
    return;
  }


  modalContainer.classList.remove(
    "active"
  );

  modalContainer.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );


  /*
    Return keyboard focus to the
    testimonial which opened the modal.
  */

  if (activeTestimonial) {

    activeTestimonial.focus();

  }


  activeTestimonial =
    null;

}


testimonialItems.forEach((item) => {

  on(
    item,
    "click",
    () => openTestimonial(item)
  );

});


on(
  modalCloseButton,
  "click",
  closeTestimonial
);


on(
  modalOverlay,
  "click",
  closeTestimonial
);


/* =========================================================
   MODAL KEYBOARD ACCESSIBILITY
========================================================= */

on(
  document,
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      modalContainer &&
      modalContainer.classList.contains(
        "active"
      )
    ) {

      closeTestimonial();

      return;

    }


    /*
      Basic focus trap inside the modal.
    */

    if (
      event.key !== "Tab" ||
      !modalContainer ||
      !modalContainer.classList.contains(
        "active"
      )
    ) {
      return;
    }


    const focusableElements =
      $$(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
        modalContainer
      ).filter(
        (element) =>
          !element.hasAttribute("disabled")
      );


    if (!focusableElements.length) {
      return;
    }


    const firstElement =
      focusableElements[0];

    const lastElement =
      focusableElements[
        focusableElements.length - 1
      ];


    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {

      event.preventDefault();

      lastElement.focus();

    } else if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {

      event.preventDefault();

      firstElement.focus();

    }

  }
);


/* =========================================================
   CONTACT FORM
========================================================= */

function validateContactForm() {

  if (!formButton) {
    return;
  }


  if (!form) {

    formButton.disabled =
      true;

    return;

  }


  /*
    Native browser validation handles:
    - required
    - email
    - type validation
  */

  formButton.disabled =
    !form.checkValidity();

}


formInputs.forEach((input) => {

  on(
    input,
    "input",
    validateContactForm
  );

  on(
    input,
    "blur",
    validateContactForm
  );

});


if (form) {

  validateContactForm();


  on(
    form,
    "submit",
    (event) => {

      /*
        Run validation before allowing
        Formspree to receive the form.
      */

      if (!form.checkValidity()) {

        event.preventDefault();

        form.reportValidity();

        validateContactForm();

      }

    }
  );

}


/* =========================================================
   FORM SUBMIT STATE
========================================================= */

if (form) {

  on(
    form,
    "submit",
    () => {

      /*
        Allow the native submission to happen,
        then temporarily update the button.
      */

      if (!formButton) {
        return;
      }

      formButton.disabled =
        true;

      const buttonText =
        $("span", formButton);

      if (buttonText) {

        buttonText.textContent =
          "Sending...";

      }

    }
  );

}


/* =========================================================
   MOBILE SIDEBAR / RESPONSIVE CLEANUP
========================================================= */

on(
  window,
  "resize",
  () => {

    /*
      Desktop doesn't need the expandable
      sidebar state.
    */

    if (
      window.innerWidth > 960 &&
      sidebar
    ) {

      sidebar.classList.remove(
        "active"
      );

      if (sidebarButton) {

        sidebarButton.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }

  }
);


/* =========================================================
   DOCUMENT VISIBILITY
========================================================= */

on(
  document,
  "visibilitychange",
  () => {

    /*
      No expensive processing while the tab
      isn't visible. This is intentionally
      lightweight and future-proof.
    */

    if (
      document.visibilityState ===
      "hidden"
    ) {

      /*
        Reserved for future analytics or
        background state handling.
      */

    }

  }
);


/* =========================================================
   INITIALISE PAGE
========================================================= */

showPage("about");
