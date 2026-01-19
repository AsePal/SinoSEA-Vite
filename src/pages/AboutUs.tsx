import AboutHeader from '../AboutUs/AboutHeader'
import AboutContent from '../AboutUs/AboutContent'
import AboutFooter from '../AboutUs/AboutFooter'

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
