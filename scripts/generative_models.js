const COLORS = {
  blue: '#00d7ff',
  orange: '#ffb347',
  green: '#55efc4',
  purple: '#b6a6ff',
  amber: '#ffd166',
  grid: 'rgba(192, 192, 192, 0.16)',
  text: '#e0e0e0'
};

function normal(x, m, s) {
  return Math.exp(-0.5 * ((x - m) / s) ** 2) / (Math.sqrt(2 * Math.PI) * s);
}

const mix = [
  { w: 0.36, m: -2.2, s: 0.55 },
  { w: 0.28, m: 0.3, s: 0.38 },
  { w: 0.36, m: 2.35, s: 0.75 }
];

function marginal(y, sigma, alpha = 1) {
  return mix.reduce((a, c) => a + c.w * normal(y, alpha * c.m, Math.sqrt((alpha * c.s) ** 2 + sigma * sigma)), 0);
}

function score(y, sigma, alpha = 1) {
  let p = 0;
  let dp = 0;
  for (const c of mix) {
    const v = (alpha * c.s) ** 2 + sigma * sigma;
    const sd = Math.sqrt(v);
    const comp = c.w * normal(y, alpha * c.m, sd);
    p += comp;
    dp += comp * (-(y - alpha * c.m) / v);
  }
  return dp / (p + 1e-12);
}

function postMean(y, sigma, alpha = 1) {
  let p = 0;
  let num = 0;
  for (const c of mix) {
    const v = (alpha * c.s) ** 2 + sigma * sigma;
    const sd = Math.sqrt(v);
    const comp = c.w * normal(y, alpha * c.m, sd);
    const mpost = c.m + (alpha * c.s * c.s / v) * (y - alpha * c.m);
    p += comp;
    num += comp * mpost;
  }
  return num / (p + 1e-12);
}

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

function axes(ctx, w, h, xmin, xmax, ymin, ymax) {
  const pad = { l: 48, r: 18, t: 18, b: 36 };
  const X = x => pad.l + (x - xmin) / (xmax - xmin) * (w - pad.l - pad.r);
  const Y = y => h - pad.b - (y - ymin) / (ymax - ymin) * (h - pad.t - pad.b);
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = COLORS.text;
  ctx.font = '12px Inter, Arial, sans-serif';
  for (let i = 0; i <= 6; i++) {
    const x = xmin + i * (xmax - xmin) / 6;
    ctx.beginPath();
    ctx.moveTo(X(x), pad.t);
    ctx.lineTo(X(x), h - pad.b);
    ctx.stroke();
    ctx.fillText(x.toFixed(1), X(x) - 10, h - 13);
  }
  for (let j = 0; j <= 4; j++) {
    const y = ymin + j * (ymax - ymin) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.l, Y(y));
    ctx.lineTo(w - pad.r, Y(y));
    ctx.stroke();
    ctx.fillText(y.toFixed(2), 6, Y(y) + 4);
  }
  ctx.strokeStyle = 'rgba(212, 212, 212, 0.55)';
  ctx.beginPath();
  ctx.moveTo(pad.l, Y(0));
  ctx.lineTo(w - pad.r, Y(0));
  ctx.stroke();
  return { X, Y, pad };
}

function line(ctx, pts, X, Y, color, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) {
      ctx.moveTo(X(p[0]), Y(p[1]));
    } else {
      ctx.lineTo(X(p[0]), Y(p[1]));
    }
  });
  ctx.stroke();
}

function drawTweedie() {
  const sigma = parseFloat(document.getElementById('sigma').value);
  const obs = parseFloat(document.getElementById('obs').value);
  document.getElementById('sigVal').textContent = sigma.toFixed(2);
  document.getElementById('obsVal').textContent = obs.toFixed(2);
  const { ctx, w, h } = setupCanvas(document.getElementById('plotTweedie'));
  const xs = [];
  let maxp = 0;
  let maxs = 0;
  for (let i = 0; i < 500; i++) {
    const x = -6 + 12 * i / 499;
    const p = marginal(x, sigma, 1);
    const s = score(x, sigma, 1);
    xs.push([x, p, s]);
    maxp = Math.max(maxp, p);
    maxs = Math.max(maxs, Math.abs(s));
  }
  const scScale = maxp / (maxs || 1) * 0.85;
  const ax = axes(ctx, w, h, -6, 6, -maxp * 0.45, maxp * 1.15);
  line(ctx, xs.map(d => [d[0], d[1]]), ax.X, ax.Y, COLORS.blue, 2.5);
  line(ctx, xs.map(d => [d[0], d[2] * scScale]), ax.X, ax.Y, COLORS.orange, 2);
  const pm = postMean(obs, sigma, 1);
  const tw = obs + sigma * sigma * score(obs, sigma, 1);
  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ax.X(pm), ax.Y(-maxp * 0.38));
  ctx.lineTo(ax.X(pm), ax.Y(maxp * 0.95));
  ctx.stroke();
  ctx.strokeStyle = COLORS.purple;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(ax.X(obs), ax.Y(-maxp * 0.38));
  ctx.lineTo(ax.X(obs), ax.Y(maxp * 0.95));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = COLORS.text;
  ctx.fillText('posterior mean', ax.X(pm) + 6, ax.Y(maxp * 0.9));
  ctx.fillText('observed y', ax.X(obs) + 6, ax.Y(maxp * 0.75));
  document.getElementById('twRead').innerHTML = `At y=${obs.toFixed(2)}, sigma=${sigma.toFixed(2)}: score s(y)=${score(obs, sigma, 1).toFixed(3)}, Tweedie y+sigma^2 s(y)=${tw.toFixed(3)}, direct posterior mean=${pm.toFixed(3)}.`;
}

function drawParam() {
  const t = parseFloat(document.getElementById('timeParam').value);
  const xt = parseFloat(document.getElementById('xtParam').value);
  const alpha = Math.cos(Math.PI * t / 2);
  const sigma = Math.sin(Math.PI * t / 2);
  const s = score(xt, sigma, alpha);
  const x0 = (xt + sigma * sigma * s) / alpha;
  const eps = -sigma * s;
  const v = alpha * eps - sigma * x0;
  document.getElementById('tVal').textContent = t.toFixed(3);
  document.getElementById('xtVal').textContent = xt.toFixed(2);
  const { ctx, w, h } = setupCanvas(document.getElementById('plotParam'));
  const xs = [];
  let maxp = 0;
  for (let i = 0; i < 500; i++) {
    const x = -6 + 12 * i / 499;
    const p = marginal(x, sigma, alpha);
    xs.push([x, p]);
    maxp = Math.max(maxp, p);
  }
  const ax = axes(ctx, w, h, -6, 6, -maxp * 0.2, maxp * 1.15);
  line(ctx, xs, ax.X, ax.Y, COLORS.blue, 2.5);
  for (const [val, col, label] of [
    [xt, COLORS.purple, 'x_t'],
    [x0, COLORS.green, 'x0 pred'],
    [eps, COLORS.orange, 'eps pred'],
    [v, COLORS.amber, 'v pred']
  ]) {
    const clamped = Math.max(-6, Math.min(6, val));
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax.X(clamped), ax.Y(-maxp * 0.15));
    ctx.lineTo(ax.X(clamped), ax.Y(maxp * 0.9));
    ctx.stroke();
    ctx.fillStyle = col;
    ctx.fillText(label, ax.X(Math.max(-5.8, Math.min(5.5, val))) + 4, ax.Y(maxp * 0.85));
  }
  document.getElementById('paramRead').innerHTML = `alpha=${alpha.toFixed(3)}, sigma=${sigma.toFixed(3)}. score=${s.toFixed(3)}; x0-pred=${x0.toFixed(3)}; eps-pred=${eps.toFixed(3)}; v-pred=${v.toFixed(3)}. Check: x0 = alpha x_t - sigma v = ${(alpha * xt - sigma * v).toFixed(3)}.`;
}

function rng(seed) {
  let x = seed % 2147483647;
  return () => {
    x = (x * 48271) % 2147483647;
    return x / 2147483647;
  };
}

function randn(r) {
  const u = Math.max(r(), 1e-9);
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function drawDDIM() {
  const seed = parseInt(document.getElementById('seedSlider').value, 10);
  const eta = parseFloat(document.getElementById('etaSlider').value);
  document.getElementById('seedVal').textContent = seed;
  document.getElementById('etaVal').textContent = eta.toFixed(2);
  const r = rng(seed);
  const x = randn(r) * 2.8;
  const xsDet = [[1, x]];
  const xsSto = [[1, x]];
  let xd = x;
  let xst = x;
  const steps = 80;
  for (let k = steps; k > 0; k--) {
    const t = k / steps;
    const sT = (k - 1) / steps;
    const sig = Math.sin(Math.PI * t / 2);
    const alp = Math.cos(Math.PI * t / 2);
    const sig2 = Math.sin(Math.PI * sT / 2);
    const alp2 = Math.cos(Math.PI * sT / 2);
    const sc = score(xd, sig, alp);
    const x0 = (xd + sig * sig * sc) / Math.max(alp, 1e-4);
    const eps = -sig * sc;
    xd = alp2 * x0 + sig2 * eps;
    xsDet.push([sT, xd]);
    const scs = score(xst, sig, alp);
    const x0s = (xst + sig * sig * scs) / Math.max(alp, 1e-4);
    const epss = -sig * scs;
    xst = alp2 * x0s + sig2 * epss + eta * Math.sqrt(Math.max(sig * sig - sig2 * sig2, 0)) * 0.18 * randn(r);
    xsSto.push([sT, xst]);
  }
  const { ctx, w, h } = setupCanvas(document.getElementById('plotDDIM'));
  const vals = xsDet.concat(xsSto).map(p => p[1]);
  const ymin = Math.min(-4, ...vals) - 0.3;
  const ymax = Math.max(4, ...vals) + 0.3;
  const ax = axes(ctx, w, h, 0, 1, ymin, ymax);
  line(ctx, xsDet, ax.X, ax.Y, COLORS.blue, 2.5);
  line(ctx, xsSto, ax.X, ax.Y, COLORS.amber, 2);
  ctx.fillStyle = COLORS.text;
  ctx.fillText('reverse time: noise to data', w / 2 - 80, h - 12);
}

const fisherCache = [];

function fisher(sigma) {
  let sum = 0;
  const n = 900;
  const xmin = -9;
  const xmax = 9;
  const dx = (xmax - xmin) / (n - 1);
  for (let i = 0; i < n; i++) {
    const y = xmin + i * dx;
    const p = marginal(y, sigma, 1);
    const sc = score(y, sigma, 1);
    const weight = (i === 0 || i === n - 1) ? 0.5 : 1;
    sum += weight * p * sc * sc * dx;
  }
  return sum;
}

function ensureFisher() {
  if (fisherCache.length) {
    return;
  }
  for (let i = 0; i < 100; i++) {
    const sig = 0.15 + (3 - 0.15) * i / 99;
    fisherCache.push([sig, fisher(sig)]);
  }
}

function drawFisher() {
  ensureFisher();
  const sig = parseFloat(document.getElementById('fishSlider').value);
  document.getElementById('fishVal').textContent = sig.toFixed(2);
  const val = fisher(sig);
  const { ctx, w, h } = setupCanvas(document.getElementById('plotFisher'));
  const ymax = Math.max(...fisherCache.map(p => p[1])) * 1.08;
  const ax = axes(ctx, w, h, 0.15, 3, 0, ymax);
  line(ctx, fisherCache, ax.X, ax.Y, COLORS.blue, 2.5);
  ctx.strokeStyle = COLORS.green;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ax.X(sig), ax.Y(0));
  ctx.lineTo(ax.X(sig), ax.Y(val));
  ctx.stroke();
  ctx.fillStyle = COLORS.green;
  ctx.fillText(`I(sigma) ~= ${val.toFixed(3)}`, ax.X(sig) + 8, ax.Y(val));
  document.getElementById('fishRead').innerHTML = `For sigma=${sig.toFixed(2)}, numerical Fisher information is approximately I=${val.toFixed(4)}. This is E[s(Y)^2] for the noisy marginal.`;
}

function redrawAll() {
  drawTweedie();
  drawParam();
  drawDDIM();
  drawFisher();
}

for (const id of ['obs', 'sigma']) {
  document.getElementById(id).addEventListener('input', drawTweedie);
}
for (const id of ['timeParam', 'xtParam']) {
  document.getElementById(id).addEventListener('input', drawParam);
}
for (const id of ['seedSlider', 'etaSlider']) {
  document.getElementById(id).addEventListener('input', drawDDIM);
}
document.getElementById('fishSlider').addEventListener('input', drawFisher);
window.addEventListener('resize', redrawAll);
window.addEventListener('load', redrawAll);
