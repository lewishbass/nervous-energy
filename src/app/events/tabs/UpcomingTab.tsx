import InfoCard from '@/components/widgets/InfoCard';
import Image from 'next/image';
import { IoFastFood, IoFlashlight, IoShirt } from "react-icons/io5";
import { FaBottleWater, FaSocks } from "react-icons/fa6";
import { GiDuffelBag, GiSwissArmyKnife, GiRubberBoot, GiKneePad } from "react-icons/gi";

export default function UpcomingTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 tc1">Upcoming Events</h2>
      <div className="grid gap-4 mb-8">
        <InfoCard
          title="Thursday Links Trip"
          summary="Every week at Linx, as soon as the semester ends"
          image={'images/caving/cave-shirt.jpg'}
          className="w-full hidden"
          style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
        >
          <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
            <p>
              Going to Links cave on a trip led by George.
            </p>
            <p>
              Gonna be a big group, we&apos;ll see who actually shows up.<br />
              <b>George</b>, Payton, Sam, Fin, Jonathan, Shawn, Rose, Thomas and Me
            </p>
            <div className="bg-gradient-to-br from-white/60 dark:from-black/40 to-transparent rounded-lg p-4 mt-3 border border-blue-100 dark:border-blue-800/30 shadow-sm w-fit"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <h4 className="font-bold mb-2 flex items-center text-blue-400 dark:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span className='tc1'>Supplies Checklist</span> <span className="text-sm italic tc3 pl-3 opacity-50 font-normal">Pack in string sack</span>
              </h4>

              <ul className="space-y-2 relative pl-2">
                <div className="absolute left-2 -top-1 bottom-1 w-0.5 bg-blue-400 dark:bg-blue-700/50"></div>
                {[
                  { name: "Oatmeal Protein Bars", icon: <IoFastFood /> },
                  { name: "Water Bottle", icon: <FaBottleWater /> },
                  { name: "Flashlight", icon: <IoFlashlight /> },
                  { name: "Spare pants/shirt", icon: <IoShirt /> },
                  { name: "Survival grenade", icon: <GiDuffelBag /> },
                  { name: "Knife", icon: <GiSwissArmyKnife /> },
                  { name: "Phone in socks and plastic", icon: <FaSocks /> },
                  { name: "Wellies", icon: <GiRubberBoot /> },
                  { name: "Knee pads", icon: <GiKneePad /> },
                ].map((item, index) => (
                  <li key={index} className="group flex relative items-center select-none">
                    <div className='absolute w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-700 left-0.25 -translate-x-1/2 ' />
                    <div className="ml-0 w-4 group-hover:w-6 group-active:w-7 h-0.5 bg-blue-400 dark:bg-blue-700/50"
                      style={{ transition: "width 0.2s ease" }}></div>
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-400 dark:bg-blue-800/50 text-white mr-3 text-2xl relative z-10 p-1">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title={"CEED Summer Imagination Camp"}
          summary={`Starting: 2025-06-16 at Virginia Tech`}
          image={'/images/gilbert.jpg'}
          className="w-full hidden"
          style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
        >
          <div className="flex align-center space-x-4">
            <div className="relative tc2 max-w-[70%] space-y-4" >
              <Image
                src={'/images/CEED.svg'}
                alt={"CEED at VT"}
                width={500}
                height={300}
                className="float-right ml-4 mb-4 rounded-full w-1/3 bg-white/40 p-1"
                style={{ boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.2)' }}
              />
              <p>
                I will be working as a coordinator and instructor at the Imagination summer camps at VT this summer. Teaching kids about engineering and electronics with hands on projects.
              </p>
              <p>
                The Imagination Camp is a week-long sleep-away camp for rising 6th-8th graders hosted by Virginia Tech. Where kids can learn to solder, build and fly drones, launch rockets, program micro-controllers and more.
              </p>
              <p>
                The curriculum is designed and implemented mostly by students here at Virginia Tech, who gain experience in project management, teaching and mentoring.
              </p>
            </div>
            <div className="flex flex-grow flex-col items-center mt-4 space-y-4 px-4 py-6 text-white">
              <a href="https://eng.vt.edu/ceed/ceed-pre-college-programs/imagination.html" target="_blank" rel="noopener noreferrer" className="text-white-500 rounded-lg w-full text-center hover:brightness-120 hover:-translate-y-[1px]" onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'var(--khp)',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  transition: 'filter 0.2s ease-in-out, translate 0.2s ease-in-out',
                }}>
                More Information
              </a>
              <a href="https://admit.vt.edu/register/imagination" target="_blank" rel="noopener noreferrer" className="text-white-500 rounded-lg w-full text-center hover:brightness-120 hover:-translate-y-[1px]" onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'var(--kho)',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  transition: 'filter 0.2s ease-in-out, translate 0.2s ease-in-out',
                }}>
                Register
              </a>
            </div>
          </div>
        </InfoCard>

        <InfoCard
          title="Python Automation Course"
          summary="Feb 9 - Apr 22, 2026 | Mondays & Wednesdays 6-8pm"
          image={'/images/classes/Python-Automation.svg'}
          className="w-full"
          style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
        >
          <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
            <p>
              Teaching a beginner-friendly Python programming course focused on automation and practical scripting skills.
            </p>
            <p>
              The course covers Python fundamentals, data structures, file I/O, error handling, and building command-line tools. Perfect for anyone looking to automate repetitive tasks or learn their first programming language.
            </p>
            <p>
              <span className="font-semibold tc1">No prior programming experience required!</span> Just bring curiosity and a laptop.
            </p>
            <div className="mt-4">
              <a
                href="/classes/python-automation"
                className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View Course Details
              </a>
            </div>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}
