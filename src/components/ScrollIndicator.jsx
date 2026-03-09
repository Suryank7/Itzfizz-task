import { useScrollMotion } from '@/hooks/useScrollMotion';

export default function ScrollIndicator() {
  const { rawProgress } = useScrollMotion(true);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-900/50">
      <div 
        className="h-full bg-highlight transform origin-left transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${rawProgress})` }}
      />
    </div>
  );
}
