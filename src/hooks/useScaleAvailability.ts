import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase/client'

export function useScaleAvailability(currentScale?: number) {
  const [assignedScales, setAssignedScales] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignedScales = async () => {
      try {
        const { data, error } = await supabase
          .from('groceries')
          .select('load_cell_number')
          .neq('load_cell_number', currentScale || 0)
        
        if (!error && data) {
          const scales = data.map(item => item.load_cell_number)
          setAssignedScales(scales)
        }
      } catch (error) {
        console.error('Error fetching assigned scales:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedScales()

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