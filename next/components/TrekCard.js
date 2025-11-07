import Link from 'next/link'
import Image from 'next/image'

export default function TrekCard({ trek }){
  return (
    <article className="trek-card">
      <div className="trek-image-container">
        <Image src={trek.image} alt={trek.title} width={800} height={480} style={{objectFit:'cover'}} />
      </div>
      <div className="trek-content">
        <h3 className="trek-title"><Link href={`/treks/${trek.id}`}>{trek.title}</Link></h3>
        <p className="trek-description">{trek.description}</p>
        <div className="trek-meta">
          <span>📅 {trek.duration} days</span>
          <span>⛰️ {trek.difficulty}</span>
          <span className="rating">⭐ {trek.rating}</span>
        </div>
        <div className="trek-footer">
          <div className="trek-price">${trek.price} <span>/ person</span></div>
          <Link href={`/treks/${trek.id}`} className="view-details">View Details →</Link>
        </div>
      </div>
    </article>
  )
}
