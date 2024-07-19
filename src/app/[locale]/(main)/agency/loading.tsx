import { LoadingSpinner } from "@/components/modules/loading-spinner";

/**
 * LoadingAgencyPage
 * @components
 * @version 1.0.0
 *
 * @returns The loading agency page
 */
const LoadingAgencyPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
};

export default LoadingAgencyPage;
