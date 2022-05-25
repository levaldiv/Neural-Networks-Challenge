// defining lerp (linerar interpolation)
function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bott = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bott != 0) {
    const t = tTop / bott;
    const u = uTop / bott;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polysIntersect(p1, p2) {
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      const touch = getIntersection(
        p1[i], // one point in the polygon
        p1[(i + 1) % p1.length], // last point in polygon needs to connect to the first point in the polygon
        p2[j],
        p2[(j + 1) % p2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255; // dont want any red otherwise max amt of red
  const G = R; // red + green = yellow
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

// random colors
function getRandomColors() {
  const hue = 290 + Math.random() * 260;

  return "hsl(" + hue + ", 100%, 60%)";
}
