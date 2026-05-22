(function () {
  "use strict";

  var tabList = document.querySelector(".tabs");
  if (!tabList) return;

  var tabs = tabList.querySelectorAll('[role="tab"]');
  var panels = document.querySelectorAll(".tab-panel");

  function activateTab(selected) {
    var targetId = selected.getAttribute("aria-controls");

    tabs.forEach(function (tab) {
      var isSelected = tab === selected;
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
      tab.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach(function (panel) {
      var show = panel.id === targetId;
      panel.classList.toggle("hidden", !show);
      panel.hidden = !show;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activateTab(tab);
    });

    tab.addEventListener("keydown", function (e) {
      var index = Array.prototype.indexOf.call(tabs, tab);
      var next = -1;

      if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;

      if (next >= 0) {
        e.preventDefault();
        tabs[next].focus();
        activateTab(tabs[next]);
      }
    });
  });

  var tocLinks = document.querySelectorAll(".toc a, .nav a");
  var sections = [];

  tocLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (!id || id.charAt(0) !== "#") return;
    var section = document.getElementById(id.slice(1));
    if (section && sections.indexOf(section) === -1) {
      sections.push(section);
    }
  });

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          tocLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            var active = href === "#" + id;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
