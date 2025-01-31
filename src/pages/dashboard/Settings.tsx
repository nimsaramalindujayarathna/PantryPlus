import { useState } from 'react'
import { useSettingsStore } from '../../stores/settings'
import toast from 'react-hot-toast'

export default function Settings() {
  const { stockLevels, notifications, updateStockLevelSettings, updateNotificationSettings } = useSettingsStore()
  
  const [stockWeight, setStockWeight] = useState(stockLevels.weightThreshold.toString())
  const [stockDays, setStockDays] = useState(stockLevels.daysThreshold.toString())
  const [notifWeight, setNotifWeight] = useState(notifications.weightThreshold.toString())
  const [notifDays, setNotifDays] = useState(notifications.daysThreshold.toString())

  const handleStockLevelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const weight = Number(stockWeight)
    const days = Number(stockDays)
    
    if (isNaN(weight) || isNaN(days) || weight < 0 || days < 0) {
      toast.error('Please enter valid numbers')
      return
    }

    updateStockLevelSettings(weight, days)
    toast.success('Stock level settings updated')
  }

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const weight = Number(notifWeight)
    const days = Number(notifDays)
    
    if (isNaN(weight) || isNaN(days) || weight < 0 || days < 0) {
      toast.error('Please enter valid numbers')
      return
    }

    updateNotificationSettings(weight, days)
    toast.success('Notification settings updated')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Stock Level Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure thresholds for highlighting items in the stock level table:
          <br />
          • Green (RGB 144,238,144): Items below weight threshold
          <br />
          • Yellow (RGB 255,250,120): Items expiring within days threshold
          <br />
          • Red (RGB 255,99,71): Items meeting both conditions
        </p>
        <form onSubmit={handleStockLevelSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Weight Threshold (g)</label>
              <input
                type="number"
                min="0"
                value={stockWeight}
                onChange={(e) => setStockWeight(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Days Threshold</label>
              <input
                type="number"
                min="0"
                value={stockDays}
                onChange={(e) => setStockDays(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Apply Stock Level Settings
          </button>
        </form>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground">Notification Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Configure thresholds for receiving notifications about low stock and expiring items
        </p>
        <form onSubmit={handleNotificationSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Weight Threshold (g)</label>
              <input
                type="number"
                min="0"
                value={notifWeight}
                onChange={(e) => setNotifWeight(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Days Threshold</label>
              <input
                type="number"
                min="0"
                value={notifDays}
                onChange={(e) => setNotifDays(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Apply Notification Settings
          </button>
        </form>
      </div>
    </div>
  )
}