import { FormBlock } from "@/app/store/form-builder"

export interface FormData {
  title: string
  description?: string
  settings?: {
    theme?: {
      backgroundColor?: string
      questionColor?: string
      answerColor?: string
      buttonColor?: string
      buttonTextColor?: string
      font?: string
      logo?: string
      backgroundImage?: string
    }
    successMessage?: string
  }
  blocks: (FormBlock & { order: number })[]
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function handleResponse(response: Response) {
  const data = await response.json()
  
  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'An error occurred')
  }
  
  return data
}

export const api = {
  async createForm(data: FormData) {
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async updateForm(formId: string, data: FormData) {
    const response = await fetch(`/api/forms/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  async getForm(formId: string) {
    const response = await fetch(`/api/forms/${formId}`)
    return handleResponse(response)
  },

  async getForms() {
    const response = await fetch('/api/forms')
    return handleResponse(response)
  },

  async deleteForm(formId: string) {
    const response = await fetch(`/api/forms/${formId}`, {
      method: 'DELETE'
    })
    return handleResponse(response)
  }
}