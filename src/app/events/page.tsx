// src/app/events/page.tsx

"use client";
import WeatherWidget from '@/components/widgets/WeatherWidget';
import InfoCard from '@/components/widgets/InfoCard';
import Image from 'next/image';


// @ts-expect-error jsx usage
export default function Events(): JSX.Element {

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

  return (
    <div className="p-6 max-w-4xl mx-auto mb-200">
      <h1 className="text-4xl font-bold mb-6 tc1">Events</h1>

      {/* Weather Widget Component */}
      <WeatherWidget className="mb-6" />

      {/* Upcoming Events Section */}
      <h2 className="text-2xl font-bold mb-4 tc1">Upcoming Events</h2>
      <div className="grid gap-4 mb-8">
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

      {/* Previous Events Section */}
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
  );
}