import Header from '@/components/site/Header'
import Hero from '@/components/site/Hero'
import RoomsPreview from '@/components/site/RoomsPreview'
import AboutPreview from '@/components/site/AboutPreview'
import GalleryPreview from '@/components/site/GalleryPreview'
import LocationSection from '@/components/site/LocationSection'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <RoomsPreview />
      <AboutPreview />
      <GalleryPreview />
      <LocationSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}

