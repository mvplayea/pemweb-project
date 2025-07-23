import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './GalleryViewer.css'

const gallerySections = [
  [
    { title: 'Sunrise', description: 'A bold sunrise over the mountains.' },
    { title: 'Lake', description: 'A peaceful lake in the forest.' },
    { title: 'City Lights', description: 'A neon city night.' }
  ],
  [
    { title: 'Desert', description: 'Golden sand dunes.' },
    { title: 'Jungle', description: 'A lush green escape.' },
    { title: 'Ocean', description: 'Deep blue serenity.' }
  ]
]

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    filter: 'blur(20px)'
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    filter: 'blur(20px)',
    transition: { duration: 0.5, ease: 'easeIn' }
  })
}

export default function GalleryViewer() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef()

  const handleMouseMove = (e) => {
    const container = containerRef.current
    if (!container) return

    const { clientX, clientY } = e
    const { width, height, left, top } = container.getBoundingClientRect()
    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5

    // Clamp the range (max head look movement)
    const rotateY = x * 10 // left-right
    const rotateX = y * -1 // up-down

    container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`
    }
  }

  const handleNavigate = (dir) => {
    const newIndex = (index + dir + gallerySections.length) % gallerySections.length
    setDirection(dir)
    setIndex(newIndex)
  }

  return (
    <div className="flat-gallery-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <button className="nav-button left" onClick={() => handleNavigate(-1)}>&larr;</button>
      <div className="flat-gallery-container" ref={containerRef}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            className="flat-gallery"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {gallerySections[index].map((card, i) => (
              <motion.div
                className="flat-card"
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <button className="nav-button right" onClick={() => handleNavigate(1)}>&rarr;</button>
    </div>
  )
}
