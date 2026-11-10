/* config.js의 내용을 화면에 채우고, 공유·스크롤 효과를 처리한다 */
(function () {
  const $ = (id) => document.getElementById(id);

  const ICON_PHONE =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>';
  const ICON_SMS =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 9h10v2H7zm6 5H7v-2h6zm4-6H7V6h10z"/></svg>';

  // 날짜 문구 (한국 시간 기준)
  const date = new Date(CONFIG.eventDate);
  const dateText = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "long", day: "numeric", weekday: "long"
  }).format(date);
  const timeText = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul", hour: "numeric", minute: "2-digit"
  }).format(date);

  document.title = CONFIG.hosts + " | " + CONFIG.title;
  $("hero-title").textContent = CONFIG.title;
  $("hero-hosts").textContent = CONFIG.hosts;
  $("hero-date").textContent = dateText + " " + timeText;
  $("hero-venue").textContent = CONFIG.venue.name;

  // 초대 문구: 빈 줄은 문단 간격으로
  $("invite-message").innerHTML = CONFIG.message
    .map((line) => (line ? "<span>" + escapeHtml(line) + "</span>" : '<span class="gap"></span>'))
    .join("");
  $("invite-hosts").textContent = CONFIG.hosts;

  $("event-date").textContent = dateText;
  $("event-time").textContent = timeText;

  $("venue-name").textContent = CONFIG.venue.name;
  $("venue-address").textContent = CONFIG.venue.address;

  // 교통편
  $("transport-list").innerHTML = CONFIG.venue.transport
    .map((t) => "<div><dt>" + escapeHtml(t.label) + "</dt><dd>" + escapeHtml(t.text) + "</dd></div>")
    .join("");

  // 연락처
  $("contact-list").innerHTML = CONFIG.contacts
    .map(function (c) {
      const tel = c.phone.replace(/[^0-9+]/g, "");
      return (
        '<li class="contact">' +
        '<div class="contact-who"><span class="contact-role">' + escapeHtml(c.role) + "</span>" +
        "<strong>" + escapeHtml(c.name) + "</strong></div>" +
        '<div class="contact-actions">' +
        '<a class="icon-btn" href="tel:' + tel + '" aria-label="' + escapeHtml(c.name) + '에게 전화">' + ICON_PHONE + "</a>" +
        '<a class="icon-btn" href="sms:' + tel + '" aria-label="' + escapeHtml(c.name) + '에게 문자">' + ICON_SMS + "</a>" +
        "</div></li>"
      );
    })
    .join("");

  // 공유하기
  $("share-btn").addEventListener("click", function () {
    const data = { title: document.title, text: CONFIG.title, url: location.href };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else {
      copyText(location.href).then(
        () => showToast("초대장 링크가 복사되었습니다"),
        () => showToast("복사에 실패했습니다")
      );
    }
  });
  $("copy-link-btn").addEventListener("click", function () {
    copyText(location.href).then(
      () => showToast("초대장 링크가 복사되었습니다"),
      () => showToast("복사에 실패했습니다")
    );
  });

  // 스크롤 시 섹션 페이드인
  const targets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("visible"));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }
})();
