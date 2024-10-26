import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
const DoneIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={10}
    fill="none"
    {...props}
  >
    <Circle cx={5} cy={5} r={5} fill="#169331" />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1.668 5.554 3.612 7.5l3.89-4.167"
    />
  </Svg>
)
export default DoneIcon
