import React, {useState} from "react";

export const contents = [
    {
      tab : "Section 1",
      content : "I'm the content of te Section1"
    },
    {
      tab : "Section 2",
      content : "I'm the content of te Section2"
    }
];

export const useTabs = (initialTab, allTabs) => {
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  if(!allTabs || !Array.isArray(allTabs)){
    return;
  }
  return {
    currentItem : allTabs[currentIndex],
    changeItem : setCurrentIndex,
  }
}

