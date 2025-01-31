import { useState, useEffect } from 'react';
import { db } from '../lib/firebase/client';
import { ref, onValue } from 'firebase/database';

interface ScaleWeightProps {
  scaleNumber: number;
}

export default function ScaleWeight({ scaleNumber }: ScaleWeightProps) {
  const [weight, setWeight] = useState<number>(0);

  useEffect(() => {
    const weightRef = ref(db, `loadCell/loadCell${scaleNumber}/weight`);
    
    const unsubscribe = onValue(weightRef, (snapshot) => {
      const value = snapshot.val();
      setWeight(value || 0);
    });

    return () => unsubscribe();
  }, [scaleNumber]);

  return (
    <div className="mt-4 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-lg font-medium text-foreground mb-2">Current Weight</h3>
      <p className="text-3xl font-bold text-primary">{weight.toFixed(2)}g</p>
    </div>
  );
}