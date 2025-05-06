const image = document.getElementById("coverImageURL");

if (image) {
  image.addEventListener("change", function (event) {
    const fileSize = this.files[0].size / (1024 * 1024);
    console.log(fileSize);
    if (fileSize > 3) {
      alert("Maximum file size for image is 3MB.");
      this.value = "";
      return;
    }
  });
}

const flash = document.querySelector(".alert");
if (flash) {
  setTimeout(() => {
    flash.style.display = "none";
  }, 3000);
}
