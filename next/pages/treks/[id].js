import Header from '../../components/Header'
import Footer from '../../components/Footer'
import fs from 'fs'
import path from 'path'
import Image from 'next/image'

export default function TrekDetail({ trek }){
  if(!trek) return <div>Not found</div>
  return (
    <div>
      <Header />
      <main className="section">
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <h1 style={{fontFamily:'Playfair Display, serif'}}>{trek.title}</h1>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:32, marginTop:24}}>
            <div>
              <Image src={trek.image} width={1200} height={600} alt={trek.title} style={{borderRadius:12}} />
              <h2>Overview</h2>
              <p>{trek.overview || trek.description}</p>
              <h3>Included</h3>
              <ul>{(trek.included||[]).map((i,idx)=> <li key={idx}>{i}</li>)}</ul>
            </div>
            <aside>
              <div className="booking-widget">
                <div className="widget-title">Book This Trek</div>
                <div className="widget-price">${trek.price} <span>/ person</span></div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export async function getStaticPaths(){
  const filePath = path.join(process.cwd(), 'next', 'data', 'data.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  const paths = (data.treks||[]).map(t => ({ params: { id: String(t.id) } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }){
  const filePath = path.join(process.cwd(), 'next', 'data', 'data.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(raw)
  const trek = (data.treks||[]).find(t => String(t.id) === params.id) || null
  return { props: { trek } }
}
