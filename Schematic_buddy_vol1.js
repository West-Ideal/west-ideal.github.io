const fileA = document.getElementById("fileA");
const fileB = document.getElementById("fileB");
const prevA = document.getElementById("prevA");
const prevB = document.getElementById("prevB");
const compareBtn = document.getElementById("compareBtn");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");
const detailsEl = document.getElementById("details");

let imgA = null;
let imgB = null;

function setPreview(container, img) {
  container.innerHTML = "";
  container.appendChild(img);
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function updateReady() {
  compareBtn.disabled = !(imgA && imgB);
  statusEl.textContent = (imgA && imgB) ? "Ready to compare." : "Select both images to enable compare.";
}

function drawToCanvas(img, w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  // Draw with cover-style fit to reduce weird aspect mismatch:
  const arImg = img.width / img.height;
  const arTarget = w / h;

  let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
  if (arImg > arTarget) {
    // crop left/right
    sWidth = img.height * arTarget;
    sx = (img.width - sWidth) / 2;
  } else {
    // crop top/bottom
    sHeight = img.width / arTarget;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

function similarityPercent(data1, data2) {
  // data are Uint8ClampedArray RGBA
  const n = data1.length;
  let diffSum = 0;
  for (let i = 0; i < n; i++) {
    diffSum += Math.abs(data1[i] - data2[i]);
  }
  const maxDiff = 255 * n;
  const sim = 1 - (diffSum / maxDiff);
  return Math.max(0, Math.min(1, sim)) * 100;
}

fileA.addEventListener("change", async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  imgA = await loadImageFromFile(f);
  const previewImg = new Image();
  previewImg.src = imgA.src;
  setPreview(prevA, previewImg);
  updateReady();
});

fileB.addEventListener("change", async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  imgB = await loadImageFromFile(f);
  const previewImg = new Image();
  previewImg.src = imgB.src;
  setPreview(prevB, previewImg);
  updateReady();
});

compareBtn.addEventListener("click", () => {
  statusEl.textContent = "Comparing...";
  // Resize both to same resolution for comparison
  const W = 256, H = 256; // small + fast, good enough for a demo
  const a = drawToCanvas(imgA, W, H);
  const b = drawToCanvas(imgB, W, H);

  const pct = similarityPercent(a, b);
  scoreEl.textContent = `${pct.toFixed(2)}%`;

  // Extra detail
  detailsEl.textContent = `Compared after center-cropping + resizing to ${W}×${H}.`;
  statusEl.textContent = "Done.";
});

resetBtn.addEventListener("click", () => {
  fileA.value = "";
  fileB.value = "";
  imgA = null;
  imgB = null;
  prevA.innerHTML = `<span class="hint">No image selected</span>`;
  prevB.innerHTML = `<span class="hint">No image selected</span>`;
  scoreEl.textContent = "—%";
  detailsEl.textContent = "";
  statusEl.textContent = "";
  updateReady();
});

updateReady();