import { Link } from "@tanstack/react-router";
import logoImg from "../../../public/images/nova-logo.png";
import phoneIcon from "../../../public/images/phone-icon.png";
import locationIcon from "../../../public/images/location-icon.png";
import emailIcon from "../../../public/images/email-icon.png";
import facebookIcon from "../../../public/images/facebook-icon.png";
import instagramIcon from "../../../public/images/instagram-icon.png";
import xIcon from "../../../public/images/x-icon.png";

export function Footer() {
  return (
    <footer className="bg-brand-navy pt-16 pb-0 font-montserrat">
      <div className="max-w-[1122px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div className="space-y-6 max-w-md">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={logoImg}
                alt="Nova Group"
                className="w-32.5 h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-white font-bold tracking-widest hidden sm:inline">
            NOVA GROUP
          </span> */}
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Nova Group E-Commerce: Empowering Dreams, Building Connections,
              and Creating Opportunities for Holistic Growth and Success
              Together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm text-white font-bold font-montserrat">
              <li>
                <Link
                  to="/"
                  className="hover:text-brand-blue-light transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <button className="hover:text-brand-blue-light transition-colors">
                  Support
                </button>
              </li>
              <li>
                <button className="hover:text-brand-blue-light transition-colors">
                  Academy
                </button>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="hover:text-brand-blue-light transition-colors"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-brand-blue-light transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="hover:text-brand-blue-light transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="hover:text-brand-blue-light transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="font-bold text-white">
            <h3 className=" font-bold mb-6 text-lg">Get in Touch</h3>
            <ul className="space-y-3 text-sm  mb-6">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 ">
                  <img src={phoneIcon} alt="" className="w-4" />
                </span>
                <span>+971 582 323 368</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 ">
                  <img src={locationIcon} alt="" className="w-4" />
                </span>
                <span>Silicon Oasis - Dubai - UAE</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 ">
                  <img src={emailIcon} alt="" className="w-4" />
                </span>
                <span>info@thenovagroupco.com</span>
              </li>
            </ul>

            <div className="flex items-center gap-4 text-text-secondary">
              <img src={facebookIcon} alt="" />
              <img src={instagramIcon} alt="" />
              <img src={xIcon} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full">
        <div className="bg-linear-to-r from-[#245d8f] to-[#163b63] px-4 sm:px-6 lg:px-8 py-4 text-center text-[11px] text-text-secondary">
          <p>
            © {new Date().getFullYear()} The Nova Group CO. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
