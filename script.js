<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Image Similarity Demo</title>
  <style>
    body { font-family: system-ui, Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 16px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 16px; }
    .preview { width: 100%; height: 260px; border: 1px dashed #bbb; border-radius: 12px; display: grid; place-items: center; overflow: hidden; background: #fafafa;}
    .preview img { max-width: 100%; max-height: 100%; display: block; }
    button { padding: 10px 14px; border-radius: 10px; border: 1px solid #ccc; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .result { margin-top: 18px; font-size: 18px; }
    .big { font-size: 40px; font-weight: 750; margin: 8px 0; }
    .hint { color: #666; font-size: 13px; line-height: 1.4; }
    .footer { margin-top: 28px; color: #777; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Image Similarity Demo</h1>
  <p class="hint">
    Upload two images. The similarity score is computed in your browser by resizing both images to the same size and comparing pixels.
  </p>

  <div class="row">
    <div class="card">
      <h2>Image A</h2>
      <input id="fileA" type="file" accept="image/*" />
      <div class="preview" id="prevA"><span class="hint">No image selected</span></div>
    </div>

    <div class="card">
      <h2>Image B</h2>
      <input id="fileB" type="file" accept="image/*" />
      <div class="preview" id="prevB"><span class="hint">No image selected</span></div>
    </div>
  </div>

  <div style="margin-top:16px; display:flex; gap:12px; align-items:center;">
    <button id="compareBtn" disabled>Compare</button>
    <button id="resetBtn">Reset</button>
    <span id="status" class="hint"></span>
  </div>

  <div class="result card">
    <div class="hint">Similarity</div>
    <div class="big" id="score">—%</div>
    <div class="hint" id="details"></div>
  </div>

  <div class="footer">
    Demo note: pixel-level similarity after center-crop + resize. Rotation/compression can change the score.
  </div>

  <script src="script.js"></script>
</body>
</html>
