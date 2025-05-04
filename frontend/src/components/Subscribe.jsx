import { Button } from "./ui/button"
import FadeIn from "./FadeIn"
import { Bell, ArrowRight, Mail, CheckCircle } from "lucide-react"
import { useState } from "react"

function Subscribe() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail("")
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="w-full mx-auto flex items-center justify-center mb-20 mt-10 px-4">
      <div className="relative w-full max-w-6xl bg-gradient-to-br from-[#0A1F15] to-[#071f14] rounded-3xl overflow-hidden z-10">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-[#2FB574]/10 blur-[60px]"></div>
          <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-[#2FB574]/10 blur-[80px]"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full grid grid-cols-10 gap-2">
              {Array(30).fill().map((_, i) => (
                <div key={i} className="h-8 rounded-sm bg-[#2FB574]/30"></div>
              ))}
            </div>
          </div>
          
          {/* Code pattern */}
          <div className="absolute bottom-5 right-5 opacity-20 font-mono text-xs text-[#2FB574]">
            <pre>{`function subscribe(address _user) public {
  require(!isSubscribed[_user], "Already subscribed");
  subscribers.push(_user);
  isSubscribed[_user] = true;
  emit NewSubscriber(_user);
}`}</pre>
          </div>
        </div>
        
        <div className="relative grid md:grid-cols-5 gap-8 md:gap-4 p-8 md:p-12 items-center">
          {/* Content */}
          <div className="md:col-span-3 space-y-6">
            <FadeIn direction="up" delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2FB574]/10 border border-[#2FB574]/30 mb-2">
                <Bell className="h-4 w-4 text-[#2FB574]" />
                <span className="text-[#2FB574] font-medium text-sm">Stay In The Loop</span>
              </div>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.3}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Never Miss <span className="text-[#2FB574]">Pharovest</span> Updates
              </h2>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.4}>
              <p className="text-gray-300 md:text-lg">
                Get notified about new projects, investment opportunities, and platform features. Join our community of forward-thinking investors and creators.
              </p>
            </FadeIn>
            
            <FadeIn direction="up" delay={0.5}>
              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#2FB574]/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-[#2FB574]" />
                  </div>
                  <span className="text-gray-300 text-sm">Weekly digest of top projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#2FB574]/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-[#2FB574]" />
                  </div>
                  <span className="text-gray-300 text-sm">Early access to new features</span>
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Form */}
          <div className="md:col-span-2">
            <FadeIn direction="up" delay={0.6}>
              <form onSubmit={handleSubmit} className="bg-[#05140D]/60 backdrop-blur-sm p-6 rounded-xl border border-[#2FB574]/20">
                <div className="space-y-4">
                  <label htmlFor="email" className="block text-[#2FB574] font-medium mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 py-3 bg-[#071f14] border border-[#2FB574]/20 rounded-lg text-white focus:ring-[#2FB574] focus:border-[#2FB574] outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || !email}
                    variant="custom"
                    className="w-full py-6 group flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : isSubscribed ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Subscribed!
                      </>
                    ) : (
                      <>
                        Subscribe to Updates
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-gray-400 text-xs text-center mt-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscribe
