import { useIsFetching } from "@tanstack/react-query";

const TopProgressBar = () => {
  const isFetching = useIsFetching();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-0.5 transition-opacity duration-500 ${
        isFetching ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-full animate-[topbar-progress_1.5s_ease-in-out_infinite] bg-primary" />
    </div>
  );
};

export default TopProgressBar;
