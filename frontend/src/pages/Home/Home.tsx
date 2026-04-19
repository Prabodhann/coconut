import React, { useState } from 'react'
import Header from '@/components/Header/Header'
import ExploreMenu from '@/components/ExploreMenu/ExploreMenu'
import FoodDisplay from '@/components/FoodDisplay/FoodDisplay'
import AppDownload from '@/components/AppDownload/AppDownload'
import { VercelV0Chat } from '@/components/ui/v0-ai-chat'

const Home: React.FC = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiItemIds, setAiItemIds] = useState<string[] | null>(null);

  const handleAiResult = (itemIds: string[]) => {
    setAiItemIds(itemIds);
    setSearchQuery(""); // clear fallback text search
    // Smooth scroll down to the food grid
    setTimeout(() => {
      const element = document.getElementById('food-display');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500); // slight delay to allow UI to render chat
  };

  return (
    <div className="flex flex-col gap-12 w-full pt-10">
      
      {/* Next-gen AI Search hero from 21st.dev component patterns */}
      <section className="w-full flex justify-center py-16">
        <VercelV0Chat onAiResult={handleAiResult} />
      </section>

      {/* Legacy Header kept for context / backup, but we might remove it if V0Chat replaces it */}
      {/* <Header/> */}

      <div className="container mx-auto px-4 md:px-8 space-y-16">
        <ExploreMenu setCategory={setCategory} category={category}/>
        <FoodDisplay category={category} searchQuery={searchQuery} aiItemIds={aiItemIds} />
        <AppDownload/>
      </div>
    </div>
  )
}

export default Home
