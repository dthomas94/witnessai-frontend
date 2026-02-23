import { Spinner } from "@radix-ui/themes";

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Spinner size="3" />
      <h1>Loading...</h1>
    </div>
  );
}
