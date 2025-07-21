
import React from 'react';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <MessageCircle className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Contact</span> Us
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Get in touch with our team for support, partnerships, or any questions about ODDSBOOK.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          <div className="premium-card p-8 text-center">
            <Phone className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
            <p className="text-gray-300 text-sm mb-4">Call us directly</p>
            <p className="text-white font-semibold">+1 (555) 123-4567</p>
          </div>

          <div className="premium-card p-8 text-center">
            <Mail className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
            <p className="text-gray-300 text-sm mb-4">Send us an email</p>
            <p className="text-white font-semibold">support@oddsbook.com</p>
          </div>

          <div className="premium-card p-8 text-center">
            <MessageCircle className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
            <p className="text-gray-300 text-sm mb-4">Chat with our team</p>
            <Button size="sm" className="bg-gradient-primary hover:bg-gradient-hover text-white">
              Start Chat
            </Button>
          </div>

          <div className="premium-card p-8 text-center">
            <MapPin className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Office</h3>
            <p className="text-gray-300 text-sm mb-4">Visit our headquarters</p>
            <p className="text-white font-semibold text-xs">New York, NY 10001</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-white text-sm font-semibold mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-white text-sm font-semibold mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-white text-sm font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white text-sm font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-primary hover:bg-gradient-hover text-white font-semibold py-4"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
