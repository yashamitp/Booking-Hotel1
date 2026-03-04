import React from "react";
import { assets } from "../assets/assets";

function StarRating({rating=4}) {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <img className="h-4.5 w-4.5" src={rating>index ?assets.starIconFilled:assets.starIconOutlined} alt="icon" />
        ))}
    </>
  );
}

export default StarRating;
