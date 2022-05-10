import React from "react";
import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";

const DefaultCatchBoundaryPage = () => {
  return <>This shouldn't load</>;
};

export const loader = () => {
  throw new Response("An example caught exception", { status: 500 });
};

export const CatchBoundary = DefaultCatchBoundary;

export default DefaultCatchBoundaryPage;
