/* D-DAY 카운트다운 */
(function () {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const DAY = 24 * 60 * 60 * 1000;
  const eventTime = new Date(CONFIG.eventDate).getTime();

  const badge = document.getElementById("dday-badge");
  const caption = document.getElementById("dday-caption");
  const timer = document.getElementById("dday-timer");
  const units = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds")
  };

  // 한국 시간 기준 자정의 '날짜 번호'를 구한다 (기기 시간대와 무관)
  function kstDayNumber(ms) {
    return Math.floor((ms + KST_OFFSET) / DAY);
  }

  const pad = (n) => String(n).padStart(2, "0");

  function update() {
    const now = Date.now();
    const dayDiff = kstDayNumber(eventTime) - kstDayNumber(now);

    if (dayDiff > 0) {
      badge.textContent = "D-" + dayDiff;
      caption.innerHTML = "두근두근, <strong>" + dayDiff + "일</strong> 남았어요!";
    } else if (dayDiff === 0) {
      badge.textContent = "D-DAY";
      caption.textContent = now < eventTime ? "바로 오늘이에요! 🎉" : "와 줘서 고마워요! 💛";
    } else {
      badge.textContent = "D+" + Math.abs(dayDiff);
      caption.textContent = "벌써 끝났어요. 함께해 줘서 고마워요! 💛";
    }

    const remain = eventTime - now;
    if (remain <= 0) {
      timer.hidden = true;
      clearInterval(intervalId);
      return;
    }
    units.days.textContent = Math.floor(remain / DAY);
    units.hours.textContent = pad(Math.floor((remain % DAY) / 3600000));
    units.minutes.textContent = pad(Math.floor((remain % 3600000) / 60000));
    units.seconds.textContent = pad(Math.floor((remain % 60000) / 1000));
  }

  const intervalId = setInterval(update, 1000);
  update();
})();
