import { useEffect, useState } from 'react'

export function useCategory() {
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, nome?: string } | undefined>()

  function setSelectCategory(category: { id: string, nome?: string } | undefined) {
    setSelectedCategory(category)
  }

  return {
    selectedCategory,
    setSelectCategory,
  }
}