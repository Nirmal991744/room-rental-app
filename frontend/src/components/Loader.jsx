import React from "react";
import { Spinner } from "flowbite-react";

function Loader() {
  return (
    <div className="flex flex-wrap gap-2">
      <Spinner color="purple" aria-label="Purple spinner example" />
    </div>
  );
}

export default Loader;
