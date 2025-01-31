import { useEffect } from 'react';
import { formatDate, cn } from '../lib/utils';
import { getDaysToExpiry } from '../lib/utils/dates';
import { Pencil, Trash2 } from 'lucide-react';
import type { Database } from '../lib/supabase/types';
import { useSettingsStore } from '../stores/settings';
import { useWeightSyncStore } from '../lib/supabase/weightSync';

type Grocery = Database['public']['Tables']['groceries']['Row'];

interface StockTableProps {
  groceries: Grocery[];
  title: string;
  showColorHighlights?: boolean;
  onEdit?: (grocery: Grocery) => void;
  onDelete?: (id: string) => void;
}

export default function StockTable({ 
  groceries, 
  title, 
  showColorHighlights = false,
  onEdit,
  onDelete 
}: StockTableProps) {
  const { stockLevels } = useSettingsStore();
  const updates = useWeightSyncStore((state) => state.updates);

  // Get the latest weight for a grocery, considering real-time updates
  const getLatestWeight = (grocery: Grocery) => {
    const update = updates[grocery.id];
    return update ? update.weight : grocery.weight;
  };

  const getRowColor = (grocery: Grocery) => {
    if (!showColorHighlights) return '';

    const weight = getLatestWeight(grocery);
    const daysToExpiry = getDaysToExpiry(grocery.expiry_date);
    const isLowWeight = weight < stockLevels.weightThreshold;
    const isNearExpiry = daysToExpiry <= stockLevels.daysThreshold;

    if (isLowWeight && isNearExpiry) return 'bg-[rgb(255,99,71)]';
    if (isNearExpiry) return 'bg-[rgb(255,250,120)]';
    if (isLowWeight) return 'bg-[rgb(144,238,144)]';
    return '';
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Weight (g)</th>
              <th className="px-4 py-2 text-left">Expiry Date</th>
              <th className="px-4 py-2 text-left">Days to Expire</th>
              <th className="px-4 py-2 text-left">Load Cell</th>
              {(onEdit || onDelete) && <th className="px-4 py-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {groceries.map((grocery) => {
              const weight = getLatestWeight(grocery);
              return (
                <tr 
                  key={grocery.id} 
                  className={cn(
                    "border-b hover:bg-muted/50",
                    getRowColor({ ...grocery, weight })
                  )}
                >
                  <td className="px-4 py-2">{grocery.name}</td>
                  <td className="px-4 py-2">{weight?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-2">{formatDate(grocery.expiry_date)}</td>
                  <td className="px-4 py-2">{getDaysToExpiry(grocery.expiry_date)}</td>
                  <td className="px-4 py-2">Load Cell {grocery.load_cell_number}</td>
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(grocery)}
                            className="p-1 hover:bg-accent rounded-md"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(grocery.id)}
                            className="p-1 hover:bg-accent rounded-md text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}