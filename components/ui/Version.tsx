// components/ui/Version.tsx
import { VERSION_INFO } from "@/utils/version";

interface VersionProps {
  className?: string;
  showBuildDate?: boolean;
}

const Version: React.FC<VersionProps> = ({
  className = "",
  showBuildDate = false,
}) => {
  return (
    <div className={`flex-row align-middle space-x-2 ${className}`}>
      <p className="version-styles">v{VERSION_INFO.version}</p>
      <p className="update-date-styles">
        Last updated {VERSION_INFO.lastUpdated}
      </p>
      {showBuildDate && (
        <p className="update-date-styles">
          Built {new Date(VERSION_INFO.buildDate).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default Version;
