"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface CourseFiltersProps {
  onFiltersChange: (filters: {
    search: string
    category: string
    difficulty: string
    priceRange: string
    sortBy: string
  }) => void
  totalResults: number
}

const categories = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Data Science",
  "Photography",
  "Music",
  "Language",
  "Health & Fitness",
  "Personal Development",
]

const difficulties = ["beginner", "intermediate", "advanced"]
const priceRanges = [
  { label: "Free", value: "0-0" },
  { label: "$1 - $50", value: "1-50" },
  { label: "$51 - $100", value: "51-100" },
  { label: "$101 - $200", value: "101-200" },
  { label: "$200+", value: "200" },
]

const sortOptions = [
  { label: "Newest", value: "created_at" },
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
]

export function CourseFilters({ onFiltersChange, totalResults }: CourseFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    difficulty: "all",
    priceRange: "all",
    sortBy: "created_at",
  })

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared = {
      search: "",
      category: "all",
      difficulty: "all",
      priceRange: "all",
      sortBy: "created_at",
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "created_at" && value !== "all",
  ).length

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Courses</SheetTitle>
                <SheetDescription>Narrow down your search with these filters</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={filters.difficulty} onValueChange={(value) => updateFilters({ difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={filters.priceRange} onValueChange={(value) => updateFilters({ priceRange: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any price</SelectItem>
                      {priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ category: "all" })} />
            </Badge>
          )}
          {filters.difficulty !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Level: {filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ difficulty: "all" })} />
            </Badge>
          )}
          {filters.priceRange !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Price: {priceRanges.find((r) => r.value === filters.priceRange)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilters({ priceRange: "all" })} />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {totalResults} course{totalResults !== 1 ? "s" : ""} found
      </div>
    </div>
  )
}
