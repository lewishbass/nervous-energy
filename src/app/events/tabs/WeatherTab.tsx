import WeatherWidget from '@/components/widgets/WeatherWidget';
import StockWidget from '@/components/widgets/StockWidget';

export default function WeatherTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 tc1">Current Weather</h2>
      <WeatherWidget className="mb-6" />
      <StockWidget className="mb-6" />
    </div>
  );
}
