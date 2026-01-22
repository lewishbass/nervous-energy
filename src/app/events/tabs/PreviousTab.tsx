import InfoCard from '@/components/widgets/InfoCard';

export default function PreviousTab() {
  const caveImages = [
    '/images/caving/james 2-8-25/cave5.jpg',
    '/images/caving/james 2-8-25/cave4.jpg',
    '/images/caving/james 2-8-25/cave2.jpg',
    '/images/caving/james 2-8-25/cave3.jpg',
    '/images/caving/james 2-8-25/cave1.jpg',
  ];

  const newRiverCaveImages = [
    '/images/caving/new river 5-4-24/cave5.jpg',
    '/images/caving/new river 5-4-24/cave4.jpg',
    '/images/caving/new river 5-4-24/cave3.jpg',
    '/images/caving/new river 5-4-24/cave2.jpg',
    '/images/caving/new river 5-4-24/cave1.jpg',
  ];

  const linxCaveImages = [
    '/images/caving/linx-4-10-25/cave13.jpg',
    '/images/caving/linx-4-10-25/cave12.jpg',
    '/images/caving/linx-4-10-25/cave11.jpg',
    '/images/caving/linx-4-10-25/cave10.jpg',
    '/images/caving/linx-4-10-25/cave9.jpg',
    '/images/caving/linx-4-10-25/cave8.jpg',
    '/images/caving/linx-4-10-25/cave7.jpg',
    '/images/caving/linx-4-10-25/cave6.jpg',
    '/images/caving/linx-4-10-25/cave5.jpg',
    '/images/caving/linx-4-10-25/cave4.jpg',
    '/images/caving/linx-4-10-25/cave3.jpg',
    '/images/caving/linx-4-10-25/cave2.jpg',
    '/images/caving/linx-4-10-25/cave1.jpg',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 tc1">Previous Events</h2>
      <div className="grid gap-4">
        <InfoCard
          title="Thursday Links Trip"
          summary="Apr 10, 2025, George led his first trip to Links cave"
          image={linxCaveImages}
          className="w-full"
          style={{ boxShadow: 'inset 0 0 8px 1px #0002' }}
        >
          <div className="relative tc2 max-w-[95%] space-y-4 mb-6">
            <p>
              Going to Links cave on a trip led by George.
            </p>
            <p>
              Gonna be a big group, we&apos;ll see who actually shows up.<br />
              <b>George</b>, Case, Fin, Sean, Katie, Sam, Payton and Me <br />
              Lots of fun canyoning, lots of big spiders, two bats and a salamander.<br />
            </p>
          </div>
        </InfoCard>

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
