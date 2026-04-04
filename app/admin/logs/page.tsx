"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, Eye, Activity, Database, Edit, Trash2, Plus } from 'lucide-react'
import { AdminActivityLog } from '@/lib/database-types'

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<AdminActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedEntityType, setSelectedEntityType] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLogs()
  }, [search, selectedEntityType, selectedAction, page])

  const fetchLogs = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })

      if (search) params.append('search', search)
      if (selectedEntityType && selectedEntityType !== 'all') params.append('entity_type', selectedEntityType)
      if (selectedAction && selectedAction !== 'all') params.append('action', selectedAction)

      const response = await fetch(`/api/admin/logs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setLogs(data.data)
        setTotalPages(data.pagination.pages)
      } else {
        setError(data.error || 'Failed to fetch logs')
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="h-4 w-4 text-green-600" />
      case 'UPDATE':
        return <Edit className="h-4 w-4 text-blue-600" />
      case 'DELETE':
        return <Trash2 className="h-4 w-4 text-red-600" />
      default:
        return <Database className="h-4 w-4 text-zinc-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatJsonData = (data: any) => {
    if (!data) return 'None'
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return 'Invalid JSON'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-light text-zinc-900">Activity Logs</h2>
          <p className="text-zinc-600">View admin activity and system changes</p>
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
          <h2 className="text-3xl font-light text-zinc-900">Activity Logs</h2>
          <p className="text-zinc-600">View admin activity and system changes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-zinc-600" />
          <span className="text-sm text-zinc-600">{logs.length} entries</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-light">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="team_member">Team Members</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="explore_content">Explore Content</SelectItem>
                <SelectItem value="partner">Partners</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getActionIcon(log.action)}
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{log.entity_type}</div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm text-zinc-600">
                    {log.entity_id?.slice(0, 8)}...
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-600">
                    {log.user_id?.slice(0, 8)}...
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-600">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Activity Log Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Action</label>
                            <p className="text-sm text-zinc-600">{log.action}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Entity Type</label>
                            <p className="text-sm text-zinc-600">{log.entity_type}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Entity ID</label>
                            <p className="text-sm text-zinc-600 font-mono">{log.entity_id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">User ID</label>
                            <p className="text-sm text-zinc-600 font-mono">{log.user_id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Date</label>
                            <p className="text-sm text-zinc-600">{new Date(log.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {log.details && (
                          <div>
                            <label className="text-sm font-medium">Details</label>
                            <pre className="text-xs bg-zinc-100 p-3 rounded-md overflow-x-auto">
                              {formatJsonData(log.details)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {logs.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            No activity logs found.
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 p-4">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}