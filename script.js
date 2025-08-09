;(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const header = document.querySelector("header")
  const links = Array.from(document.querySelectorAll('header a[href^="#"]'))

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || ""
      if (!href.startsWith("#")) return
      const target = document.querySelector(href)
      if (!target) return

      e.preventDefault()
      const headerHeight = header?.offsetHeight || 0
      const rect = target.getBoundingClientRect()
      const targetY = window.scrollY + rect.top - (headerHeight + 8)

      if (!reduceMotion) {
        window.scrollTo({ top: targetY, behavior: "smooth" })
      } else {
        window.scrollTo(0, targetY)
      }
    })
  })


  const revealEls = document.querySelectorAll(".reveal")
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view")
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    revealEls.forEach((el) => io.observe(el))
  }

  const sections = Array.from(document.querySelectorAll("section[id]"))
  if (sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id")
          const anchor = links.find((l) => l.getAttribute("href") === `#${id}`)
          if (entry.isIntersecting && anchor) {
            links.forEach((l) => l.classList.remove("active"))
            anchor.classList.add("active")
          }
        })
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )
    sections.forEach((s) => spy.observe(s))
  }

  const bg = document.querySelector(".background")
  if (bg && !reduceMotion) {
    const onScroll = () => {
      const y = Math.min(window.scrollY * 0.15, 200) // cap the travel
      bg.style.transform = `translateY(${y}px) scale(1.05)`
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
  }
})()
