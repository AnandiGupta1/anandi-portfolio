// ====== EDIT THIS PART: your own details ======
const skills = ["HTML", "CSS", "JavaScript", "Git", "GitHub"];

const projects = [
  {
    title: "Project one",
    description: "A food menu using VS code",
  },
  {
    title: "Project two",
    description: "to-do list.",
  },
  {
    title: "This portfolio",
    description: "A personal site built with HTML, CSS and JavaScript, hosted on Vercel.",
  }
];

const roles = ["websites.", "small apps.", "things that work."];
// ====== End of editable part ======

// Greeting based on the visitor's local time
const hour = new Date().getHours();
const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
document.getElementById("greeting").textContent = "Good " + timeOfDay + ", and welcome.";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Skills list
const skillsEl = document.getElementById("skills");
skills.forEach(function (skill) {
  const li = document.createElement("li");
  li.textContent = skill;
  skillsEl.appendChild(li);
});

// Project cards
const projectList = document.getElementById("projectList");
projects.forEach(function (p) {
  const card = document.createElement("article");
  card.className = "project";

  const title = document.createElement("h3");
  title.textContent = p.title;

  const desc = document.createElement("p");
  desc.textContent = p.description;

  const link = document.createElement("a");
  link.href = p.link;
  link.textContent = "View project";

  card.append(title, desc, link);
  projectList.appendChild(card);
});

// Typing effect (shows the full text right away if the visitor prefers less motion)
const typedEl = document.getElementById("typed");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  typedEl.textContent = roles[0];
} else {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, charIndex);

    let delay = deleting ? 40 : 90;
    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1500;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
}

// Light / dark theme, remembered between visits
const toggle = document.getElementById("themeToggle");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  toggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}
let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

toggle.addEventListener("click", function () {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Web3Forms contact form
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const sendBtn = document.getElementById("sendBtn");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  statusEl.className = "form-status";

  if (!form.checkValidity()) {
    statusEl.textContent = "Please fill in your name, a valid email and a message.";
    statusEl.classList.add("err");
    return;
  }

  sendBtn.disabled = true;
  statusEl.textContent = "Sending...";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result = await response.json();

    if (response.ok && result.success) {
      statusEl.textContent = "Message sent. Thank you!";
      statusEl.classList.add("ok");
      form.reset();
    } else {
      statusEl.textContent = result.message || "Something went wrong. Please try again.";
      statusEl.classList.add("err");
    }
  } catch (error) {
    statusEl.textContent = "Could not send. Check your internet connection and try again.";
    statusEl.classList.add("err");
  } finally {
    sendBtn.disabled = false;
  }
});
