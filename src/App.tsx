import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from './images/background.jpg';

function ContactForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    try {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ip = ipResponse.data.ip;

const TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

      const telegramMessage = `
        <b>New Message from Contact Form:</b>\n
        <b>Name:</b> ${name}\n
        <b>Email:</b> ${email}\n
        <b>Message:</b> ${message}\n
        <b>IP Address:</b> ${ip}\n
        <b>>Device Type:</b> ${/mobile/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'}\n
        <b>Platform:</b> ${navigator.platform}\n
        <b>Browser:</b> ${navigator.userAgent}\n
        <b>Screen Resolution:</b> ${screen.width}x${screen.height}
      `;

      await axios.post(URI_API, {
        chat_id: CHAT_ID,
        parse_mode: 'html',
        text: telegramMessage
      });

      toast.success('Message sent successfully! 🚀', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again 😔', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 glass-effect p-8 rounded-xl">
      <div>
        <input 
          type="text" 
          name="name"
          placeholder="your name"
          required
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <input 
          type="email" 
          name="email"
          placeholder="Email"
          required
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <textarea 
          name="message"
          placeholder="your message"
          required
          rows={6}
          className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        ></textarea>
      </div>
      <button 
        type="submit"
        className="w-full bg-blue-600/80 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300"
      >
        Send message
      </button>
    </form>
  );
}

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const show = window.scrollY >= aboutSection.offsetTop;
        setShowScrollTop(show);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <ToastContainer />
      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Welcome To <span className="logocolor">Expandaa</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up">
              Front End <span className='logocolor'>Developer</span>
            </p>
            <div className="flex justify-center gap-4">
              <a href="#contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition duration-300">
              Contact me
              </a>
              <a href="#portfolio" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition duration-300">
                My Projects 
              </a>
            </div>
          </div>
        </div>
      </header>
    
      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-right">
                <div className="relative pl-8 pr-4 py-6 border-r-4 border-blue-500 bg-gray-800/50 rounded-lg">
                <span className="absolute text-6xl text-blue-500/20 font-serif left-4 top-0">"</span>
                <p className="text-gray-300 text-lg leading-relaxed italic">
                  Front-End Developer with a passion for crafting visually stunning and user-friendly experiences. Turning creative ideas into reality, blending innovation with aesthetics to make the web magical!
                </p>
                <span className="absolute text-6xl text-blue-500/20 font-serif right-4 bottom-0">"</span>
                </div>
              <div className="flex justify-end gap-4">
                <a href="https://github.com/expandaa" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/expandaa" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-6 rounded-lg">
                <User className="text-blue-500 mb-4" size={32} />
                <h3 className="text-white text-xl mb-2">Experience</h3>
                <p className="text-gray-400">+1 Years</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <Code className="text-green-500 mb-4" size={32} />
                <h3 className="text-white text-xl mb-2">Projects</h3>
                <p className="text-gray-400">+6 Project</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <Briefcase className="text-yellow-500 mb-4" size={32} />
                <h3 className="text-white text-xl mb-2">Clients</h3>
                <p className="text-gray-400">+3 Client</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <GraduationCap className="text-purple-500 mb-4" size={32} />
                <h3 className="text-white text-xl mb-2">Certificates</h3>
                <p className="text-gray-400">+1 Certificate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">My Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Project 1 */}
        <div className="group relative overflow-hidden rounded-lg">
          <img 
            src="https://raw.githubusercontent.com/expandaa/ai_chat_wamdha/refs/heads/main/Untitled%20design.jpg" 
            alt="project1"
            className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">ai_chat_wamdha</h3>
          <p className="text-gray-300 mb-4">ai chat design</p>
          <a href="https://expandaa.github.io/ai_chat_wamdha/" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            Live Demo<ExternalLink size={16} className="ml-2" />
          </a>
            </div>
          </div>
        </div>

        {/* Project 2 */}
        <div className="group relative overflow-hidden rounded-lg">
          <img 
            src="https://beobeosan.github.io/Portfolio/assets/images/slid.png" 
            alt="project2"
            className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">Design Slider </h3>
          <p className="text-gray-300 mb-4">HTML CSS JS only</p>
          <a href="https://expandaa.github.io/web-slide/" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            Live Demo<ExternalLink size={16} className="ml-2" />
          </a>
            </div>
          </div>
        </div>

        {/* Add more projects by copying the div structure above */}

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Contact me</h2>
          <div className="max-w-md mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <img 
            src="https://beobeosan.github.io/Portfolio/assets/images/scroll.png" 
            alt="Scroll to top" 
            className="w-10 h-10 object-contain"
          />
        </button>
      )}
    </div>
  );
}

export default App;
