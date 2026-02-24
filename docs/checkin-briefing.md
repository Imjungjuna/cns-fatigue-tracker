# 체크인 페이지 구현 브리핑

## 1. 스펙 ↔ DB 매핑

### 1.1 현재 `daily_records` 컬럼 vs 스펙

| 스펙 그룹 | 스펙 항목 | DB 컬럼 | 비고 |
|-----------|-----------|---------|------|
| Group 1 | 수면 시간 (4~10h) | `sleep_hours` | ✓ 있음 (numeric, 4–10 제약) |
| Group 1 | 수면 질 (1~5) | `sleep_quality` | ✓ 있음 |
| Group 2 | 정신적 피로도 (1~5) | `mental_fatigue` | ✓ 있음 |
| Group 2 | 신체적 에너지 (1~5) | `physical_energy` | ✓ 있음 |
| Group 2 | 근육통 (1~5) | `muscle_soreness` | ✓ 있음 |
| Group 3 | 어제 운동 여부 | `exercised_yesterday` | ✓ 있음 (boolean) |
| Group 3 | RPE (1~10) | `prev_rpe` | ✓ 있음 (Yes일 때만) |
| Group 4 | HRV (숫자 or 모름) | **없음** | ❌ **추가 필요** |
| - | 운동 종목 | `prev_exercise_type` | ✓ 폼에 포함 (어제 운동 Yes 시: 온보딩 시 등록한 종목 선택 또는 직접 입력) |
| - | 메모 | `memo` | 스펙에 없음, DB 있음 (선택) |
| - | CNS 점수 | `cns_score` | 서버에서 계산 후 저장 |
| - | 가이드 메시지 | `llm_insight` | 나중에 LLM 등으로 채울 수 있음 |

---

## 2. DB에서 빠지는 내용

- **HRV 컬럼**  
  - 스펙: Group 4에서 “HRV 숫자 입력” 또는 “모름” 체크.  
  - 현재 `daily_records`에 HRV 필드 없음.  
  - **제안:** `hrv` 컬럼 추가 (타입: `numeric`, nullable).  
    - `NULL` = “모름”(추론 모드), 값 있음 = 정밀 모드.

나머지 스펙 항목은 모두 기존 컬럼으로 매핑 가능함.

---

## 3. 구현 구조 제안

### 3.1 라우트·인증

- **`app/checkin/page.tsx`** (서버 컴포넌트)
  - 로그인 여부 확인 → 미로그인 시 `/login`
  - 프로필·온보딩 완료 여부 확인 → 미완료 시 `/onboarding`
  - **오늘 날짜로 이미 체크인 존재 여부** 조회
    - 있으면: “이미 기록됨” UI 또는 리다이렉트(예: `/dashboard` 또는 전용 “완료” 뷰)
    - 없으면: 체크인 폼 컴포넌트 렌더

### 3.2 UI 구조 (그룹화)

- **한 페이지 내 4개 그룹**으로 시각적 구분 (모바일 이탈 방지)
  - **Group 1: 수면**  
    - 수면 시간: Slider (4~10h)  
    - 수면 질: 5단계 아이콘 (1~5)
  - **Group 2: 신체 상태**  
    - 정신적 피로도, 신체적 에너지, 근육통: 각 5단계 아이콘 (1~5)
  - **Group 3: 활동 이력**  
    - 어제 운동 여부: Toggle (Yes/No)  
    - RPE: Yes일 때만 Slider (1~10) 노출
  - **Group 4: HRV**  
    - “HRV 알고 있어요” Checkbox  
    - 체크 시 Input 숫자 입력 스무스하게 노출  
    - 미체크 = “모름” → DB에는 `hrv = NULL`

### 3.3 컴포넌트·파일 분리

| 역할 | 파일 | 설명 |
|------|------|------|
| 페이지·가드 | `app/checkin/page.tsx` | 서버 컴포넌트, 인증/온보딩/오늘 기록 여부 처리 |
| 폼 UI | `app/checkin/checkin-form.tsx` (또는 `components/checkin/checkin-form.tsx`) | 클라이언트 컴포넌트, 4그룹 입력·제출 |
| 서버 액션 | `app/checkin/actions.ts` | `submitCheckin(formData)`: 검증 → 점수 계산 → `daily_records` insert |
| 점수·상태 | `utils/cns-calculator.ts` (기존 demo 확장/이름 변경) | 스펙 공식 적용, `getCnsStatus(score)` 로 구간별 상태·메시지 |

### 3.4 제출 플로우

1. 사용자가 폼 제출 → `submitCheckin(formData)` 호출
2. 서버 액션에서:
   - 로그인 유저 확인
   - FormData 파싱 (수면, 컨디션 3종, 운동 여부, RPE, HRV/모름, 메모 등)
   - 유효성 검사 (범위, 필수값)
   - **CNS 점수 계산**
     - HRV 있음 → 정밀 모드: `(Sleep×0.35)+(Cond×0.30)+(Load×0.20)+(HRV×0.15)`
     - HRV 없음(모름) → 추론 모드: `(Sleep×0.45)+(Cond×0.35)+(Load×0.20)`
   - `daily_records` insert (user_id, date=오늘, 각 필드, `cns_score`)
   - 성공 시: 리다이렉트(예: `/dashboard`) 또는 “기록 완료 + 점수/구간 메시지” 표시

### 3.5 세부 스코어링 (스펙 반영)

- **수면:** `Score_Sleep = (Sd×0.4) + (Sq×0.6)`  
  - Sd: (sleep_hours/8)×100 (최대 100)  
  - Sq: (sleep_quality-1)×25
- **컨디션:** `Score_Cond = (M×0.4) + (P×0.4) + (B×0.2)`  
  - M, P, B: (값-1)×25 (각 0~100)
- **부하:** 운동 No → 100, 운동 Yes → 100−(RPE×10)
- **HRV:** 입력 시 60ms=100 기준으로 환산 (최대 100), 미입력 시 항목 제외

기존 `utils/cns-calculator-demo.ts`와 공식이 이미 거의 동일하므로, 이를 스펙과 완전히 맞춘 뒤 `utils/cns-calculator.ts` 등으로 정리해 재사용 권장.

---

## 4. 점수 구간별 상태·메시지 (스펙 표)

| 점수 구간 | 상태 (Status) | 메시지 |
|-----------|----------------|--------|
| 85 ~ 100 | Optimal | 최상의 신경계 컨디션입니다. 고강도 스파링이나 PR 갱신을 추천합니다. |
| 60 ~ 84 | Recovered | 정상 범위입니다. 계획된 훈련을 차질 없이 수행하십시오. |
| 40 ~ 59 | Mild Fatigue | 경미한 피로가 감지됩니다. 기술 드릴 위주의 훈련을 권장하며 무리하지 마십시오. |
| 0 ~ 39 | High Fatigue | 신경계 부하가 높습니다. 부상 위험이 크므로 완전 휴식 또는 가벼운 스트레칭을 권장합니다. |

제출 완료 후 이 구간과 메시지를 화면에 표시하면 됨.

---

## 5. 스펙에 없지만 DB에 있는 항목

- **`prev_exercise_type`**  
  - 스펙 UX에는 “운동 종목” 입력 없음.  
  - DB에는 있으므로: 첫 버전에서는 넣지 않고, 나중에 “어제 운동 종목” 선택/입력 추가 시 사용 가능.  
- **`memo`**  
  - 스펙에 없음.  
  - 선택: 첫 버전에서는 생략하거나, “메모(선택)” 한 줄 입력으로 두면 됨.

---

## 6. 체크리스트 요약

| 항목 | 처리 |
|------|------|
| DB에 HRV 추가 | `hrv` numeric nullable 컬럼 추가 |
| 수면 시간 범위 | 4~10 (스펙·DB 일치, 기존 demo는 1~10이라 수정 필요 시 반영) |
| RPE | 운동 Yes일 때만 1~10 저장, No면 null 가능 |
| 점수 공식 | 기존 유틸을 스펙과 동일하게 정리 (Sleep/Cond/Load/HRV 가중치) |
| 운동 종목 | v1에서는 미수집, `prev_exercise_type` null 허용 |
| 메모 | 선택 사항으로 두거나, 나중에 추가 |

이 구조대로 구현하면 스펙과 DB가 맞고, 빠진 건 **HRV 컬럼 추가** 하나입니다.
