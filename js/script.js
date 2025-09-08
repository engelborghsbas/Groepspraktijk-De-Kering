// Therapist data
const therapists = [
  {
    name: "Sarie Goossens",
    phone: "0499/42.62.58",
    email: "sarie.goossens@gmail.com",
  },
  {
    name: "Marijke Leys",
    phone: "0477/25.75.50",
    email: "marijke.leys@voicedialogue.be",
  },
  {
    name: "Liesbet Laenen",
    phone: "0487/39.63.06",
    email: "liesbetlaenen.psy@gmail.com",
  },
  {
    name: "Marlies Borgers",
    phone: "0472/96.00.89",
    email: "marliesborgers@gmail.com",
  },
  {
    name: "Elisabet Abts",
    phone: "0484/342848",
    email: "elisabetabts@gmail.com",
  },
]

// DOM elements
const searchInput = document.getElementById("therapistSearch")
const searchResults = document.getElementById("searchResults")
const therapistList = document.getElementById("therapistList")
const mobileMenuToggle = document.getElementById("mobileMenuToggle")
const navMenu = document.getElementById("navMenu")
const mobileToggle = document.getElementById("mobileToggle")
const navLinks = document.querySelectorAll(".nav-link")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeTherapistList()
  initializeSearch()
  initializeMobileMenu()
  initializeNavigation()
  initializeSmoothScrolling()
  initializeLazyLoading()
})

// Initialize therapist list in sidebar
function initializeTherapistList() {
  if (therapistList) {
    therapistList.innerHTML = therapists
        .map(
            (therapist) => `
          <div class="therapist-card" data-name="${therapist.name.toLowerCase()}">
              <h4>${therapist.name}</h4>
              <p><i class="fas fa-phone"></i> ${therapist.phone}</p>
              <p><i class="fas fa-envelope"></i> <a href="mailto:${therapist.email}">${therapist.email}</a></p>
          </div>
      `,
        )
        .join("")
  }
}

// Initialize search functionality
function initializeSearch() {
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch)
    searchInput.addEventListener("focus", handleSearchFocus)
    document.addEventListener("click", handleClickOutside)
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim()

  if (query.length === 0) {
    hideSearchResults()
    return
  }

  const filteredTherapists = therapists.filter(
      (therapist) => therapist.name.toLowerCase().includes(query) || therapist.email.toLowerCase().includes(query),
  )

  displaySearchResults(filteredTherapists, query)
}

function handleSearchFocus() {
  if (searchInput && searchInput.value.trim().length > 0) {
    handleSearch({ target: searchInput })
  }
}

function displaySearchResults(results, query) {
  if (!searchResults) return

  if (results.length === 0) {
    searchResults.innerHTML = '<div class="search-result-item">Geen therapeuten gevonden</div>'
  } else {
    searchResults.innerHTML = results
        .map(
            (therapist) => `
            <div class="search-result-item" data-email="${therapist.email}">
                <strong>${highlightMatch(therapist.name, query)}</strong><br>
                <small>${therapist.phone} • ${highlightMatch(therapist.email, query)}</small>
            </div>
        `,
        )
        .join("")

    // Add click handlers to search results
    searchResults.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", function () {
        const email = this.dataset.email
        window.location.href = `mailto:${email}`
        hideSearchResults()
        searchInput.value = ""
      })
    })
  }

  searchResults.style.display = "block"
}

function highlightMatch(text, query) {
  if (!query) return text
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi")
  return text.replace(regex, '<mark style="background: #fff3cd; padding: 1px 2px;">$1</mark>')
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function hideSearchResults() {
  if (searchResults) {
    searchResults.style.display = "none"
  }
}

function handleClickOutside(e) {
  if (searchInput && searchResults &&
      !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    hideSearchResults()
  }
}

// Initialize mobile menu
function initializeMobileMenu() {
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", toggleMobileMenu)

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu)
    })
  }
}

function toggleMobileMenu() {
  if (!navMenu || !mobileToggle) return

  navMenu.classList.toggle("active")
  mobileToggle.classList.toggle("active")

  // Animate hamburger menu
  const spans = mobileToggle.querySelectorAll("span")
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
    spans[1].style.opacity = "0"
    spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
  } else {
    spans.forEach((span) => {
      span.style.transform = "none"
      span.style.opacity = "1"
    })
  }
}

function closeMobileMenu() {
  if (!navMenu || !mobileToggle) return

  navMenu.classList.remove("active")
  mobileToggle.classList.remove("active")

  const spans = mobileToggle.querySelectorAll("span")
  spans.forEach((span) => {
    span.style.transform = "none"
    span.style.opacity = "1"
  })
}

// Initialize navigation
function initializeNavigation() {
  // Handle active navigation state
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      // Only handle internal links (starting with #)
      if (href && href.startsWith("#")) {
        e.preventDefault()

        // Remove active class from all links
        navLinks.forEach((l) => l.classList.remove("active"))

        // Add active class to clicked link
        this.classList.add("active")

        // Smooth scroll to target
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          const navHeight = document.querySelector(".nav").offsetHeight
          const targetPosition = targetElement.offsetTop - navHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }

        closeMobileMenu()
      }
    })
  })
}

// Initialize smooth scrolling for all internal links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href === "#") return

      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerElement = document.querySelector(".nav")
        const headerHeight = headerElement ? headerElement.offsetHeight : 0
        const targetPosition = targetElement.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Update active navigation on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const navHeight = document.querySelector(".nav")?.offsetHeight || 0
  const scrollPosition = window.scrollY + navHeight + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
})

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Intersection Observer for fade-in animations
const observerOptions2 = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer2 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions2)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".content-card, .contact-card, .info-card, .definition-item, .method-card, .team-member")

  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer2.observe(el)
  })
})

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroImage = document.querySelector(".hero-bg")

  if (heroImage) {
    const speed = scrolled * 0.5
    heroImage.style.transform = `translateY(${speed}px)`
  }
})

// Smooth reveal animation for sections
const revealSections = () => {
  const sections = document.querySelectorAll(".section")

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top
    const windowHeight = window.innerHeight

    if (sectionTop < windowHeight * 0.8) {
      section.style.opacity = "1"
      section.style.transform = "translateY(0)"
    }
  })
}

// Initialize section animations
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section")

  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(30px)"
    section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
  })

  revealSections()
})

window.addEventListener("scroll", revealSections)

// Performance optimization: Lazy load images
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))

  // Lazy loading for placeholder images
  const lazyImages = document.querySelectorAll('img[src*="placeholder"]')

  const placeholderObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.style.opacity = "1"
        placeholderObserver.unobserve(img)
      }
    })
  })

  lazyImages.forEach((img) => {
    img.style.opacity = "0.7"
    img.style.transition = "opacity 0.3s ease"
    placeholderObserver.observe(img)
  })
}

// Keyboard navigation support
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu and search results
  if (e.key === "Escape") {
    closeMobileMenu()
    hideSearchResults()
    if (searchInput) searchInput.blur()
  }

  // Enter key in search input
  if (e.key === "Enter" && document.activeElement === searchInput && searchResults) {
    const firstResult = searchResults.querySelector(".search-result-item")
    if (firstResult) {
      firstResult.click()
    }
  }
})

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add loading states and error handling
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="loading">Laden...</div>'
  }
}

function showError(element, message) {
  if (element) {
    element.innerHTML = `<div class="error">${message}</div>`
  }
}

// Add form validation utilities (for future contact forms)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  const re = /^[+]?[0-9\s\-()]{8,}$/
  return re.test(phone)
}

// Email link tracking (optional analytics)
document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", () => {
    // You can add analytics tracking here if needed
    console.log("Email link clicked:", link.href)
  })
})

// Export functions for potential future use
window.TherapyPractice = {
  therapists,
  validateEmail,
  validatePhone,
  showLoading,
  showError,
  debounce,
}