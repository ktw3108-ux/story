# CLAUDE.md

스마트폰에서 보기 좋은 **모바일 반응형 초대장 웹페이지** 프로젝트.

## 기술 스택

- **순수 HTML / CSS / JavaScript만 사용** (Vanilla JS)
- 프레임워크·라이브러리·빌드 도구 금지: React, Vue, jQuery, Tailwind, Bootstrap, npm, 번들러 등 사용하지 않는다.
- 외부 의존은 지도 임베드와 웹폰트(Google Fonts 등)처럼 꼭 필요한 것만 허용한다.
- 브라우저에서 `index.html`을 바로 열어도 동작해야 한다 (빌드 단계 없음).

## 폴더 구조

```
story/
├── index.html        # 페이지 마크업 (단일 페이지)
├── css/
│   └── style.css     # 전체 스타일
├── js/
│   ├── config.js     # 행사 정보(날짜·장소·문구) — 내용 수정은 여기서만
│   ├── map.js        # 지도, 길찾기 버튼, 공용 유틸(copyText, showToast)
│   ├── main.js       # config 내용을 화면에 채우기, 공유, 스크롤 효과
│   └── dday.js       # D-DAY 카운트다운
└── images/           # 사진·아이콘 (웹용으로 압축된 jpg/webp/svg)
```

## 핵심 기능

### 1. D-DAY 카운트다운
- `config.js`의 행사 일시(예: `EVENT_DATE = "2026-12-24T12:00:00+09:00"`)를 기준으로 계산한다. 시간대는 **KST(+09:00)를 명시**한다.
- 표시: `D-12` 형식 + 남은 일/시/분/초 실시간 카운트다운 (`setInterval` 1초).
- 상태별 문구:
  - 행사 전: `D-N`, 남은 시간 표시
  - 행사 당일: `D-DAY` (오늘입니다!)
  - 행사 후: `D+N` 또는 "행사가 종료되었습니다"
- 일(day) 계산은 시각이 아닌 **날짜 기준**(자정 기준)으로 해서 하루 오차가 없게 한다.

### 2. 장소 지도
- API 키 없이 동작하는 방식을 기본으로 한다: **Google Maps `<iframe>` 임베드**.
- 지도 아래에 길찾기 버튼을 둔다: **네이버 지도 / 카카오맵 / 티맵** 앱·웹 링크.
- 장소명, 주소, 위도·경도는 `config.js`에 둔다.
- 주소 **복사 버튼**(`navigator.clipboard.writeText`)과 교통편 안내(지하철·버스·주차)를 함께 제공한다.
- 카카오/네이버 지도 JS SDK로 바꿀 경우 앱 키가 필요하며, 키는 사용자에게 확인 후 넣는다.

### 3. 기본 섹션 (순서)
1. 메인(대표 사진, 제목, 날짜)
2. 초대 문구
3. 일시 + D-DAY
4. 장소 + 지도 + 길찾기
5. 연락처/문의 (`tel:`, `sms:` 링크)
6. 공유하기 (`navigator.share`, 미지원 시 링크 복사로 대체)

## 디자인·반응형 규칙

- **모바일 퍼스트**: 기본 스타일을 360~430px 폭 기준으로 작성하고, `min-width` 미디어 쿼리로 확장한다.
- 데스크톱에서는 콘텐츠 최대 폭 `max-width: 480px`, 가운데 정렬 (휴대폰 화면처럼 보이게).
- `<meta name="viewport" content="width=device-width, initial-scale=1">` 필수.
- 단위는 `rem`, `%`, `vw`, `clamp()` 위주. 가로 스크롤이 생기지 않게 한다.
- 터치 대상(버튼·링크)은 최소 44×44px.
- 색상·폰트·간격은 `:root`의 CSS 변수로 정의해 한 곳에서 바꿀 수 있게 한다.
- 노치/홈바 대응: `env(safe-area-inset-*)` 사용.
- 이미지는 `loading="lazy"`, 적절한 `alt` 텍스트 지정.
- 애니메이션은 은은하게, `prefers-reduced-motion` 설정을 존중한다.

## 코드 규칙

- 시맨틱 HTML 사용 (`<header>`, `<section>`, `<footer>` 등), 한국어 페이지이므로 `<html lang="ko">`.
- JS는 `<script defer>`로 로드, 전역 변수 최소화.
- `var` 대신 `const`/`let`, 인라인 `onclick` 대신 `addEventListener`.
- 행사 정보(날짜, 장소, 연락처, 문구)는 코드에 하드코딩하지 말고 `config.js`에서 읽는다.
- 주석과 UI 문구는 한국어.

## 테스트

- 크롬 개발자 도구 모바일 에뮬레이션(iPhone SE 375px, iPhone 14 Pro 393px, Galaxy S 360px)으로 확인한다.
- D-DAY는 `config.js`의 날짜를 과거·오늘·미래로 바꿔 세 가지 상태를 모두 확인한다.
- 실제 기기(iOS Safari, Android Chrome)에서 지도 표시와 길찾기 앱 연결을 확인한다.

## 소통

- 항상 한국어로 답변한다.
