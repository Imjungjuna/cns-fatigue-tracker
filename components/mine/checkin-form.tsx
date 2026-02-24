'use client'

import { useState } from 'react'
import { submitCheckin } from '../../app/checkin/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const SCALE_5 = [1, 2, 3, 4, 5] as const

const SLEEP_QUALITY_LABELS: Record<number, string> = {
  1: '매우 나쁨',
  2: '나쁨',
  3: '보통',
  4: '좋음',
  5: '매우 좋음',
}

type Props = {
  sportNames: string[]
}

export function CheckinForm({ sportNames }: Props) {
  const [sleepHours, setSleepHours] = useState(6)
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)
  const [mentalFatigue, setMentalFatigue] = useState<number | null>(null)
  const [physicalEnergy, setPhysicalEnergy] = useState<number | null>(null)
  const [muscleSoreness, setMuscleSoreness] = useState<number | null>(null)
  const [exercisedYesterday, setExercisedYesterday] = useState<boolean | null>(null)
  const [prevRpe, setPrevRpe] = useState(5)
  const [prevExerciseType, setPrevExerciseType] = useState('')
  const [hrvKnown, setHrvKnown] = useState(false)
  const [hrvValue, setHrvValue] = useState('')
  const [memo, setMemo] = useState('')

  return (
    <form action={submitCheckin} className="space-y-6">
      {/* Group 1: 수면 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">수면 (Recovery 기초)</CardTitle>
          <CardDescription>어젯밤 수면 시간과 질을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>수면 시간 (4h ~ 10h)</Label>
            <div className="flex items-center gap-3">
              <Slider
                min={4}
                max={10}
                step={0.5}
                value={[sleepHours]}
                onValueChange={(v) => setSleepHours(v[0] ?? 6)}
                className="flex-1"
              />
              <span className="text-sm font-medium tabular-nums w-10">{sleepHours}h</span>
            </div>
            <input type="hidden" name="sleepHours" value={sleepHours} />
          </div>
          <div className="space-y-2">
            <Label>수면 질</Label>
            <div className="flex flex-wrap gap-2">
              {SCALE_5.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSleepQuality(n)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    sleepQuality === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            {sleepQuality != null && (
              <p className="text-xs text-muted-foreground">{SLEEP_QUALITY_LABELS[sleepQuality]}</p>
            )}
            <input type="hidden" name="sleepQuality" value={sleepQuality ?? ''} required />
          </div>
        </CardContent>
      </Card>

      {/* Group 2: 신체 상태 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">신체 상태</CardTitle>
          <CardDescription>주관적 컨디션을 1~5로 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>정신적 피로도 (집중력, 의욕)</Label>
            <div className="flex gap-2">
              {SCALE_5.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMentalFatigue(n)}
                  className={cn(
                    'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                    mentalFatigue === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <input type="hidden" name="mentalFatigue" value={mentalFatigue ?? ''} required />
          </div>
          <div className="space-y-2">
            <Label>신체적 에너지 (활력)</Label>
            <div className="flex gap-2">
              {SCALE_5.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPhysicalEnergy(n)}
                  className={cn(
                    'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                    physicalEnergy === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <input type="hidden" name="physicalEnergy" value={physicalEnergy ?? ''} required />
          </div>
          <div className="space-y-2">
            <Label>근육통 여부</Label>
            <div className="flex gap-2">
              {SCALE_5.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMuscleSoreness(n)}
                  className={cn(
                    'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                    muscleSoreness === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <input type="hidden" name="muscleSoreness" value={muscleSoreness ?? ''} required />
          </div>
        </CardContent>
      </Card>

      {/* Group 3: 활동 이력 (어제 운동 여부 + RPE + 운동 종목) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">활동 이력 (Yesterday&apos;s Load)</CardTitle>
          <CardDescription>어제 운동 여부와 강도를 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>어제 운동 하셨나요?</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExercisedYesterday(false)}
                className={cn(
                  'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                  exercisedYesterday === false ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setExercisedYesterday(true)}
                className={cn(
                  'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
                  exercisedYesterday === true ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                Yes
              </button>
            </div>
            <input type="hidden" name="exercisedYesterday" value={String(exercisedYesterday === true)} />
          </div>

          {exercisedYesterday === true && (
            <>
              <div className="space-y-2">
                <Label>운동 종목</Label>
                {sportNames.length > 0 ? (
                  <select
                    name="prevExerciseType"
                    value={prevExerciseType}
                    onChange={(e) => setPrevExerciseType(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">선택</option>
                    {sportNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    name="prevExerciseType"
                    placeholder="예: BJJ, 웨이트"
                    value={prevExerciseType}
                    onChange={(e) => setPrevExerciseType(e.target.value)}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label>RPE (1 ~ 10)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[prevRpe]}
                    onValueChange={(v) => setPrevRpe(v[0] ?? 5)}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium tabular-nums w-8">{prevRpe}</span>
                </div>
                <input type="hidden" name="prevRpe" value={prevRpe} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Group 4: HRV */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">생체 지표 (선택)</CardTitle>
          <CardDescription>HRV를 알고 계시면 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="hrvKnown"
              checked={hrvKnown}
              onCheckedChange={(checked) => setHrvKnown(checked === true)}
            />
            <label htmlFor="hrvKnown" className="text-sm font-medium cursor-pointer">
              HRV 알고 있어요
            </label>
          </div>
          {hrvKnown && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="hrvValue">HRV (ms)</Label>
              <Input
                id="hrvValue"
                name="hrvValue"
                type="number"
                min={1}
                max={200}
                placeholder="예: 60"
                value={hrvValue}
                onChange={(e) => setHrvValue(e.target.value)}
                className="max-w-[120px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 메모 (선택) */}
      <div className="space-y-2">
        <Label htmlFor="memo">메모 (선택)</Label>
        <Input
          id="memo"
          name="memo"
          placeholder="오늘 컨디션 메모"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        체크인 완료
      </Button>
    </form>
  )
}
