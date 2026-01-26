import AboutHeader from '../components/AboutHeader'
import AboutContent from '../components/AboutContent'
import AboutFooter from '../components/AboutFooter'

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <AboutHeader />
      <div className="pt-20"></div>
      <AboutContent />
      <AboutFooter />
    </div>
  )
}
