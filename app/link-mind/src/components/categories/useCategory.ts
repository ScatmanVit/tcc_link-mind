import { useEffect, useState } from 'react'

export function useCategory() {
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  function setSelectCategory (category: string) {
    setSelectedCategory(category)
  }

  useEffect(() => {
    console.log(selectedCategory)
  }, [selectedCategory])

  return {
    selectedCategory,
    setSelectCategory,
  }
}