import React, { useState, useEffect } from 'react'
import ExploreMenu from '@/components/ExploreMenu/ExploreMenu'
import FoodDisplay from '@/components/FoodDisplay/FoodDisplay'
import AppDownload from '@/components/AppDownload/AppDownload'
import { VercelV0Chat } from '@/components/ui/v0-ai-chat'

const Home: React.FC = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiItemIds, setAiItemIds] = useState<string[] | null>(null);

  // Auto-scroll to food display when category changes
  useEffect(() => {
    // Only scroll if a specific category is selected (not on first load 'All')
    if (category !== "All") {
      const element = document.getElementById('food-display');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [category]);

  const handleAiResult = (itemIds: string[]) => {
    setAiItemIds(itemIds);
    setSearchQuery(""); // clear fallback text search
    // Smooth scroll down to the food grid
    const element = document.getElementById('food-display');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full pt-6">
      
      {/* Next-gen AI Search hero from 21st.dev component patterns */}
      <section className="w-full flex justify-center py-8">
        <VercelV0Chat onAiResult={handleAiResult} />
      </section>

      <div className="container mx-auto px-4 md:px-8 space-y-6">
        <ExploreMenu setCategory={setCategory} category={category}/>
        <FoodDisplay category={category} searchQuery={searchQuery} aiItemIds={aiItemIds} />
        <AppDownload/>
      </div>
    </div>
  )
}

export default Home
