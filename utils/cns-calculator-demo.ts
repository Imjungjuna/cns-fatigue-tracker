export interface CnsDemoInput {
  sleepDuration: number; // 1 ~ 10
  sleepQuality: number; // 1 ~ 5
  mentalCondition: number; // 1 ~ 5
  physicalEnergy: number; // 1 ~ 5
  muscleSoreness: number; // 1 ~ 5
  didExercise: boolean; // true if exercised yesterday
  yesterdayRpe: number; // 0 ~ 10 (didExercise=false => 0)
  hrv?: number | null; // optional
}

// V1.1
export const calculateDemoCnsScore = (input: CnsDemoInput): number => {
  const {
    sleepDuration,
    sleepQuality,
    mentalCondition,
    physicalEnergy,
    muscleSoreness,
    didExercise,
    yesterdayRpe,
    hrv,
  } = input;

  // 1. normalize scores
  // sleep duration score (8 hours = 100 points)
  const sDurationScore = Math.min((sleepDuration / 8) * 100, 100);
  // convert 1~5 scale to 0~100
  const normalizeFiveStep = (val: number) => (val - 1) * 25;
  const [sQualityScore, mScore, pScore, bScore] = [sleepQuality, mentalCondition, physicalEnergy, muscleSoreness].map(
    normalizeFiveStep
  );

  // 2. calculate final scores
  // sleep score (quality 60%, duration 40%)
  const finalSleepScore = sDurationScore * 0.4 + sQualityScore * 0.6;
  // condition score (mental 40%, physical 40%, muscle soreness 20%)
  const finalCondScore = mScore * 0.4 + pScore * 0.4 + bScore * 0.2;
  // load score (100 points if not exercised, 100 - RPE * 10 if exercised)
  const finalLoadScore = didExercise ? Math.max(100 - yesterdayRpe * 10, 0) : 100;

  let totalScore: number;
  if (hrv !== undefined && hrv !== null && hrv > 0) {
    // hrv score (60ms = 100 points, max 100 points)
    const hrvScore = Math.min((hrv / 60) * 100, 100);

    // HRV included weight adjustment
    totalScore = finalSleepScore * 0.35 + finalCondScore * 0.3 + finalLoadScore * 0.2 + hrvScore * 0.15;
  } else {
    // HRV not included weight adjustment (sleep 45%, condition 35%, load 20%)
    totalScore = finalSleepScore * 0.45 + finalCondScore * 0.35 + finalLoadScore * 0.2;
  }

  return Math.round(totalScore);
};

export const getCnsStatus = (score: number) => {
  if (score >= 85) return { status: "Optimal", message: "최상의 컨디션입니다. 고강도 훈련이 가능합니다." };
  if (score >= 60) return { status: "Recovered", message: "정상 범위입니다. 계획된 훈련을 진행하세요." };
  if (score >= 40)
    return {
      status: "Mild Fatigue",
      message: "경미한 피로가 있습니다. 기술 위주의 훈련을 권장합니다.",
    };
  return { status: "High Fatigue", message: "신경계 피로가 높습니다. 완전 휴식을 취하세요." };
};
