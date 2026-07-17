/* ==========================================================
   ELITE CONSULTING GROUP — Shared Site Behavior
   ========================================================== */
(function(){
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){

    /* ---------- Page loader ---------- */
    var loader = document.getElementById("page-loader");
    if(loader){
      window.addEventListener("load", function(){
        setTimeout(function(){ loader.classList.add("loaded"); }, 350);
      });
    }

    /* ---------- AOS ---------- */
    if(window.AOS){
      AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });
    }

    /* ---------- Dark mode ---------- */
    var root = document.documentElement;
    var savedTheme = localStorage.getItem("ecg-theme");
    if(savedTheme === "dark"){ root.setAttribute("data-theme","dark"); }
    document.querySelectorAll(".dark-toggle").forEach(function(btn){
      updateThemeIcon(btn);
      btn.addEventListener("click", function(){
        var isDark = root.getAttribute("data-theme") === "dark";
        if(isDark){ root.removeAttribute("data-theme"); localStorage.setItem("ecg-theme","light"); }
        else{ root.setAttribute("data-theme","dark"); localStorage.setItem("ecg-theme","dark"); }
        document.querySelectorAll(".dark-toggle").forEach(updateThemeIcon);
      });
    });
    function updateThemeIcon(btn){
      var isDark = root.getAttribute("data-theme") === "dark";
      btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    /* ---------- Sticky header shadow ---------- */
    var header = document.querySelector(".site-header");
    function onScrollHeader(){
      if(!header) return;
      header.classList.toggle("scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", onScrollHeader);
    onScrollHeader();

    /* ---------- Active nav link ---------- */
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link-custom").forEach(function(link){
      var href = link.getAttribute("href");
      if(href === path){ link.classList.add("active"); }
    });

    /* ---------- Animated counters ---------- */
    var counters = document.querySelectorAll(".counter");
    if(counters.length){
      var counterObserver = new IntersectionObserver(function(entries, obs){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function(c){ counterObserver.observe(c); });
    }
    function animateCounter(el){
      var target = parseFloat(el.getAttribute("data-target"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var start = null;
      function step(ts){
        if(!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if(progress < 1){ requestAnimationFrame(step); }
        else{ el.textContent = target.toLocaleString() + suffix; }
      }
      requestAnimationFrame(step);
    }

    /* ---------- Back to top ---------- */
    var backToTop = document.querySelector(".back-to-top");
    if(backToTop){
      window.addEventListener("scroll", function(){
        backToTop.classList.toggle("show", window.scrollY > 500);
      });
      backToTop.addEventListener("click", function(){
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---------- Floating CTA ---------- */
    var floatingCta = document.querySelector(".floating-cta");
    if(floatingCta){
      window.addEventListener("scroll", function(){
        floatingCta.classList.toggle("show", window.scrollY > 700);
      });
    }

    /* ---------- Live chat widget ---------- */
    var chatBubble = document.querySelector(".chat-bubble");
    var chatPanel = document.querySelector(".chat-panel");
    if(chatBubble && chatPanel){
      chatBubble.addEventListener("click", function(){
        chatPanel.classList.toggle("show");
      });
      var chatClose = chatPanel.querySelector(".chat-close");
      if(chatClose){ chatClose.addEventListener("click", function(){ chatPanel.classList.remove("show"); }); }
    }

    /* ---------- Cookie consent ---------- */
    var cookieBar = document.querySelector(".cookie-bar");
    if(cookieBar){
      if(!localStorage.getItem("ecg-cookie-consent")){
        setTimeout(function(){ cookieBar.classList.add("show"); }, 900);
      }
      cookieBar.querySelectorAll("[data-cookie-action]").forEach(function(btn){
        btn.addEventListener("click", function(){
          localStorage.setItem("ecg-cookie-consent", btn.getAttribute("data-cookie-action"));
          cookieBar.classList.remove("show");
        });
      });
    }

    /* ---------- Simple search toggle ---------- */
    var searchToggle = document.querySelector(".search-toggle");
    var searchBar = document.querySelector(".search-bar-wrap");
    if(searchToggle && searchBar){
      searchToggle.addEventListener("click", function(){
        searchBar.classList.toggle("show");
        if(searchBar.classList.contains("show")){
          var input = searchBar.querySelector("input");
          if(input) input.focus();
        }
      });
    }

    /* ---------- Generic client-side form validation ---------- */
    document.querySelectorAll("form[data-validate]").forEach(function(form){
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var valid = true;
        form.querySelectorAll("[required]").forEach(function(field){
          var value = field.value.trim();
          var ok = value.length > 0;
          if(field.type === "email" && ok){
            ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          }
          if(field.type === "tel" && ok){
            ok = /^[0-9+()\-\s]{7,}$/.test(value);
          }
          field.classList.toggle("is-invalid", !ok);
          if(!ok) valid = false;
        });
        var successBox = form.querySelector(".form-success");
        if(valid){
          form.reset();
          form.querySelectorAll(".is-invalid").forEach(function(f){ f.classList.remove("is-invalid"); });
          if(successBox){ successBox.classList.add("show"); form.classList.add("d-none"); }
        }
      });
      form.querySelectorAll("[required]").forEach(function(field){
        field.addEventListener("input", function(){ field.classList.remove("is-invalid"); });
      });
    });

    /* ---------- Booking form multi-step ---------- */
    var bookingForm = document.getElementById("bookingForm");
    if(bookingForm){
      var steps = bookingForm.querySelectorAll(".form-step");
      var stepIndicators = document.querySelectorAll(".booking-step");
      var currentStep = 0;
      function showStep(i){
        steps.forEach(function(s, idx){ s.classList.toggle("d-none", idx !== i); });
        stepIndicators.forEach(function(el, idx){
          el.classList.toggle("active", idx === i);
          el.classList.toggle("done", idx < i);
        });
      }
      bookingForm.querySelectorAll("[data-next]").forEach(function(btn){
        btn.addEventListener("click", function(){
          var currentFields = steps[currentStep].querySelectorAll("[required]");
          var valid = true;
          currentFields.forEach(function(field){
            var ok = field.value.trim().length > 0;
            field.classList.toggle("is-invalid", !ok);
            if(!ok) valid = false;
          });
          if(valid && currentStep < steps.length - 1){ currentStep++; showStep(currentStep); }
        });
      });
      bookingForm.querySelectorAll("[data-prev]").forEach(function(btn){
        btn.addEventListener("click", function(){
          if(currentStep > 0){ currentStep--; showStep(currentStep); }
        });
      });
      showStep(0);
    }

    /* ---------- Newsletter forms ---------- */
    document.querySelectorAll(".newsletter-form").forEach(function(form){
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var msg = form.querySelector(".newsletter-msg");
        var input = form.querySelector("input[type=email]");
        if(input && input.value.trim()){
          if(msg){ msg.textContent = "You're on the list — thanks for subscribing."; msg.classList.add("show"); }
          form.reset();
        }
      });
    });

  });
})();
