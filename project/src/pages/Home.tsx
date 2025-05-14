import React, { useEffect, useState } from 'react';
import { Project, api, mockProjects } from '../lib/supabase';
import { Search } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import FilterSidebar from '../components/FilterSidebar';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [userCurrency, setUserCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    // Detect user's region and set currency
    const detectUserRegion = async () => {
      try {
        // Default to USD if region detection fails
        const defaultCurrency = { currency: 'USD', country: 'US', region: 'Unknown' };
        
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-region`, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error('Region detection failed');
          }

          const data = await response.json();
          const currency = data.currency || defaultCurrency.currency;
          setUserCurrency(currency);
          
          // For demo purposes, using fixed exchange rates
          const rates = { USD: 1, EUR: 0.85, GBP: 0.73, INR: 83 };
          setExchangeRate(rates[currency] || 1);
        } catch (error) {
          console.error('Error detecting region:', error);
          // Fallback to default values
          setUserCurrency(defaultCurrency.currency);
          setExchangeRate(1);
        }
      } catch (error) {
        console.error('Error in region detection:', error);
        // Final fallback
        setUserCurrency('USD');
        setExchangeRate(1);
      }
    };
    detectUserRegion();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await api.getProjects();
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
        
        const tags = new Set<string>();
        fetchedProjects.forEach((project) => {
          project.tags.forEach((tag) => {
            tags.add(tag);
          });
        });
        setAvailableTags(Array.from(tags));
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use mock data as fallback
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        
        const tags = new Set<string>();
        mockProjects.forEach((project) => {
          project.tags.forEach((tag) => {
            tags.add(tag);
          });
        });
        setAvailableTags(Array.from(tags));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleApplyFilters = async (filters: {
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setLoading(true);
    try {
      const filteredProjects = await api.getProjects(filters);
      setFilteredProjects(filteredProjects);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    const convertedPrice = price * exchangeRate;
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: userCurrency,
    }).format(convertedPrice);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search projects, technologies..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <FilterSidebar 
              onApplyFilters={handleApplyFilters}
              availableTags={availableTags}
            />
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">
                Available Projects <span className="text-gray-500">({filteredProjects.length})</span>
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
