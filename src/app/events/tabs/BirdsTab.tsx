import InfoCard from '@/components/widgets/InfoCard';

export default function BirdsTab() {
  const birdImages = [
    '/images/birds/cardinal.jpg',
    '/images/birds/bluejay.jpg',
    '/images/birds/robin.jpg',
  ];

  return (
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
  );
}
