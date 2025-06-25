
"use client";

import type { Facility, FilterOption } from '@/lib/types';
import { useState, useMemo } from 'react';
import { FacilityCard } from './FacilityCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, X } from 'lucide-react';
import { FACILITY_TYPES, LOCATIONS } from '@/lib/constants';

const ALL_FILTER_VALUE = "_all_";

const FilterSelect = ({
  placeholder,
  options,
  value,
  onValueChange,
}: {
  placeholder: string;
  options: FilterOption[];
  value: string;
  onValueChange: (value: string) => void;
}) => (
  <Select value={value || ALL_FILTER_VALUE} onValueChange={onValueChange}>
    <SelectTrigger className="w-full md:w-[180px] bg-card">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={ALL_FILTER_VALUE}>All</SelectItem>
      {options.map(option => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export function FacilitiesList({ initialFacilities }: { initialFacilities: Facility[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ type: '', location: '' });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  const filteredFacilities = useMemo(() => {
    return initialFacilities.filter(facility => {
      const nameMatch = facility.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filters.type ? facility.type.toLowerCase() === filters.type.toLowerCase() : true;
      const locationMatch = filters.location ? facility.location.toLowerCase() === filters.location.toLowerCase() : true;
      
      return nameMatch && typeMatch && locationMatch;
    });
  }, [searchTerm, filters, initialFacilities]);

  return (
    <div>
      <div className="mb-8 p-4 md:p-6 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2 lg:col-span-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by facility name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 text-base pl-10"
                aria-label="Search by facility name"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <FilterSelect
            placeholder="Facility Type"
            options={FACILITY_TYPES}
            value={filters.type}
            onValueChange={(value) => handleFilterChange('type', value === ALL_FILTER_VALUE ? '' : value)}
          />
          <FilterSelect
            placeholder="Location"
            options={LOCATIONS}
            value={filters.location}
            onValueChange={(value) => handleFilterChange('location', value === ALL_FILTER_VALUE ? '' : value)}
          />
        </div>
        {activeFilterCount > 0 && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={clearFilters} className="text-primary">
              <X className="mr-2 h-4 w-4" />
              Clear Filters ({activeFilterCount})
            </Button>
          </div>
        )}
      </div>

      {filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredFacilities.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ListFilter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No facilities found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          {activeFilterCount > 0 && (
            <Button variant="outline" onClick={clearFilters} className="mt-6">
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
