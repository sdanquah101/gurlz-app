import React, { useState, useEffect } from 'react';
import FilterSection from './FilterSection';
import PriceFilter from './PriceFilter';
import RatingFilter from './RatingFilter';
import { beautyFilters, fashionFilters, wellnessFilters, accessoryFilters } from '../../../data/filters';

interface CategoryFiltersProps {
  category: string;
  onFiltersChange: (filters: any) => void;
}

export default function CategoryFilters({ category, onFiltersChange }: CategoryFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['price']);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  // Use effect to update filters when any filter state changes
  useEffect(() => {
    onFiltersChange({
      ...selectedOptions,
      priceRange,
      rating: selectedRating
    });
  }, [selectedOptions, priceRange, selectedRating, onFiltersChange]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleOptionToggle = (section: string, option: string) => {
    setSelectedOptions(prev => {
      const current = prev[section] || [];
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      
      return {
        ...prev,
        [section]: updated
      };
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  const handleRatingChange = (rating: number | null) => {
    setSelectedRating(rating);
  };

  const getCategoryFilters = () => {
    switch (category) {
      case 'beauty': return beautyFilters;
      case 'fashion': return fashionFilters;
      case 'wellness': return wellnessFilters;
      case 'accessories': return accessoryFilters;
      default: return {};
    }
  };

  const filters = getCategoryFilters();

  return (
    <div className="bg-white rounded-xl p-6 space-y-2">
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.includes('price')}
        onToggle={() => toggleSection('price')}
      >
        <PriceFilter
          minPrice={priceRange.min}
          maxPrice={priceRange.max}
          onPriceChange={handlePriceChange}
        />
      </FilterSection>

      <FilterSection
        title="Rating"
        isExpanded={expandedSections.includes('rating')}
        onToggle={() => toggleSection('rating')}
      >
        <RatingFilter
          selectedRating={selectedRating}
          onRatingChange={handleRatingChange}
        />
      </FilterSection>

      {Object.entries(filters).map(([section, options]) => (
        <FilterSection
          key={section}
          title={section.charAt(0).toUpperCase() + section.slice(1)}
          isExpanded={expandedSections.includes(section)}
          onToggle={() => toggleSection(section)}
        >
          <div className="space-y-2">
            {options.map((option: string) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions[section]?.includes(option) || false}
                  onChange={() => handleOptionToggle(section, option)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      ))}
    </div>
  );
}