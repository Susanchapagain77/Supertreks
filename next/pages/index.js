import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TrekCard from '../components/TrekCard'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function Home({ treks, testimonials }) {
  return (
    <div>
      <Head>
        <title>Super Treks — Himalayan Adventures</title>
        <meta name="description" content="Super Treks — handcrafted Himalayan treks and cultural tours" />
      </Head>

      <Header />
      <main>
        <Hero />

        <section className="section">
          <div className="section-header">
            <h2>Featured Treks & Tours</h2>
            <p>Handpicked adventures for every explorer</p>
          </div>
          <div className="trek-grid">
            {treks.map(t => (
              <motion.div key={t.id} layout>
                <TrekCard trek={t} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'next', 'data', 'data.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)

  return {
    props: {
      treks: data.treks || [],
      testimonials: data.testimonials || []
    }
  }
}
