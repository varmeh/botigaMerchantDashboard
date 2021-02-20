export function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


export function getResizedFile(file, fileName, cbFunction) {
  if (!file) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (event) {
    const imgElement = document.createElement("img");
    imgElement.src = event.target.result;
    imgElement.onload = function (e) {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
      canvas.toBlob(blob => {
        blob.name = fileName;
        if (typeof cbFunction === "function") {
          cbFunction(blob);
        }
      }, 'image/jpeg', 1);
    };
  };
}