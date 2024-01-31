function showTime() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let d = date.getDate();
    let day = date.getDay()
    let month = date.getMonth();
    let year = date.getFullYear();
    let session = "AM";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];
    

    if (h == 0)h = 12;
    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    const time = h + ":" + m + " " + session;
    const dayof = days[day];
    const dateof = d +  " " + months[month] + " " + year;
    document.getElementById("time").innerText = time;
    document.getElementById("day").innerText = dayof;
    document.getElementById("date").innerText = dateof;

    setTimeout(showTime, 1000);
}

showTime();