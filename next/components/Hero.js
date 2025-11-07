import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero(){
  const ref = useRef()
  useEffect(()=>{
    const el = ref.current
    gsap.fromTo(el, {opacity:0, y:40}, {opacity:1, y:0, duration:1.2})
  },[])

  return (
    <section className="hero" ref={ref}>
      <div className="hero-slider">
        <div className="hero-slide active">
          <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920" alt="mountains" fill style={{objectFit:'cover'}} priority />
        </div>
      </div>
      <div className="hero-content">
        <h1>Infinite Adventures Await</h1>
        <p>Treks, Tours & Expeditions Across Nepal, Bhutan & Beyond</p>
      </div>
    </section>
  )
}
