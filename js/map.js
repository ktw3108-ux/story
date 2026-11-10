/* 지도, 길찾기, 주소 복사 */
(function () {
  const { name, address, lat, lng } = CONFIG.venue;
  const enc = encodeURIComponent;

  // Google 지도 임베드 (API 키 불필요)
  const iframe = document.getElementById("map-frame");
  iframe.src = "https://maps.google.com/maps?q=" + lat + "," + lng + "&z=16&hl=ko&output=embed";
  iframe.title = name + " 위치 지도";

  // 길찾기 링크
  document.getElementById("nav-naver").href =
    "https://map.naver.com/p/search/" + enc(address);
  document.getElementById("nav-kakao").href =
    "https://map.kakao.com/link/to/" + enc(name) + "," + lat + "," + lng;

  // 티맵은 앱 전용 — 앱이 없으면 안내
  document.getElementById("nav-tmap").addEventListener("click", function (e) {
    e.preventDefault();
    const start = Date.now();
    window.location.href =
      "tmap://route?goalname=" + enc(name) + "&goalx=" + lng + "&goaly=" + lat;
    setTimeout(function () {
      if (!document.hidden && Date.now() - start < 2500) {
        showToast("티맵 앱이 설치되어 있어야 이용할 수 있습니다");
      }
    }, 1500);
  });

  // 주소 복사
  document.getElementById("copy-address").addEventListener("click", function () {
    copyText(address).then(
      () => showToast("주소가 복사되었습니다"),
      () => showToast("복사에 실패했습니다")
    );
  });
})();

/* 공용 유틸: 클립보드 복사 (구형 브라우저 대체 포함) */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(function (resolve, reject) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    ok ? resolve() : reject();
  });
}

/* 공용 유틸: 하단 토스트 메시지 */
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2000);
}
