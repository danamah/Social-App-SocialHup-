import logo from '../../assets/images/network-hub.png'
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoVercel } from "react-icons/io5";
import { SiFrontendmentor } from "react-icons/si";

export default function Footer() {
  return (
    <>
      <footer className="bg-stone-950">
        <div className="mx-auto w-full max-w-7xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-center">
            <div className="mb-6 md:mb-0">
              <a href="https://flowbite.com/" className="flex items-center">
                <img src={logo} className="w-10 me-3" alt="FlowBite Logo" />
                <span className="text-heading self-center text-2xl font-bold whitespace-nowrap text-stone-50">SocialHub</span>
              </a>
            </div>
          </div>
          <hr className="my-6 border-default sm:mx-auto lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between container text-stone-50">
            <span className="text-sm text-body sm:text-center">© 2026 <a href="#" className="hover:underline">SocialHub™</a>. All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a href="https://github.com/danamah" className="text-body hover:text-heading ms-5">
                <FaGithub className='text-2xl hover:text-[#4078c0] transition-colors duration-300'/>
                <span className="sr-only">GitHub account</span>
              </a>
              <a href="https://www.linkedin.com/in/dana-mahmoud-2615731b5/" className="text-body hover:text-heading ms-5">
                <FaLinkedin className='text-2xl hover:text-[#0a66c2] transition-colors duration-300'/>
                <span className="sr-only">Linkedin</span>
              </a>
              <a href="https://vercel.com/dana-mahmouds-projects" className="text-body hover:text-heading ms-5">
                <IoLogoVercel className='text-2xl hover:text-[#c8aa76] transition-colors duration-300'/>
                <span className="sr-only">Vercel</span>
              </a>
              <a href="https://www.frontendmentor.io/profile/danamah" className="text-body hover:text-heading ms-5">
                <SiFrontendmentor className='text-2xl hover:text-[#ff6c5f] transition-colors duration-300'/>
                <span className="sr-only">Frontend Mentor</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

