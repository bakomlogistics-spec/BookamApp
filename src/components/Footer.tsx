import { Link } from "react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BOOKAM" className="h-8 w-8" />
              <span className="text-xl font-bold">BOOKAM</span>
            </div>
            <p className="text-sm text-emerald-200 leading-relaxed">
              Cameroon's most trusted real estate marketplace. Find your perfect home, office, or investment property.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search Properties</Link></li>
              <li><Link to="/search?listingType=rent" className="hover:text-white transition-colors">Rent</Link></li>
              <li><Link to="/search?listingType=sale" className="hover:text-white transition-colors">Buy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search?city=Douala" className="hover:text-white transition-colors">Douala</Link></li>
              <li><Link to="/search?city=Yaoundé" className="hover:text-white transition-colors">Yaoundé</Link></li>
              <li><Link to="/search?city=Buea" className="hover:text-white transition-colors">Buea</Link></li>
              <li><Link to="/search?city=Bamenda" className="hover:text-white transition-colors">Bamenda</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-300" />
                +237 6 77 88 99 00
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-300" />
                contact@bookam.cm
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-300 mt-0.5" />
                <span>Bonapriso, Douala, Cameroon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-10 pt-6 text-center text-sm text-emerald-300">
          <p>© {new Date().getFullYear()} BOOKAM. All rights reserved. Designed for Cameroon.</p>
        </div>
      </div>
    </footer>
  );
}
