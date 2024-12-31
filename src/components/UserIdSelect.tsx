import { useState, useEffect } from 'react';
import { getAvailableUserIds } from '../lib/firebase/utils';

interface UserIdSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function UserIdSelect({ value, onChange, className }: UserIdSelectProps) {
  const [availableIds, setAvailableIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableIds = async () => {
      try {
        setLoading(true);
        setError(null);
        const ids = await getAvailableUserIds();
        if (ids.length === 0) {
          setError('No user IDs available. Please try again later.');
        }
        setAvailableIds(ids);
      } catch (error) {
        console.error('Error fetching available user IDs:', error);
        setError('Failed to load available user IDs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableIds();
  }, []);

  if (error) {
    return (
      <div className="text-destructive text-sm mt-1">
        {error}
      </div>
    );
  }

  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className={className}
        required
      >
        <option value="">
          {loading ? 'Loading available IDs...' : 'Select a user ID'}
        </option>
        {availableIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      {loading && (
        <div className="text-muted-foreground text-sm mt-1">
          Loading available user IDs...
        </div>
      )}
    </div>
  );
}