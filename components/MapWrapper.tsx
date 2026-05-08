import dynamic from "next/dynamic";
import { Location, FlyToTarget } from "@/types";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
        <span className="text-sm">Kaart laden…</span>
      </div>
    </div>
  ),
});

interface Props {
  locations: Location[];
  flyTo: FlyToTarget;
  onLocationSelect: (loc: Location) => void;
}

export default function MapWrapper(props: Props) {
  return <MapComponent {...props} />;
}
