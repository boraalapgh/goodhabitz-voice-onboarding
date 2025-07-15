'use client'

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'

export const Waveform: React.FC = () => {
  const waves = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    offset: Math.random() * 60 - 30,
    phase: Math.random() * Math.PI
  }))

  const createWavePath = useCallback((baseOffset: number, waveIndex: number) => {
    // Create random control points for more dramatic movement
    const randomize = (base: number) => base + (Math.random() - 0.5) * 80
    
    const cp1x = 200 + randomize(0)
    const cp2x = 300 + randomize(0)
    const cp3x = 400 + randomize(0)
    const cp4x = 500 + randomize(0)
    const cp5x = 600 + randomize(0)

    const offset = baseOffset * Math.sin(waves[waveIndex].phase)
    const centerY = 200
    
    return `M 0 ${centerY} 
            C ${cp1x} ${centerY + randomize(0)}, ${cp2x} ${centerY + offset + randomize(0)}, ${cp3x} ${centerY + offset + randomize(0)}
            C ${cp4x} ${centerY + offset + randomize(0)}, ${cp5x} ${centerY + randomize(0)}, 800 ${centerY}`
  }, [waves])

  return (
    <div className="relative w-[800px] h-[40vh] overflow-hidden">
      {/* Waves */}
      {waves.map((wave, waveIndex) => (
        <motion.svg
          key={wave.id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3 + Math.random(),
            repeat: Infinity,
            delay: waveIndex * 0.2,
          }}
        >
          <motion.path
            initial={{ d: createWavePath(0, waveIndex) }}
            animate={{
              d: [
                createWavePath(0, waveIndex),
                createWavePath(80, waveIndex),
                createWavePath(0, waveIndex),
                createWavePath(-80, waveIndex),
                createWavePath(0, waveIndex)
              ]
            }}
            transition={{
              duration: 4 + waveIndex * 0.5 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut"
            }}
            fill="none"
            stroke="rgba(123, 91, 255, 0.3)"
            strokeWidth={2}
          />
        </motion.svg>
      ))}

      {/* Particles for sparkle effect */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400/20"
          initial={{
            x: Math.random() * 800,
            y: Math.random() * 400,
            scale: 0
          }}
          animate={{
            y: [
              Math.random() * 400,
              Math.random() * 400 - 40,
              Math.random() * 400
            ],
            scale: [0, 1, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 3 + Math.random(),
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
} 