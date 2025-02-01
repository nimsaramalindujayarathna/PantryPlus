import { supabase } from '../supabase/client'
import { ref, set } from 'firebase/database'
import { db } from '../firebase/client'

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  userId: string
}

export async function register({ email, password, firstName, lastName, userId }: RegisterData) {
  try {
    // Create user in Supabase
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          firebase_user_id: userId
        }
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('rate_limit')) {
        throw new Error('Please wait a moment before trying again')
      }
      throw signUpError
    }

    if (!user) {
      throw new Error('Registration failed')
    }

    // Initialize Firebase data structure for the user
    const userRef = ref(db, userId)
    const loadCells = {}
    
    // Initialize all 20 load cells with 0 weight
    for (let i = 1; i <= 20; i++) {
      const loadCellId = `loadCell${String(i).padStart(2, '0')}`
      loadCells[loadCellId] = { weight: 0 }
    }
    
    await set(userRef, loadCells)

    // Create profile in Supabase
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        firebase_user_id: userId
      }])

    if (profileError) {
      // Cleanup Firebase data if profile creation fails
      await set(userRef, null)
      await supabase.auth.signOut()
      throw new Error('Failed to create profile. Please try again.')
    }

    return user
  } catch (error: any) {
    if (error.message) {
      throw error
    }
    throw new Error('Registration failed. Please try again.')
  }
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  return data
}