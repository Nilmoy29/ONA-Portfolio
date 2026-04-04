"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, Settings, Globe, Users, Palette } from 'lucide-react'
import { SiteSetting } from '@/lib/database-types'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setSettings(data || [])
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)

      if (error) {
        throw error
      }

      // Update local state
      setSettings(prev => prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      ))
    } catch (error) {
      console.error('Error updating setting:', error)
      throw error
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Settings are already updated in real-time, so just show success
      setSuccess('Settings saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category)
  }

  const renderSettingInput = (setting: SiteSetting) => {
    const handleChange = (value: string) => {
      updateSetting(setting.key, value)
    }

    switch (setting.data_type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
              {setting.description && (
                <p className="text-sm text-zinc-600">{setting.description}</p>
              )}
            </div>
            <Switch
              checked={setting.value === 'true'}
              onCheckedChange={(checked) => handleChange(checked.toString())}
            />
          </div>
        )
      case 'number':
        return (
          <div className="space-y-2">
            <Label>{setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
            {setting.description && (
              <p className="text-sm text-zinc-600">{setting.description}</p>
            )}
            <Input
              type="number"
              value={setting.value}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        )
      default:
        return (
          <div className="space-y-2">
            <Label>{setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
            {setting.description && (
              <p className="text-sm text-zinc-600">{setting.description}</p>
            )}
            {setting.key.includes('description') || setting.key.includes('subtitle') ? (
              <Textarea
                value={setting.value}
                onChange={(e) => handleChange(e.target.value)}
                rows={3}
              />
            ) : (
              <Input
                value={setting.value}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Site Settings</h2>
          <p className="text-zinc-600">Configure site-wide settings</p>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-zinc-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Site Settings</h2>
          <p className="text-zinc-600">Configure site-wide settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Users className="mr-2 h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social">
            <Palette className="mr-2 h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="content">
            <Settings className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {getSettingsByCategory('general').map(setting => (
                <div key={setting.id}>
                  {renderSettingInput(setting)}
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={setting.is_public ? 'default' : 'secondary'}>
                      {setting.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <span className="text-xs text-zinc-500">Key: {setting.key}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {getSettingsByCategory('contact').map(setting => (
                <div key={setting.id}>
                  {renderSettingInput(setting)}
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={setting.is_public ? 'default' : 'secondary'}>
                      {setting.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <span className="text-xs text-zinc-500">Key: {setting.key}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {getSettingsByCategory('social').map(setting => (
                <div key={setting.id}>
                  {renderSettingInput(setting)}
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={setting.is_public ? 'default' : 'secondary'}>
                      {setting.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <span className="text-xs text-zinc-500">Key: {setting.key}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Content Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {getSettingsByCategory('content').concat(getSettingsByCategory('display')).concat(getSettingsByCategory('features')).map(setting => (
                <div key={setting.id}>
                  {renderSettingInput(setting)}
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={setting.is_public ? 'default' : 'secondary'}>
                      {setting.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <span className="text-xs text-zinc-500">Key: {setting.key}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}