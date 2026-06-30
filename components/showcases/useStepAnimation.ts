"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Generic step-based animation hook.
 * Advances through steps with configurable delays, then resets after a pause.
 *
 * @param stepDelays - Array of delays in ms. Index 0 is the initial idle delay.
 * @param resetDelay - Pause in ms after the last step before restarting.
 * @returns Current step number (0 = idle/reset).
 */
export function useStepAnimation(
  stepDelays: number[],
  resetDelay: number,
  fixedStep?: number,
  paused?: boolean
) {
  const [step, setStep] = useState(fixedStep ?? 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSteps = stepDelays.length;

  const scheduleNext = useCallback(
    (currentStep: number) => {
      if (currentStep >= totalSteps) {
        // Pause then restart from step 0 → 1
        timerRef.current = setTimeout(() => {
          setStep(0);
          timerRef.current = setTimeout(() => {
            setStep(1);
            scheduleNext(1);
          }, stepDelays[1]);
        }, resetDelay);
        return;
      }

      const nextStep = currentStep + 1;
      if (nextStep < totalSteps) {
        timerRef.current = setTimeout(() => {
          setStep(nextStep);
          scheduleNext(nextStep);
        }, stepDelays[nextStep]);
      } else {
        scheduleNext(totalSteps);
      }
    },
    [stepDelays, resetDelay, totalSteps]
  );

  useEffect(() => {
    if (fixedStep !== undefined || paused) return;

    timerRef.current = setTimeout(() => {
      setStep(1);
      scheduleNext(1);
    }, stepDelays[1] ?? 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleNext, stepDelays, fixedStep, paused]);

  return step;
}
