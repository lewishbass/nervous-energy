// events/page.tsx

"use client";
import WeatherWidget from '@/components/widgets/WeatherWidget';
import InfoCard from '@/components/widgets/InfoCard';
import Image from 'next/image';


// @ts-expect-error jsx usage
export default function Events(): JSX.Element {

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 tc1">Events</h1>

      {/* Weather Widget Component */}
      <WeatherWidget className="mb-6" />

      <div className="grid gap-4">
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
  );
}