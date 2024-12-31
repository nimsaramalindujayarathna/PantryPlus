import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'

export function useScaleAvailability(currentScale?: number) {
  const [assignedScales, setAssignedScales] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignedScales = async () => {
      const { data, error } = await supabase
        .from('groceries')
        .select('scale_number')
        
      if (!error && data) {
        const scales = data.map(item => item.scale_number)
        // Filter out current scale if it exists
        setAssignedScales(currentScale 
          ? scales.filter(scale => scale !== currentScale)
          : scales
        )
      }
      setLoading(false)
    }

    fetchAssignedScales()

    // Subscribe to changes
    const subscription = supabase
      .channel('scale_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'groceries' },
        () => fetchAssignedScales()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [currentScale])

  return { assignedScales, loading }
}