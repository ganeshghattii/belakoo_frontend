import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

const CampusIconSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={58}
    height={58}
    fill="none"
    {...props}
  >
    <G fill="#740000" clipPath="url(#a)">
      <Path d="M29.002 30.898a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z" />
      <Path
        fillRule="evenodd"
        d="m46.1 24.026-15.2-7.6V11.9h11.4V.5H27.1v15.926l-15.2 7.6V30.9H4.3v22.8H.5v3.8h22.8V42.3h11.4v15.2h22.8v-3.8h-3.8V30.9h-7.6v-6.874ZM49.9 53.7v-19h-3.8v19h3.8Zm-38 0H8.1v-19h3.8v19Zm11.4-20.9a5.7 5.7 0 1 1 11.4 0 5.7 5.7 0 0 1-11.4 0Z"
        clipRule="evenodd"
      />
      <Path d="M30.902 57.502v-11.4h-3.8v11.4h3.8Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.5.5h57v57H.5z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default CampusIconSvg;
