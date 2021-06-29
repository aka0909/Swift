function getLink() {
    let url = document.getElementById("roomlink-input").value;
    let room = url.split("/");
    window.open(room[3]);
  }