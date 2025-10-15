import { useEffect, useState } from 'react'

export function useCategory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")

  function setSelectCategory (category: string) {
    setSelectedCategory(category)
  }

  useEffect(() => {
  }, [selectedCategory])

  return {
    selectedCategory,
    setSelectCategory,
  }
}