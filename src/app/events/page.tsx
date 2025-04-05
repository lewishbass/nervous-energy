// src/app/events/page.tsx

"use client";
import WeatherWidget from '@/components/widgets/WeatherWidget';
import InfoCard from '@/components/widgets/InfoCard';
import Image from 'next/image';
import { useState } from 'react';


import { MdOutlineSatelliteAlt } from "react-icons/md";
import { FaHistory, FaRegCalendarAlt, FaSocks } from "react-icons/fa";
import { FaBottleWater } from "react-icons/fa6";
//import { LuBird } from "react-icons/lu";
import { IoShirt, IoFastFood, IoFlashlight } from "react-icons/io5";
import { GiDuffelBag, GiSwissArmyKnife, GiRubberBoot, GiKneePad } from "react-icons/gi";




// @ts-expect-error jsx usage
export default function Events(): JSX.Element {
  // Add state for active tab
  const [activeTab, setActiveTab] = useState('weather');

  // Cave images for the James Cave card
  const caveImages = [
    '/images/caving/james 2-8-25/cave5.jpg',
    '/images/caving/james 2-8-25/cave4.jpg',
    '/images/caving/james 2-8-25/cave2.jpg',
    '/images/caving/james 2-8-25/cave3.jpg',
    '/images/caving/james 2-8-25/cave1.jpg',
  ];

  // Cave images for the New River Cave card
  const newRiverCaveImages = [
    '/images/caving/new river 5-4-24/cave5.jpg',
    '/images/caving/new river 5-4-24/cave4.jpg',
    '/images/caving/new river 5-4-24/cave3.jpg',
    '/images/caving/new river 5-4-24/cave2.jpg',
    '/images/caving/new river 5-4-24/cave1.jpg',
  ];

  // Bird images
  const birdImages = [
    '/images/birds/cardinal.jpg',
    '/images/birds/bluejay.jpg',
    '/images/birds/robin.jpg',
  ];

  // Tab styles
  const tabStyle = {
    base: "px-6 py-3 cursor-pointer transition-all mx-1 font-medium relative user-select-none overflow-hidden",
    active: "text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:animate-tabSlideIn after:transition-transform after:duration-300",
    inactive: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-100 rounded-t-lg after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-t-full after:scale-x-0 after:transition-transform after:duration-300"
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mb-200">
      <h1 className="text-4xl font-bold mb-6 tc1">Events</h1>

      {/* Tabs Navigation */}
      <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700 justify-start gap-1">
        <button
          onClick={() => setActiveTab('weather')}
          className={`${tabStyle.base} ${activeTab === 'weather' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="wg flex items-center">
            <MdOutlineSatelliteAlt className="w-5 h-5 mr-2" />
            Weather
          </span>
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`${tabStyle.base} ${activeTab === 'upcoming' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="wg flex items-center">
            <FaRegCalendarAlt className="w-5 h-5 mr-2" />
            Upcoming
          </span>
        </button>
        <button
          onClick={() => setActiveTab('previous')}
          className={`${tabStyle.base} ${activeTab === 'previous' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="rotate flex items-center">
            <FaHistory className="w-5 h-5 mr-2" />
            Previous
          </span>
        </button>
        {/*<button
          onClick={() => setActiveTab('birds')}
          className={`${tabStyle.base} ${activeTab === 'birds' ? tabStyle.active : tabStyle.inactive}`}
        >
          <span className="wg flex items-center">
            <LuBird className="w-5 h-5 mr-2" />
            Birds
          </span>
        </button>*/}
      </div>

      {/* Weather Widget Section */}
      {activeTab === 'weather' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tc1">Current Weather</h2>
          <WeatherWidget className="mb-6" />
        </div>
      )}

      {/* Upcoming Events Section */}
      {activeTab === 'upcoming' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tc1">Upcoming Events</h2>
          <div className="grid gap-4 mb-8">

            <InfoCard
              title="Thursday Links Cave"
              summary="Apr 10, 2025, going to links cave"
              image={'images/caving/cave-shirt.jpg'}
              className="w-full"
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
                    {/* Vertical line */}
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
                        {/* Horizontal branch line */}
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
              className="w-full"
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
          </div>
        </div>
      )}

      {/* Previous Events Section */}
      {activeTab === 'previous' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tc1">Previous Events</h2>
          <div className="grid gap-4">
            <InfoCard
              title="James Cave Expedition"
              summary="Feb 8, 2025, took Annabel caving for the first time"
              image={caveImages}
              className="w-full"
              style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
            >
              <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
                <p>
                  Annabel, Faith, Chris, Margo and I went to james cave at 11am, and were in there for about five hours.
                </p>
                <p>
                  The approach was <b className="tc1">cold</b> and <b className="tc1">wet</b> and <b className="tc1">COVERED</b> in cow manure. Once we got inside the cave things warmed up a bit, but there a lot of water to crawl through in the army crawl portion.
                </p>
                <p>
                  Annabel had a rough time with the tight spaces at the start, but made it through (although she did lose an expensive headlamp).
                </p>
                <p>
                  Made it almost all of the way to the end before we had to turn back for times sake.
                </p>
              </div>
            </InfoCard>

            <InfoCard
              title="New River Cave Expedition"
              summary="May 4, 2024, made it to the waterfall"
              image={newRiverCaveImages}
              className="w-full"
              style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
            >
              <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
                <p>
                  Left to Right Cole, Chris, Me, Faith, Margo and Penelope, went to New River Cave to see the waterfall (Cole gets cut off because he is a spy for Venture Out).
                </p>
                <p>
                  The approach was pretty scary, shuffling along a slippery a cliff face, clinging on to an old rope, with a <b className="tc1">HUGE</b> drop into the New River below.
                </p>
                <p>
                  Fait had their first time leading a trip as a full member of the VPI cave club and did an amazing job, we did&apos;t even get lost twice.
                </p>
                <p>
                  The waterfall chamber was made out of some beautiful knobby black stone. Once we all had our photo-op we turned off all the lights and listened to the waterfall for a while.
                </p>
              </div>
            </InfoCard>
          </div>
        </div>
      )}

      {/* Birds Section */}
      {activeTab === 'birds' && (
        <div>
          <h2 className="text-2xl font-bold mb-4 tc1">Bird Sightings</h2>
          <div className="grid gap-4">
            <InfoCard
              title="Northern Cardinal"
              summary="Spotted: April 12, 2025 - Backyard"
              image={birdImages[0]}
              className="w-full"
              style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
            >
              <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
                <p>
                  Spotted this vibrant male cardinal at the feeder early in the morning. The bright red plumage was stunning against the backdrop of spring foliage.
                </p>
                <p>
                  Cardinals are year-round residents in this area and are often one of the first birds to visit feeders in the morning.
                </p>
              </div>
            </InfoCard>

            <InfoCard
              title="Blue Jay"
              summary="Spotted: May 2, 2025 - Mountain Trail"
              image={birdImages[1]}
              className="w-full"
              style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
            >
              <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
                <p>
                  Observed a family of Blue Jays while hiking. Their loud calls alerted me to their presence before I could see them.
                </p>
                <p>
                  Blue Jays are known for their intelligence and complex social systems. They&apos;re part of the Corvid family, which includes crows and ravens.
                </p>
              </div>
            </InfoCard>

            <InfoCard
              title="American Robin"
              summary="Spotted: March 15, 2025 - Campus Lawn"
              image={birdImages[2]}
              className="w-full"
              style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
            >
              <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
                <p>
                  A sure sign of spring! Found this robin pulling worms from the ground after a light rain.
                </p>
                <p>
                  Robins are one of the most recognizable birds in North America. Their orange-red breast and cheerful song make them popular among birdwatchers.
                </p>
              </div>
            </InfoCard>
          </div>
        </div>
      )}
    </div>
  );
}