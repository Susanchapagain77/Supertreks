import Header from '../../components/Header'
import Footer from '../../components/Footer'
import TrekCard from '../../components/TrekCard'
import fs from 'fs'
import path from 'path'

export default function Packages({ treks }){
  return (
    <div>
      <Header />
      <main>
        <section className="section">
          <div className="section-header">
            <h2>All Packages</h2>
            <p>Choose your perfect Himalayan experience</p>
          </div>
          <div className="trek-grid">
            {treks.map(t => (
              <TrekCard key={t.id} trek={t} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticProps(){
  const filePath = path.join(process.cwd(), 'next', 'data', 'data.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  return { props: { treks: data.treks || [] } }
}
