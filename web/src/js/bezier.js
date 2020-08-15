function bezier(start, a, b, end) {
  const points = [start, a, b, end];
  const count = 100;
  const curve = () => {
    return new Array(count).fill(0).map((_, i) => {
      const t = i / (count - 1);
      const t1 = Math.pow(1 - t, 3);
      const t2 = 3.0 * Math.pow(1 - t, 2) * t;
      const t3 = 3.0 * (1 - t) * Math.pow(t, 2);
      const t4 = Math.pow(t, 3);
      const x = start[0] * t1 + a[0] * t2 + b[0] * t3 + end[0] * t4;
      const y = start[1] * t1 + a[1] * t2 + b[1] * t3 + end[1] * t4;
      const z = start[2] * t1 + a[2] * t2 + b[2] * t3 + end[2] * t4;
      console.log(x, y, z);
      return [x, y, z];
    });
  };
  return {
    points: [start, a, b, end],
    curve: curve()
  };
}

module.exports = bezier;
