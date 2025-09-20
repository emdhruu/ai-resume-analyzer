import Link from 'next/link';
import React from 'react'

const Header = () => {
  return (
     <div className="flex justify-between items-center">
      <div className="text-2xl">
        <span>ResumeAnalysis</span>
        <span className="text-teal-900">.ai</span>
      </div>
      <Link href="/analyzer" className="border border-teal-700 font-extralight text-teal-700 px-3 py-1 rounded-full hover:bg-teal-700 hover:text-white hover:cursor-pointer transition">
         Quick Start
      </Link>
      </div>
  )
}

export default Header