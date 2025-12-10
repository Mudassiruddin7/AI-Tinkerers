import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials - Database operations will not work')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database helper functions
export const db = {
  // Organizations
  async getOrganization(orgId: string) {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single()
    if (error) throw error
    return data
  },

  async updateOrganization(orgId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', orgId)
      .single()
    if (error) throw error
    return data
  },

  // Courses
  async getCourses(orgId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*, episodes(*)')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getCourse(courseId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*, episodes(*, quiz_questions(*), scenes(*))')
      .eq('id', courseId)
      .single()
    if (error) throw error
    return data
  },

  async createCourse(course: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateCourse(courseId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .single()
    if (error) throw error
    return data
  },

  async deleteCourse(courseId: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
    if (error) throw error
  },

  // Episodes
  async getEpisode(episodeId: string) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*, quiz_questions(*), scenes(*)')
      .eq('id', episodeId)
      .single()
    if (error) throw error
    return data
  },

  async createEpisode(episode: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('episodes')
      .insert(episode)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateEpisode(episodeId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('episodes')
      .update(updates)
      .eq('id', episodeId)
      .single()
    if (error) throw error
    return data
  },

  // Quiz Questions
  async createQuizQuestion(question: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(question)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateQuizQuestion(questionId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('quiz_questions')
      .update(updates)
      .eq('id', questionId)
      .single()
    if (error) throw error
    return data
  },

  async deleteQuizQuestion(questionId: string) {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId)
    if (error) throw error
  },

  // User Progress
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*, episodes(title, course_id, courses(title))')
      .eq('user_id', userId)
    if (error) throw error
    return data
  },

  async getProgressForEpisode(userId: string, episodeId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('episode_id', episodeId)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async upsertProgress(progress: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progress)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Consent Records
  async getConsentRecords(userId: string) {
    const { data, error } = await supabase
      .from('consent_records')
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    return data
  },

  async createConsentRecord(consent: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('consent_records')
      .insert(consent)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async revokeConsent(consentId: string) {
    const { data, error } = await supabase
      .from('consent_records')
      .update({ granted: false, revoked_at: new Date().toISOString() })
      .eq('id', consentId)
      .single()
    if (error) throw error
    return data
  },

  // Analytics
  async getAnalytics(orgId: string) {
    // This would typically be a more complex query or use database functions
    const { data: courses } = await supabase
      .from('courses')
      .select('id')
      .eq('organization_id', orgId)

    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .in('course_id', courses?.map(c => c.id) || [])

    const completedCount = progress?.filter(p => p.completed).length || 0
    const totalCount = progress?.length || 1

    return {
      totalCourses: courses?.length || 0,
      totalEpisodes: 0, // Would need another query
      totalLearners: new Set(progress?.map(p => p.user_id)).size,
      averageCompletionRate: (completedCount / totalCount) * 100,
      averageQuizScore: progress?.reduce((acc, p) => acc + (p.score || 0), 0) / totalCount || 0,
    }
  },

  // File Storage
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    if (error) throw error
    return data
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data.publicUrl
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    if (error) throw error
  },
}
