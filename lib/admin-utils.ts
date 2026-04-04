import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database-types'

export interface AdminAuthResult {
  authorized: boolean
  error?: string
  status?: number
  session?: any
  adminProfile?: any
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Helper function to verify admin access
export async function verifyAdminAccess(supabase: any): Promise<AdminAuthResult> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return { authorized: false, error: 'Unauthorized', status: 401 }
    }

    const { data: adminProfile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .single()

    if (profileError || !adminProfile) {
      return { authorized: false, error: 'Forbidden', status: 403 }
    }

    return { authorized: true, session, adminProfile }
  } catch (error) {
    console.error('Error verifying admin access:', error)
    return { authorized: false, error: 'Internal server error', status: 500 }
  }
}

// Helper function to log activity
export async function logActivity(
  supabase: any, 
  userId: string, 
  action: string, 
  entityType: string,
  entityId?: string, 
  details?: any
): Promise<void> {
  try {
    await supabase
      .from('admin_activity_logs')
      .insert({
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details
      })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

// Helper function to check for duplicate slug
export async function checkDuplicateSlug(
  supabase: any,
  table: string,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  try {
    let query = supabase
      .from(table)
      .select('id')
      .eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.single()
    return !!data
  } catch (error) {
    return false
  }
}

// Helper function to build search query
export function buildSearchQuery(
  query: any,
  search: string,
  searchFields: string[]
): any {
  if (!search) return query
  
  const searchConditions = searchFields.map(field => `${field}.ilike.%${search}%`)
  return query.or(searchConditions.join(','))
}

// Helper function to apply filters
export function applyFilters(query: any, filters: Record<string, any>): any {
  let modifiedQuery = query

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (key === 'published' || key === 'is_published') {
        modifiedQuery = modifiedQuery.eq('is_published', value === 'true')
      } else if (key === 'featured' || key === 'is_featured') {
        modifiedQuery = modifiedQuery.eq('is_featured', value === 'true')
      } else if (key === 'active' || key === 'is_active') {
        modifiedQuery = modifiedQuery.eq('is_active', value === 'true')
      } else {
        modifiedQuery = modifiedQuery.eq(key, value)
      }
    }
  })

  return modifiedQuery
}

// Helper function to apply pagination and sorting
export function applyPaginationAndSorting(
  query: any,
  page: number,
  limit: number,
  sortBy: string = 'sort_order',
  sortOrder: 'asc' | 'desc' = 'asc'
): any {
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  return query
    .range(from, to)
    .order(sortBy, { ascending: sortOrder === 'asc' })
}

// Helper function to validate required fields
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => !body[field])
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

// Helper function to prepare update data (only include defined fields)
export function prepareUpdateData(body: any, allowedFields: string[]): any {
  const updateData: any = {}
  
  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  })
  
  updateData.updated_at = new Date().toISOString()
  return updateData
}

// Generic CRUD operations
export class AdminCRUDService<T> {
  private supabase: any
  private tableName: string
  private entityType: string

  constructor(tableName: string, entityType: string) {
    this.supabase = createRouteHandlerClient<Database>({ cookies })
    this.tableName = tableName
    this.entityType = entityType
  }

  async list(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    searchFields: string[] = ['name'],
    filters: Record<string, any> = {},
    sortBy: string = 'sort_order',
    sortOrder: 'asc' | 'desc' = 'asc',
    selectFields: string = '*'
  ): Promise<PaginationResult<T>> {
    // Verify admin access
    const authResult = await verifyAdminAccess(this.supabase)
    if (!authResult.authorized) {
      throw new Error(authResult.error)
    }

    // Build query
    let query = this.supabase
      .from(this.tableName)
      .select(selectFields, { count: 'exact' })

    // Apply search
    query = buildSearchQuery(query, search, searchFields)

    // Apply filters
    query = applyFilters(query, filters)

    // Apply pagination and sorting
    query = applyPaginationAndSorting(query, page, limit, sortBy, sortOrder)

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error(`Error fetching ${this.entityType}s:`, error)
      throw new Error(`Failed to fetch ${this.entityType}s`)
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      }
    }
  }

  async getById(id: string, selectFields: string = '*'): Promise<T> {
    // Verify admin access
    const authResult = await verifyAdminAccess(this.supabase)
    if (!authResult.authorized) {
      throw new Error(authResult.error)
    }

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(selectFields)
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching ${this.entityType}:`, error)
      throw new Error(`${this.entityType} not found`)
    }

    return data
  }

  async create(
    data: any,
    requiredFields: string[] = [],
    selectFields: string = '*'
  ): Promise<T> {
    // Verify admin access
    const authResult = await verifyAdminAccess(this.supabase)
    if (!authResult.authorized) {
      throw new Error(authResult.error)
    }

    // Validate required fields
    const validation = validateRequiredFields(data, requiredFields)
    if (!validation.isValid) {
      throw new Error(`Missing required fields: ${validation.missingFields.join(', ')}`)
    }

    // Check for duplicate slug if provided
    if (data.slug) {
      const hasDuplicate = await checkDuplicateSlug(this.supabase, this.tableName, data.slug)
      if (hasDuplicate) {
        throw new Error(`A ${this.entityType} with this slug already exists`)
      }
    }

    // Insert record
    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .select(selectFields)
      .single()

    if (error) {
      console.error(`Error creating ${this.entityType}:`, error)
      throw new Error(`Failed to create ${this.entityType}`)
    }

    // Log activity
    await logActivity(
      this.supabase,
      authResult.session.user.id,
      'create',
      this.entityType,
      record.id,
      { name: record.name || record.title }
    )

    return record
  }

  async update(
    id: string,
    data: any,
    allowedFields: string[] = [],
    selectFields: string = '*'
  ): Promise<T> {
    // Verify admin access
    const authResult = await verifyAdminAccess(this.supabase)
    if (!authResult.authorized) {
      throw new Error(authResult.error)
    }

    // Check if record exists
    const existingRecord = await this.getById(id, 'id, slug, name, title') as any

    // Check for duplicate slug if being changed
    if (data.slug && data.slug !== existingRecord.slug) {
      const hasDuplicate = await checkDuplicateSlug(this.supabase, this.tableName, data.slug, id)
      if (hasDuplicate) {
        throw new Error(`A ${this.entityType} with this slug already exists`)
      }
    }

    // Prepare update data
    const updateData = allowedFields.length > 0 
      ? prepareUpdateData(data, allowedFields)
      : { ...data, updated_at: new Date().toISOString() }

    // Update record
    const { data: record, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select(selectFields)
      .single()

    if (error) {
      console.error(`Error updating ${this.entityType}:`, error)
      throw new Error(`Failed to update ${this.entityType}`)
    }

    // Log activity
    await logActivity(
      this.supabase,
      authResult.session.user.id,
      'update',
      this.entityType,
      record.id,
      { 
        name: record.name || record.title,
        changes: Object.keys(updateData)
      }
    )

    return record
  }

  async delete(id: string): Promise<void> {
    // Verify admin access
    const authResult = await verifyAdminAccess(this.supabase)
    if (!authResult.authorized) {
      throw new Error(authResult.error)
    }

    // Check if record exists
    const existingRecord = await this.getById(id, 'id, name, title') as any

    // Delete record
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting ${this.entityType}:`, error)
      throw new Error(`Failed to delete ${this.entityType}`)
    }

    // Log activity
    await logActivity(
      this.supabase,
      authResult.session.user.id,
      'delete',
      this.entityType,
      id,
      { name: existingRecord.name || existingRecord.title }
    )
  }
}

// Specific service instances
export const projectsService = new AdminCRUDService('projects', 'project')
export const teamService = new AdminCRUDService('team_members', 'team_member')
export const servicesService = new AdminCRUDService('services', 'service')
export const partnersService = new AdminCRUDService('partners', 'partner')
export const categoriesService = new AdminCRUDService('categories', 'category')
export const contactService = new AdminCRUDService('contact_submissions', 'contact_submission')
export const exploreService = new AdminCRUDService('explore_content', 'explore_content')

// Types are already exported above 