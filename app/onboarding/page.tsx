'use client'

import { useState } from 'react'
import { completeOnboarding } from './actions'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const SPORTS = [
  'MMA',
  'Boxing',
  'BJJ',
  'Wrestling',
  'Muay Thai/Kickboxing',
  'Bodybuilding',
  'Powerlifting',
  'CrossFit',
  'Running',
  'Cycling',
  'Swimming',
  'Climbing',
] as const

const FREQUENCIES = ['1x/week', '2-3x/week', '4+ times/week'] as const
const EXPERIENCES = ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'] as const

const FATIGUE_LEVELS = [
  { value: '1', label: 'None' },
  { value: '2', label: 'Low' },
  { value: '3', label: 'Moderate' },
  { value: '4', label: 'High' },
  { value: '5', label: 'Extreme' },
] as const

const GOALS = [
  'Competition & Performance Peaking',
  'Strength Development',
  'Muscle Growth',
  'Injury Prevention & Recovery',
  'Multi-Sport Balance',
  'Fat Loss & Weight Management',
] as const

type SelectedSport = {
  name: string
  frequency: string
  experience: string
}

export default function OnboardingPage() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedSports, setSelectedSports] = useState<SelectedSport[]>([])
  const [selectedFatigueLevel, setSelectedFatigueLevel] = useState<string>('')
  const [goalSelectionError, setGoalSelectionError] = useState<string | null>(null)
  const [sportSelectionError, setSportSelectionError] = useState<string | null>(null)

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) => {
      const isCurrentlySelected = prev.includes(goal)

      if (isCurrentlySelected) {
        // If already selected, remove it
        setGoalSelectionError(null)
        return prev.filter((g) => g !== goal)
      } else {
        // If not selected, check if we can add more
        if (prev.length >= 2) {
          setGoalSelectionError('You can select up to 2 goals.')
          return prev
        }
        // Add the new goal
        setGoalSelectionError(null)
        return [...prev, goal]
      }
    })
  }

  const toggleSport = (sportName: string) => {
    setSelectedSports((prev) => {
      const existing = prev.find((s) => s.name === sportName)
      if (existing) {
        // Remove if already selected
        setSportSelectionError(null)
        return prev.filter((s) => s.name !== sportName)
      } else {
        // Maximum 3 sports allowed
        if (prev.length >= 3) {
          setSportSelectionError('You can select up to 3 sports.')
          return prev
        }
        // Add new selection
        setSportSelectionError(null)
        return [...prev, { name: sportName, frequency: '', experience: '' }]
      }
    })
  }

  const updateSportFrequency = (sportName: string, frequency: string) => {
    setSelectedSports((prev) =>
      prev.map((s) => (s.name === sportName ? { ...s, frequency } : s))
    )
  }

  const updateSportExperience = (sportName: string, experience: string) => {
    setSelectedSports((prev) =>
      prev.map((s) => (s.name === sportName ? { ...s, experience } : s))
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className='border-b'>
          <CardTitle className="text-xl font-semibold">Onboarding Information</CardTitle>
          <CardDescription>
            Set up your profile and start managing CNS fatigue
          </CardDescription>
        </CardHeader>
        <CardContent className='mt-4'>
          <form action={completeOnboarding} className="space-y-6">
            {/* Nickname */}
            <div className="space-y-4">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="e.g., John Doe"
                required
              />
            </div>

            {/* Goals (Max 2) */}
            <div className="space-y-1">
              <Label>Current Goals</Label>
              <CardDescription className="text-xs">
                Select up to 2 goals you're currently focusing on.
              </CardDescription>
              
              {/* Goal Selection Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoals.includes(goal)
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleGoal(goal)
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {goal}
                    </button>
                  )
                })}
            </div>

              {/* Error Message */}
              {goalSelectionError && (
                <div className="my-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {goalSelectionError}
                </div>
              )}

              {/* Hidden inputs for form submission */}
              {selectedGoals.map((goal, idx) => (
                <input
                  key={goal}
                  type="hidden"
                  name="goals"
                  value={goal}
                />
              ))}
            </div>

            {/* Sports Selection (Max 3) */}
            <div className="space-y-1">
              <Label>Primary Sports Experience</Label>
              <CardDescription className="text-xs">
                Select up to 3 sports. For each selected sport, choose frequency and experience.
              </CardDescription>

              {/* Sport Selection Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                {SPORTS.map((sport) => {
                  const isSelected = selectedSports.some((s) => s.name === sport)
                  return (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {sport}
                    </button>
                  )
                })}
              </div>

              {/* Error Message */}
              {sportSelectionError && (
                <div className="my-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {sportSelectionError}
                </div>
              )}

              {/* Selected Sports Details */}
              {selectedSports.map((sport, idx) => (
                <Card key={sport.name} className="p-4 my-2">
                  <div className="mb-1 text-sm font-semibold text-foreground">
                    {sport.name}
                  </div>
                  <Separator className="mb-4" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Frequency Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs">Frequency</Label>
                      <div className="flex flex-wrap gap-2">
                        {FREQUENCIES.map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => updateSportFrequency(sport.name, freq)}
                            className={cn(
                              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                              sport.frequency === freq
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                      <input
                        type="hidden"
                        name={`sportName${idx + 1}`}
                        value={sport.name}
                    />
                      <input
                        type="hidden"
                        name={`sportFrequency${idx + 1}`}
                        value={sport.frequency}
                      />
                    </div>

                    {/* Experience Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs">Experience</Label>
                      <div className="flex flex-wrap gap-2">
                        {EXPERIENCES.map((exp) => (
                          <button
                            key={exp}
                            type="button"
                            onClick={() => updateSportExperience(sport.name, exp)}
                            className={cn(
                              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                              sport.experience === exp
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                          >
                            {exp}
                          </button>
                        ))}
                      </div>
                      <input
                        type="hidden"
                        name={`sportExperience${idx + 1}`}
                        value={sport.experience}
                    />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Daily Fatigue Level */}
            <div className="space-y-3">
              <Label>Daily Fatigue Level</Label>
              <CardDescription className="text-xs">
                Select your typical daily fatigue level.
              </CardDescription>
              
              <div className="flex flex-wrap gap-2">
                {FATIGUE_LEVELS.map((level) => {
                  const isSelected = selectedFatigueLevel === level.value
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedFatigueLevel(level.value)
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex-1 min-w-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {level.label}
                    </button>
                  )
                })}
              </div>

              {/* Hidden input for form submission */}
              <input
                type="hidden"
                name="lifestyleStress"
                value={selectedFatigueLevel}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Complete Onboarding
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
