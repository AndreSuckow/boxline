export default function PostalBox({ size }: { size: readonly number[] }) {
  const [length, depth, height] = size;
  const width = length * 6;
  const side = depth * 3;
  const rise = depth * 1.5;
  const slope = width * 0.14;
  const tall = height * 6;
  const totalWidth = width + side;
  const totalHeight = rise + slope + tall;
  const front = rise;
  return (
    <svg
      className="postal-box-art"
      viewBox={[-16, -16, totalWidth + 32, totalHeight + 32].join(" ")}
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points={`0,${front} ${side},0 ${totalWidth},${slope} ${width},${front + slope}`}
        fill="#c2a477"
      />
      <polygon
        points={`${width * 0.43},${front + slope * 0.43} ${width * 0.43 + side},${slope * 0.43} ${width * 0.57 + side},${slope * 0.57} ${width * 0.57},${front + slope * 0.57}`}
        fill="#d6bc94"
      />
      <polygon
        points={`0,${front} ${width},${front + slope} ${width},${front + slope + tall} 0,${front + tall}`}
        fill="#bd9b70"
      />
      <polygon
        points={`${width},${front + slope} ${totalWidth},${slope} ${totalWidth},${slope + tall} ${width},${front + slope + tall}`}
        fill="#987346"
      />
      <image
        preserveAspectRatio="xMidYMid meet"
        href={
          (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/brands/correios-fit.svg"
        }
        x={width * 0.12}
        y={tall * 0.2}
        width={width * 0.76}
        height={tall * 0.6}
        transform={`matrix(1 .14 0 1 0 ${front})`}
      />
    </svg>
  );
}
