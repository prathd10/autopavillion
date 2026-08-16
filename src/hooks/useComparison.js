import { useState, useEffect } from 'react';

const STORAGE_KEY = 'autopavilion_compare_ids';
const CHANGE_EVENT = 'autopavilion-compare-change';

export function useComparison() {
  const [compareIds, setCompareIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          setCompareIds(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
    };

    const handleCustomChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setCompareIds(stored ? JSON.parse(stored) : []);
      } catch {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CHANGE_EVENT, handleCustomChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CHANGE_EVENT, handleCustomChange);
    };
  }, []);

  const toggleCompare = (id) => {
    if (!id) return;
    let newIds = [...compareIds];
    const isComparing = newIds.includes(id);

    if (isComparing) {
      newIds = newIds.filter(x => x !== id);
    } else {
      if (newIds.length >= 2) {
        alert('You can compare a maximum of 2 vehicles side-by-side.');
        return;
      }
      newIds.push(id);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    setCompareIds(newIds);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const removeCompare = (id) => {
    const newIds = compareIds.filter(x => x !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
    setCompareIds(newIds);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const clearCompare = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    setCompareIds([]);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return {
    compareIds,
    toggleCompare,
    removeCompare,
    clearCompare,
    isComparing: (id) => compareIds.includes(id)
  };
}
